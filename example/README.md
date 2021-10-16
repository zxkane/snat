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

[sshuttle]: https://github.com/sshuttle/sshuttle
[systems-manager]: https://aws.amazon.com/systems-manager/
