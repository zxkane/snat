# SimpleNAT example

It's an example CDK application using SimpleNAT. This application create NAT instances that provisions [sshuttle][sshuttle] setuping tunnel for specified IP ranges.

## Prerequisites
- create below two [Systems Manager][systems-manager] parameters for storing remote host information and private key of SSH.
  - `remote-key` the private key of remote server
  - `remote-host` the host information of remote server, for example, `user@remote-server-ip`
- the existing VPC with public subnets and private/isolate subnets
   
## How to deploy
```
yarn install --check-files --frozen-lockfile
npx cdk deploy -c vpcId=<the vpcId of existing vpc>
```

## FAQ
### What's the difference between [EC2 NAT instances][nat-instances] and NAT instances created by this construct

There are below differences,

- NAT instance will route all Internet traffic to itself
- NAT instance uses depracated Amazon Linux AMI, this construct always uses latest Amazon Linux 2 AMI
- NAT instances created by this construct can work with NAT gateways together, you can have multiple NAT instances in one VPC
- This construct can help when only routing specific traffic(for example, github/gist) to NAT instances which acts as transit proxy 

[sshuttle]: https://github.com/sshuttle/sshuttle
[systems-manager]: https://aws.amazon.com/systems-manager/
[nat-instances]: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html#using-nat-instances