import { Construct } from 'constructs';
import { App, Stack, StackProps, Arn, Aws } from 'aws-cdk-lib';
import { SimpleNAT } from 'cdk-construct-simple-nat';
import { Vpc, GatewayVpcEndpointAwsService, SubnetType, InstanceType, InstanceSize, InstanceClass, MachineImage, AmazonLinuxCpuType, AmazonLinuxGeneration } from 'aws-cdk-lib/aws-ec2';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
const fetch = require('sync-fetch');

export class SimpleNATStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpcId = this.node.tryGetContext('vpcId');
    const vpc = vpcId ? Vpc.fromLookup(this, 'TheVpc', {
      vpcId: vpcId === 'default' ? undefined : vpcId,
      isDefault: vpcId === 'default' ? true : undefined,
    }) : new Vpc(this, 'Vpc', {
      maxAzs: 2,
      gatewayEndpoints: {
        s3: {
          service: GatewayVpcEndpointAwsService.S3,
        },
        dynamodb: {
          service: GatewayVpcEndpointAwsService.DYNAMODB,
        },
      },
    });
    
    if (vpc.publicSubnets.length < 1) {
      throw new Error('The VPC must have PUBLIC subnet.');
    }
    
    const keyParaName = this.node.tryGetContext('RemoteKeyName') ?? 'remote-key';
    const hostParaName = this.node.tryGetContext('RemoteHostName') ?? 'remote-host';
    const role = new Role(this, 'NatRole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      inlinePolicies: {
        ssm: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: [
                  'ssm:GetParameter',
                ],
                resources: [
                  Arn.format({
                    service: 'ssm',
                    resource: 'parameter',
                    resourceName: keyParaName,
                  }, Stack.of(this)),
                  Arn.format({
                    service: 'ssm',
                    resource: 'parameter',
                    resourceName: hostParaName,
                  }, Stack.of(this)),
                ],
              }),
            ],
        }),
        kms: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: [
                  'kms:Decrypt',
                ],
                resources: ['*'],
              }),
            ],
        }),
      },
    });
    
    const IPs = [
      // '74.125.0.0/16',
      // '172.217.0.0/16',
    ];
    
    const ipV6Regex = new RegExp(SimpleNAT.Ipv6Regex);
    const githubMeta = fetch('https://api.github.com/meta').json();
    for (const cidr of githubMeta.git) {
      if (!ipV6Regex.test(cidr)) {
        IPs.push(cidr);
      }
    }

    const nat = new SimpleNAT(this, 'SimpleNAT', {
      vpc,
      natSubnetsSelection: {
        subnetType: SubnetType.PUBLIC,
        // availabilityZones: ['cn-northwest-1a'],
        onePerAz: true,
      },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: AmazonLinuxCpuType.ARM_64,
      }),
      customScripts: `#!/bin/bash -x
yum install -y python3-pip gcc python3-devel
pip3 install -i https://opentuna.cn/pypi/web/simple sshuttle
groupadd sshuttle
useradd -d /home/sshuttle -g sshuttle sshuttle
mkdir /home/sshuttle/.ssh
chmod 700 /home/sshuttle/.ssh
aws ssm get-parameter --name ${keyParaName} --region ${Aws.REGION} --with-decryption|jq -r '.Parameter.Value' > /home/sshuttle/.ssh/id_rsa_remote
REMOTE_HOST=$(aws ssm get-parameter --name ${hostParaName} --region ${Aws.REGION} --with-decryption|jq -r '.Parameter.Value')
chmod 400 /home/sshuttle/.ssh/id_rsa_remote
chown -R sshuttle:sshuttle /home/sshuttle
sshuttle --sudoers --sudoers-user sshuttle
cat > /usr/lib/systemd/system/sshuttle.service << EOF
[Unit]
Description=sshuttle service
After=network.target
[Service]
User=sshuttle
Restart=always
Type=forking
WorkingDirectory=/home/sshuttle
ExecStart=/usr/local/bin/sshuttle -D --listen 0.0.0.0:0 -e 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i /home/sshuttle/.ssh/id_rsa_remote' -r $REMOTE_HOST ${IPs.join(' ')}
ExecStop=killall sshuttle
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl start sshuttle
      `,
      role,
    });
    
    IPs.forEach(ip => { nat.addV4Route(ip)});
  }
}

const app = new App();

const vpcId = app.node.tryGetContext('vpcId');
const env = vpcId ? {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
} : undefined;

new SimpleNATStack(app, 'simple-nat-stack', {
  env: env,
});

app.synth();