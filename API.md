# API Reference

**Classes**

Name|Description
----|-----------
[SimpleNAT](#cdk-construct-simple-nat-simplenat)|Simple NAT instaces construct.


**Structs**

Name|Description
----|-----------
[SimpleNATProps](#cdk-construct-simple-nat-simplenatprops)|Properties for NAT instances.



## class SimpleNAT  <a id="cdk-construct-simple-nat-simplenat"></a>

Simple NAT instaces construct.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable), [IResource](#aws-cdk-lib-iresource), [IDependable](#constructs-idependable), [IConstruct](#constructs-iconstruct)
__Extends__: [Resource](#aws-cdk-lib-resource)

### Initializer




```ts
new SimpleNAT(scope: Construct, id: string, props: SimpleNATProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SimpleNATProps](#cdk-construct-simple-nat-simplenatprops)</code>)  *No description*
  * **vpc** (<code>[aws_ec2.IVpc](#aws-cdk-lib-aws-ec2-ivpc)</code>)  The VPC the NAT instances will reside. 
  * **customScripts** (<code>string</code>)  The custom script when provisioning the NAT instances. __*Default*__: no custom script.
  * **instanceType** (<code>[aws_ec2.InstanceType](#aws-cdk-lib-aws-ec2-instancetype)</code>)  The instance type of NAT instances. __*Default*__: t3.MICRO.
  * **keyName** (<code>string</code>)  The key name of ssh key of NAT instances. __*Default*__: No SSH access will be possible.
  * **natSubnetsSelection** (<code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code>)  The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets. __*Default*__: subnetType is SubnetType.PUBLIC and onePerAZ is true.
  * **privateSubnetsSelection** (<code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code>)  The subnet selection for updating route tables for selected subnets. __*Default*__: subnetType is SubnetType.PRIVATE.
  * **role** (<code>[aws_iam.IRole](#aws-cdk-lib-aws-iam-irole)</code>)  The IAM role attached to NAT instances. __*Default*__: an IAM role is created.


### Methods


#### addV4Route(v4CIDR) <a id="cdk-construct-simple-nat-simplenat-addv4route"></a>



```ts
addV4Route(v4CIDR: string): SimpleNAT
```

* **v4CIDR** (<code>string</code>)  *No description*

__Returns__:
* <code>[SimpleNAT](#cdk-construct-simple-nat-simplenat)</code>

#### addV6Route(v6CIDR) <a id="cdk-construct-simple-nat-simplenat-addv6route"></a>



```ts
addV6Route(v6CIDR: string): SimpleNAT
```

* **v6CIDR** (<code>string</code>)  *No description*

__Returns__:
* <code>[SimpleNAT](#cdk-construct-simple-nat-simplenat)</code>

#### withGithubRoute() <a id="cdk-construct-simple-nat-simplenat-withgithubroute"></a>



```ts
withGithubRoute(): SimpleNAT
```


__Returns__:
* <code>[SimpleNAT](#cdk-construct-simple-nat-simplenat)</code>

#### withGoogleRoute() <a id="cdk-construct-simple-nat-simplenat-withgoogleroute"></a>



```ts
withGoogleRoute(): SimpleNAT
```


__Returns__:
* <code>[SimpleNAT](#cdk-construct-simple-nat-simplenat)</code>



## struct SimpleNATProps  <a id="cdk-construct-simple-nat-simplenatprops"></a>


Properties for NAT instances.



Name | Type | Description 
-----|------|-------------
**vpc** | <code>[aws_ec2.IVpc](#aws-cdk-lib-aws-ec2-ivpc)</code> | The VPC the NAT instances will reside.
**customScripts**? | <code>string</code> | The custom script when provisioning the NAT instances.<br/>__*Default*__: no custom script.
**instanceType**? | <code>[aws_ec2.InstanceType](#aws-cdk-lib-aws-ec2-instancetype)</code> | The instance type of NAT instances.<br/>__*Default*__: t3.MICRO.
**keyName**? | <code>string</code> | The key name of ssh key of NAT instances.<br/>__*Default*__: No SSH access will be possible.
**natSubnetsSelection**? | <code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code> | The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets.<br/>__*Default*__: subnetType is SubnetType.PUBLIC and onePerAZ is true.
**privateSubnetsSelection**? | <code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code> | The subnet selection for updating route tables for selected subnets.<br/>__*Default*__: subnetType is SubnetType.PRIVATE.
**role**? | <code>[aws_iam.IRole](#aws-cdk-lib-aws-iam-irole)</code> | The IAM role attached to NAT instances.<br/>__*Default*__: an IAM role is created.



