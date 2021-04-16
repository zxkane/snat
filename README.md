# Simple NAT

It's a CDK construct to create NAT instances on AWS. 

It supports adding specific IP CIDRs to route tables of VPC, the network traffic to those IP CIDRs will be forwarded to the NAT instances.

![Arch diagram](arch.png)

## Usage

```ts
new SimpleNAT(this, 'SimpleNAT', {
  vpc,
  natSubnetsSelection: {
    subnetType: SubnetType.PUBLIC,
    onePerAz: true,
  },
})
.withGithubRoute();
```

See the complete [example](example/).
