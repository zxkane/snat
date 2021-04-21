# Simple NAT

![Release](https://github.com/zxkane/snat/workflows/Release/badge.svg)
[![NPM version](http://img.shields.io/npm/v/cdk-construct-simple-nat.svg?style=flat-square)](https://www.npmjs.com/package/cdk-construct-simple-nat)

It's a CDK construct to create NAT instances on AWS. 

It supports adding specific IP CIDRs to route tables of VPC, the network traffic to those IP CIDRs will be forwarded to the NAT instances.

![Arch diagram](arch.png)

## Install
TypeScript/JavaScript:

```shell
yarn add cdk-construct-simple-nat
```

or

```shell
npm install cdk-construct-simple-nat
```

## Usage

```ts
import { SimpleNAT } from 'cdk-construct-simple-nat';

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
