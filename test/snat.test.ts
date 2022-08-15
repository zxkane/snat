/* eslint @typescript-eslint/no-require-imports: "off" */
import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Vpc, SubnetType, InstanceType, InstanceSize, InstanceClass, MachineImage, AmazonLinuxGeneration, AmazonLinuxCpuType } from 'aws-cdk-lib/aws-ec2';
import { SimpleNAT } from '../src';
const fetch = require('sync-fetch');

describe('Simple NAT construct', () => {

  test('Snapshot', () => {
    const app = new App();
    const stack = new Stack(app);
    const vpc = new Vpc(stack, 'VPC-1', {
      natGateways: 1,
      maxAzs: 3,
    });

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).addV4Route('1.2.128.0./22');

    expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
  });

  test('custom nat subnets selection without selecting public subnets.', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    expect(() => new SimpleNAT(stack, 'nat', {
      vpc,
      natSubnetsSelection: {
        subnetType: SubnetType.PRIVATE_WITH_NAT,
      },
    })).toThrow('The custom NAT subnet selection MUST select PUBLIC subnets');
  });

  test('create NAT instances in vpc without public subnets', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'application',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    expect(() => new SimpleNAT(stack, 'nat', {
      vpc,
    })).toThrow('NAT instances must reside in public subnets.');
  });

  test('create NAT instances in vpc with NAT gateways', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1', {
      natGateways: 2,
      maxAzs: 2,
    });

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).addV4Route('2.2.0.0/20');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 't3.micro',
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::Instance', 2);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '2.2.0.0/20',
      NetworkInterfaceId: {
        Ref: 'VPC1PublicSubnet1ENI1B5B83581',
      },
      RouteTableId: {
        Ref: 'VPC1PrivateSubnet1RouteTable0621C09F',
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::Route', 6);

    Template.fromStack(stack).hasResource('AWS::EC2::EIP', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::NetworkInterface', {
      GroupSet: [
        {
          'Fn::GetAtt': [
            'NatSecurityGroupEE8043DB',
            'GroupId',
          ],
        },
      ],
      SourceDestCheck: false,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::EIPAssociation', {
      AllocationId: {
        'Fn::GetAtt': [
          'VPC1PublicSubnet1NatInstanceEIPB467978E',
          'AllocationId',
        ],
      },
      NetworkInterfaceId: {
        Ref: 'VPC1PublicSubnet1ENI1B5B83581',
      },
    });
  });

  test('route ipv6 cidr block', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1', {
      natGateways: 2,
      maxAzs: 2,
    });

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).addV4Route('2002::1234:abcd:ffff:c0a8:101/64');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '2002::1234:abcd:ffff:c0a8:101/64',
      NetworkInterfaceId: {
        Ref: 'VPC1PublicSubnet2ENI1EB7B542A',
      },
      RouteTableId: {
        Ref: 'VPC1PrivateSubnet2RouteTableE015DA08',
      },
    });
  });

  test('create NAT instances in vpc without NAT gateways', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1', {
      natGateways: 0,
      maxAzs: 2,
    });

    new SimpleNAT(stack, 'nat', {
      vpc,
      privateSubnetsSelection: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
    }).addV4Route('0.0.0.0/0');

    Template.fromStack(stack).resourceCountIs('AWS::EC2::Instance', 2);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NetworkInterfaceId: {
        Ref: 'VPC1PublicSubnet1ENI1B5B83581',
      },
      RouteTableId: {
        Ref: 'VPC1IsolatedSubnet1RouteTable17554539',
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::EC2::Route', 4);
  });

  test('create NAT instances with custom instance type', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.C5, InstanceSize.LARGE),
    }).addV4Route('1.1.0.0/24');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 'c5.large',
    });
  });

  test('create NAT instances with custom AMI', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.C6G, InstanceSize.LARGE),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: AmazonLinuxCpuType.ARM_64,
      }),
    }).addV4Route('1.1.0.0/24');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 'c6g.large',
      ImageId: {
        Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmarm64gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
      },
    });
  });

  const ipV6Regex = new RegExp(SimpleNAT.Ipv6Regex);
  test('create NAT instances for github routes', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).withGithubRoute();

    const template = Template.fromStack(stack);

    const githubMeta = fetch('https://api.github.com/meta').json();

    for (const cidr of githubMeta.git) {
      if (ipV6Regex.test(cidr)) {
        template.hasResourceProperties('AWS::EC2::Route', {
          DestinationIpv6CidrBlock: Match.exact(cidr),
          NetworkInterfaceId: {
            Ref: 'VPC1PublicSubnet2ENI1EB7B542A',
          },
          RouteTableId: {
            Ref: 'VPC1PrivateSubnet2RouteTableE015DA08',
          },
        });
      } else {
        template.hasResourceProperties('AWS::EC2::Route', {
          DestinationCidrBlock: Match.exact(cidr),
          NetworkInterfaceId: {
            Ref: 'VPC1PublicSubnet2ENI1EB7B542A',
          },
          RouteTableId: {
            Ref: 'VPC1PrivateSubnet2RouteTableE015DA08',
          },
        });
      }
    }

    template.resourceCountIs('AWS::EC2::Route', 4 + githubMeta.git.length * 2);
  });

  test('create NAT instances for google routes excluding IPv6 address', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).withGoogleRoute({
      excludeIPv6: true,
    });

    const googleMeta: {
      prefixes: [
        {
          ipv4Prefix?: string;
          ipv6Prefix?: string;
        }
      ];
    } = fetch('https://www.gstatic.com/ipranges/goog.json').json();
    const ipV6 = googleMeta.prefixes.filter(prefix => prefix.ipv6Prefix);
    expect(ipV6.length).toBeGreaterThan(0);

    expect(Template.fromStack(stack).findResources('AWS::EC2::Route', {
      Properties: {
        DestinationIpv6CidrBlock: Match.anyValue(),
      },
    })).toStrictEqual({});
  });


  test('create NAT instances for aws routes excluding IPv6 address', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-2');

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).withAwsRoutes({
      excludeIPv6: true,
      awsProps: {
        awsRegion: 'ap-south-1',
        awsService: 'AMAZON',
      },
    });

    const awsMeta: {
      syncToken: string;
      createDate: string;
      prefixes: [
        {
          ip_prefix:string;
          region:string;
          service:string;
          network_border_group:string;
        }
      ];
      ipv6_prefixes: [
        {
          ipv6_prefix:string;
          region:string;
          service:string;
          network_border_group:string;
        }
      ];

    } = fetch('https://ip-ranges.amazonaws.com/ip-ranges.json').json();
    const ipV6 = awsMeta.ipv6_prefixes.filter(prefix => prefix.ipv6_prefix );
    expect(ipV6.length).toBeGreaterThan(0);

    expect(Template.fromStack(stack).findResources('AWS::EC2::Route', {
      Properties: {
        DestinationIpv6CidrBlock: Match.anyValue(),
      },
    })).toStrictEqual({});
  });

  test('create NAT instances for cloudflare routes', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).withCloudflareRoute();

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: Match.anyValue(),
      DestinationCidrBlock: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: Match.absent(),
      DestinationCidrBlock: Match.anyValue(),
    });
  });

  test('private subnets of imported vpc share one route table', () => {

    const stack = new Stack();
    const vpc = Vpc.fromVpcAttributes(stack, 'VPC-1', {
      vpcId: 'vpc-12345',
      vpcCidrBlock: '172.31.0.0/16',
      availabilityZones: [
        'cn-northwest-1a',
        'cn-northwest-1b',
        'cn-northwest-1c',
      ],
      publicSubnetIds: [
        'subnet-public-1',
        'subnet-public-2',
        'subnet-public-3',
      ],
      publicSubnetRouteTableIds: [
        'rtb-public-1',
        'rtb-public-1',
        'rtb-public-1',
      ],
      privateSubnetIds: [
        'subnet-private-1',
        'subnet-private-2',
        'subnet-private-3',
      ],
      privateSubnetRouteTableIds: [
        'rtb-private-1',
        'rtb-private-1',
        'rtb-private-1',
      ],
    });

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).addV4Route('1.1.1.0/20');

    Template.fromStack(stack).resourceCountIs('AWS::EC2::Route', 1);
  });
});