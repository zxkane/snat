/* eslint @typescript-eslint/no-require-imports: "off" */
import * as fs from 'fs';
import * as path from 'path';
import { Resource, RemovalPolicy, Duration, Tags, Annotations } from 'aws-cdk-lib';
import {
  IVpc, SubnetSelection, Instance, InstanceClass, InstanceSize,
  InstanceType, SubnetType, Peer, SecurityGroup, ISecurityGroup, Port,
  CfnRoute, ISubnet, Subnet, RouterType, AddRouteOptions,
  MachineImage, AmazonLinuxStorage, AmazonLinuxCpuType,
  CfnNetworkInterface, CfnEIP, CfnEIPAssociation,
  CloudFormationInit, InitConfig, InitFile, InitPackage, InitCommand, IMachineImage, OperatingSystemType,
  KeyPair,
} from 'aws-cdk-lib/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal, PolicyStatement, IRole } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as Mustache from 'mustache';
const fetch = require('sync-fetch');

/**
 * Properties for NAT instances
 */
export interface SimpleNATProps {
  /**
   * The VPC the NAT instances will reside
   */
  readonly vpc: IVpc;
  /**
   * The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets.
   *
   * NOTE: must select the public subnet
   *
   * @default - subnetType is SubnetType.PUBLIC and onePerAZ is true.
   */
  readonly natSubnetsSelection?: SubnetSelection;
  /**
   * The subnet selection for updating route tables for selected subnets.
   *
   * @default - subnetType is SubnetType.PRIVATE_WITH_NAT.
   */
  readonly privateSubnetsSelection?: SubnetSelection;
  /**
   * The instance type of NAT instances
   *
   * @default - t3.MICRO.
   */
  readonly instanceType?: InstanceType;
  /**
   * The AMI of NAT instances
   *
   * @default - Amazon Linux 2 for x86_64.
   */
  readonly machineImage?: IMachineImage;
  /**
   * The key name of ssh key of NAT instances.
   *
   * @default - No SSH access will be possible.
   */
  readonly keyName?: string;
  /**
   * The custom script when provisioning the NAT instances.
   *
   * @default - no custom script.
   */
  readonly customScripts?: string;
  /**
   * The IAM role attached to NAT instances.
   *
   * @default - an IAM role is created.
   */
  readonly role?: IRole;
}

interface NATInstance {
  readonly instance: Instance;
  readonly eni: CfnNetworkInterface;
}

interface RouteStats {
  ipv4: number;
  ipv6: number;
}

/**
 * Properties for how adding IPs to route
 */
export interface RouteProps {
  /**
   * If excluding IPv6 when creating route
   *
   * @default - false
   */
  readonly excludeIPv6?: boolean;
}

/**
 * Simple NAT instances construct.
 */
export class SimpleNAT extends Resource {

  static readonly Ipv6Regex = '^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$';

  private gateways: PrefSet<NATInstance> = new PrefSet<NATInstance>();
  private _securityGroup: ISecurityGroup;
  private _routeMappingSubnets: Map<string, Subnet[]>;
  private _routeTablesLimit: Map<string, RouteStats> = new Map();

  private readonly _defaultRoutesPerTable = 50;
  private readonly _ipV6Regex = new RegExp(SimpleNAT.Ipv6Regex);

  constructor(scope: Construct, id: string, props: SimpleNATProps) {
    super(scope, id);

    let subnets;
    try {
      subnets = props.vpc.selectSubnets(props.natSubnetsSelection ?? {
        subnetType: SubnetType.PUBLIC,
        onePerAz: true,
      });
    } catch (e) {
      throw new Error('NAT instances must reside in public subnets.');
    }

    if (!subnets.hasPublic) {throw new Error('The custom NAT subnet selection MUST select PUBLIC subnets.');}

    const machineImage = props.machineImage ?? MachineImage.latestAmazonLinux2({
      storage: AmazonLinuxStorage.GENERAL_PURPOSE,
      cpuType: AmazonLinuxCpuType.X86_64,
    });

    if (machineImage.getImage(this).osType != OperatingSystemType.LINUX) {throw new Error('The OS of custom AMI must be Linux.');}

    this._securityGroup = new SecurityGroup(scope, 'NatSecurityGroup', {
      vpc: props.vpc,
      description: 'Security Group for NAT instances',
      allowAllOutbound: true,
    });
    this._securityGroup.addIngressRule(Peer.ipv4(props.vpc.vpcCidrBlock), Port.allTraffic());

    const role = props.role ?? new Role(scope, 'NatRole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'ec2:AttachNetworkInterface',
        'ec2:DetachNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
      ],
      resources: ['*'],
    }));

    for (const sub of subnets.subnets) {

      const eni = new CfnNetworkInterface(sub as Subnet, 'ENI1', {
        subnetId: sub.subnetId,
        sourceDestCheck: false,
        description: 'ENI for binding EIP',
        groupSet: [this._securityGroup.securityGroupId],
      });
      const eip = new CfnEIP(sub as Subnet, 'NatInstanceEIP', {
        tags: [
          {
            key: 'Name',
            value: `EIP for NAT instance in subnet '${sub.subnetId}'.`,
          },
        ],
      });
      eip.applyRemovalPolicy(RemovalPolicy.RETAIN);
      new CfnEIPAssociation(sub as Subnet, 'EIPAssociation', {
        allocationId: eip.attrAllocationId,
        networkInterfaceId: eni.ref,
      });

      const configs = [
        InitFile.fromFileInline('/opt/nat/snat.sh', path.join(__dirname, 'snat.sh'), {
          mode: '000755',
        }),
        InitFile.fromFileInline('/etc/systemd/system/snat.service', path.join(__dirname, 'snat.service')),
        InitFile.fromString('/opt/nat/runonce.sh',
          Mustache.render(fs.readFileSync(path.join(__dirname, 'runonce.sh'), 'utf-8'), {
            eniId: eni.ref,
          }), {
            mode: '000755',
          }),
        InitCommand.shellCommand('/opt/nat/runonce.sh'),
      ];
      if (props.customScripts) {
        configs.push(InitFile.fromString('/opt/nat/custom.sh', props.customScripts, {
          mode: '000755',
        }));
        configs.push(InitCommand.shellCommand('/opt/nat/custom.sh'));
      }
      const natInstance = new Instance(sub as Subnet, 'NatInstance', {
        instanceType: props.instanceType ?? InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        machineImage,
        vpc: props.vpc,
        vpcSubnets: { subnets: [sub] },
        securityGroup: this._securityGroup,
        role,
        keyPair: props.keyName ? KeyPair.fromKeyPairName(this, 'KeyPair', props.keyName) : undefined,
        init: CloudFormationInit.fromConfigSets({
          configSets: {
            default: ['yumPreinstall', 'config'],
          },
          configs: {
            yumPreinstall: new InitConfig([
              // Install an Amazon Linux package using yum
              InitPackage.yum('jq'),
            ]),
            config: new InitConfig(configs),
          },
        }),
        initOptions: {
          // Optional, which configsets to activate (['default'] by default)
          configSets: ['default'],
          timeout: Duration.minutes(5 + (props.customScripts ? 10 : 0)),
        },
      });

      // NAT instance routes all traffic, both ways
      this.gateways.add(sub.availabilityZone, {
        instance: natInstance,
        eni,
      });
    }

    this._routeMappingSubnets = props.vpc.selectSubnets(props.privateSubnetsSelection ?? {
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    }).subnets.reduce((routeMapping, sub) => {
      if (routeMapping.has(sub.routeTable.routeTableId)) {
        routeMapping.get(sub.routeTable.routeTableId).push(sub);
      } else {
        routeMapping.set(sub.routeTable.routeTableId, [sub]);
      }
      return routeMapping;
    }, new Map());

    Tags.of(this).add('construct', 'simple-nat');
  }

  public addV4Route(v4CIDR: string): SimpleNAT {
    // Add routes to them in the private subnets
    for (const [routeId, subnets] of this._routeMappingSubnets) {
      this._configureSubnet(routeId, subnets, v4CIDR);
    }
    return this;
  }

  public addV6Route(v6CIDR: string): SimpleNAT {
    // Add routes to them in the private subnets
    for (const [routeId, subnets] of this._routeMappingSubnets) {
      this._configureSubnet(routeId, subnets, undefined, v6CIDR);
    }
    return this;
  }

  /**
   * Add Github IPs to route table
   */
  public withGithubRoute(props?: RouteProps): SimpleNAT {
    const githubMeta = fetch('https://api.github.com/meta').json();
    for (const cidr of githubMeta.git) {
      for (const [routeId, subnets] of this._routeMappingSubnets) {
        if (this._ipV6Regex.test(cidr)) {
          const excludeIPv6 = props?.excludeIPv6 ?? false;
          if (!excludeIPv6) {this._configureSubnet(routeId, subnets, undefined, cidr);}
        } else {
          this._configureSubnet(routeId, subnets, cidr);
        }
      }
    }
    return this;
  }

  /**
   * Add Google IPs to route table
   */
  public withGoogleRoute(props?: RouteProps): SimpleNAT {
    const googleMeta = fetch('https://www.gstatic.com/ipranges/goog.json').json();
    const excludeIPv6 = props?.excludeIPv6 ?? false;
    for (const cidr of googleMeta.prefixes) {
      for (const [routeId, subnets] of this._routeMappingSubnets) {
        if (cidr.ipv4Prefix) {this._configureSubnet(routeId, subnets, cidr.ipv4Prefix);}
        if (cidr.ipv6Prefix && !excludeIPv6) {this._configureSubnet(routeId, subnets, undefined, cidr.ipv6Prefix);}
      }
    }
    return this;
  }

  /**
   * Add Cloudflare IPs to route table
   *
   * See https://www.cloudflare.com/ips/ for details
   */
  public withCloudflareRoute(props?: RouteProps): SimpleNAT {
    const ipV4 = fetch('https://www.cloudflare.com/ips-v4').text().split(/\r?\n/);
    for (const cidr of ipV4) {
      for (const [routeId, subnets] of this._routeMappingSubnets) {
        this._configureSubnet(routeId, subnets, cidr);
      }
    }
    const excludeIPv6 = props?.excludeIPv6 ?? false;
    if (!excludeIPv6) {
      const ipV6 = fetch('https://www.cloudflare.com/ips-v6').text().split(/\r?\n/);
      for (const cidr of ipV6) {
        for (const [routeId, subnets] of this._routeMappingSubnets) {
          this._configureSubnet(routeId, subnets, undefined, cidr);
        }
      }
    }
    return this;
  }

  private _configureSubnet(_routeId: string, subnets: Subnet[], v4CIDR?: string, v6CIDR?: string) : SimpleNAT {
    const az = subnets[0].availabilityZone;
    const natInstance = this.gateways.pick(az);
    this._addRoute(`Route-${v4CIDR ? 'v4-' + v4CIDR?.replace(/[\./]/gi, '-') : 'v6-' + v6CIDR?.replace(/[:/]/gi, '-')}`, subnets[0], {
      destinationCidrBlock: v4CIDR,
      destinationIpv6CidrBlock: v6CIDR,
      routerType: RouterType.NETWORK_INTERFACE,
      routerId: natInstance.eni.ref,
      enablesInternetConnectivity: true,
    });
    return this;
  }

  private _addRoute(id: string, subnet: ISubnet, options: AddRouteOptions) {
    if (options.destinationCidrBlock && options.destinationIpv6CidrBlock) {
      throw new Error('Cannot specify both \'destinationCidrBlock\' and \'destinationIpv6CidrBlock\'');
    }

    new CfnRoute(subnet as Subnet, id, {
      routeTableId: subnet.routeTable.routeTableId,
      destinationCidrBlock: options.destinationCidrBlock || (options.destinationIpv6CidrBlock === undefined ? '0.0.0.0/0' : undefined),
      destinationIpv6CidrBlock: options.destinationIpv6CidrBlock,
      [routerTypeToPropName(options.routerType)]: options.routerId,
    });

    const isIpv4 = (options.destinationCidrBlock != undefined);
    if (this._routeTablesLimit.has(subnet.routeTable.routeTableId)) {
      const stats = this._routeTablesLimit.get(subnet.routeTable.routeTableId)!;
      if (isIpv4) {stats.ipv4 += 1;} else {stats.ipv6 += 1;}

      this._routeTablesLimit.set(subnet.routeTable.routeTableId, stats);
      const totalRoutes = (isIpv4 ? stats.ipv4 : stats.ipv6);
      if (totalRoutes > this._defaultRoutesPerTable) {Annotations.of(this).addWarning(`The current routes in route table '${subnet.routeTable.routeTableId}' is ${totalRoutes} which exceeds the default limit ${this._defaultRoutesPerTable}. You can open ticket to increase it.`);}
    } else {
      this._routeTablesLimit.set(subnet.routeTable.routeTableId, {
        ipv4: isIpv4 ? 1 : 0,
        ipv6: isIpv4 ? 0 : 1,
      });
    }
  }
}

function routerTypeToPropName(routerType: RouterType) {
  switch (routerType) {
    case RouterType.EGRESS_ONLY_INTERNET_GATEWAY: return 'egressOnlyInternetGatewayId';
    case RouterType.GATEWAY: return 'gatewayId';
    case RouterType.INSTANCE: return 'instanceId';
    case RouterType.NAT_GATEWAY: return 'natGatewayId';
    case RouterType.NETWORK_INTERFACE: return 'networkInterfaceId';
    case RouterType.VPC_PEERING_CONNECTION: return 'vpcPeeringConnectionId';
    default: throw new Error('Unsupported router type');
  }
}

/**
 * Preferential set
 *
 * Picks the value with the given key if available, otherwise distributes
 * evenly among the available options.
 */
class PrefSet<A> {
  private readonly map: Record<string, A> = {};
  private readonly vals = new Array<[string, A]>();
  private next: number = 0;

  public add(pref: string, value: A) {
    this.map[pref] = value;
    this.vals.push([pref, value]);
  }

  public pick(pref: string): A {
    if (this.vals.length === 0) {
      throw new Error('Cannot pick, set is empty');
    }

    if (pref in this.map) { return this.map[pref]; }
    return this.vals[this.next++ % this.vals.length][1];
  }

  public values(): Array<[string, A]> {
    return this.vals;
  }
}