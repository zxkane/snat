/* eslint @typescript-eslint/no-require-imports: "off" */
import '@aws-cdk/assert/jest';
import { ResourcePart } from '@aws-cdk/assert/lib/assertions/have-resource';
import { App, Stack } from 'aws-cdk-lib';
import { Vpc, SubnetType, InstanceType, InstanceSize, InstanceClass } from 'aws-cdk-lib/aws-ec2';
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
        subnetType: SubnetType.PRIVATE,
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
          subnetType: SubnetType.ISOLATED,
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

    expect(stack).toHaveResourceLike('AWS::EC2::Instance', {
      InstanceType: 't3.micro',
    });
    expect(stack).toCountResources('AWS::EC2::Instance', 2);

    expect(stack).toHaveResourceLike('AWS::EC2::Route', {
      DestinationCidrBlock: '2.2.0.0/20',
      NetworkInterfaceId: {
        Ref: 'VPC1PublicSubnet1ENI1B5B83581',
      },
      RouteTableId: {
        Ref: 'VPC1PrivateSubnet1RouteTable0621C09F',
      },
    });
    expect(stack).toCountResources('AWS::EC2::Route', 6);

    expect(stack).toHaveResourceLike('AWS::EC2::EIP', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    }, ResourcePart.CompleteDefinition);
    expect(stack).toHaveResourceLike('AWS::EC2::NetworkInterface', {
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
    expect(stack).toHaveResourceLike('AWS::EC2::EIPAssociation', {
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

    expect(stack).toHaveResourceLike('AWS::EC2::Route', {
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
        subnetType: SubnetType.ISOLATED,
      },
    }).addV4Route('0.0.0.0/0');

    expect(stack).toCountResources('AWS::EC2::Instance', 2);

    expect(stack).toHaveResourceLike('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NetworkInterfaceId: {
        Ref: 'VPC1PublicSubnet1ENI1B5B83581',
      },
      RouteTableId: {
        Ref: 'VPC1IsolatedSubnet1RouteTable17554539',
      },
    });
    expect(stack).toCountResources('AWS::EC2::Route', 4);
  });

  test('create NAT instances with custom instance type', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.C5, InstanceSize.LARGE),
    }).addV4Route('1.1.0.0/24');

    expect(stack).toHaveResourceLike('AWS::EC2::Instance', {
      InstanceType: 'c5.large',
    });
  });

  test('create NAT instances for github routes', () => {

    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC-1');

    new SimpleNAT(stack, 'nat', {
      vpc,
    }).withGithubRoute();

    const githubMeta = fetch('https://api.github.com/meta').json();

    for (const cidr of githubMeta.git) {
      expect(stack).toHaveResourceLike('AWS::EC2::Route', {
        DestinationCidrBlock: cidr,
        NetworkInterfaceId: {
          Ref: 'VPC1PublicSubnet2ENI1EB7B542A',
        },
        RouteTableId: {
          Ref: 'VPC1PrivateSubnet2RouteTableE015DA08',
        },
      });
    }

    expect(stack).toCountResources('AWS::EC2::Route', 4 + githubMeta.git.length * 2);
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

    expect(stack).toCountResources('AWS::EC2::Route', 1);
  });
});