# API Reference

**Classes**

Name|Description
----|-----------
[SimpleNAT](#simple-nat-construct-simplenat)|Simple NAT instaces construct.


**Structs**

Name|Description
----|-----------
[SimpleNATProps](#simple-nat-construct-simplenatprops)|Properties for NAT instances.



## class SimpleNAT  <a id="simple-nat-construct-simplenat"></a>

Simple NAT instaces construct.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct)
__Extends__: [Resource](#aws-cdk-core-resource)

### Initializer




```ts
new SimpleNAT(scope: Construct, id: string, props: SimpleNATProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SimpleNATProps](#simple-nat-construct-simplenatprops)</code>)  *No description*
  * **vpc** (<code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code>)  The VPC the NAT instances will reside. 
  * **customScripts** (<code>string</code>)  The custom script when provisioning the NAT instances. __*Default*__: no custom script.
  * **instanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  The instance type of NAT instances. __*Default*__: t3.MICRO.
  * **keyName** (<code>string</code>)  The key name of ssh key of NAT instances. __*Default*__: No SSH access will be possible.
  * **natSubnetsSelection** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets. __*Default*__: subnetType is SubnetType.PUBLIC and onePerAZ is true.
  * **privateSubnetsSelection** (<code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code>)  The subnet selection for updating route tables for selected subnets. __*Default*__: subnetType is SubnetType.PRIVATE.
  * **role** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  The IAM role attached to NAT instances. __*Default*__: an IAM role is created.


### Methods


#### addV4Route(v4CIDR) <a id="simple-nat-construct-simplenat-addv4route"></a>



```ts
addV4Route(v4CIDR: string): SimpleNAT
```

* **v4CIDR** (<code>string</code>)  *No description*

__Returns__:
* <code>[SimpleNAT](#simple-nat-construct-simplenat)</code>

#### addV6Route(v6CIDR) <a id="simple-nat-construct-simplenat-addv6route"></a>



```ts
addV6Route(v6CIDR: string): SimpleNAT
```

* **v6CIDR** (<code>string</code>)  *No description*

__Returns__:
* <code>[SimpleNAT](#simple-nat-construct-simplenat)</code>

#### withGithubRoute() <a id="simple-nat-construct-simplenat-withgithubroute"></a>



```ts
withGithubRoute(): SimpleNAT
```


__Returns__:
* <code>[SimpleNAT](#simple-nat-construct-simplenat)</code>

#### withGoogleRoute() <a id="simple-nat-construct-simplenat-withgoogleroute"></a>



```ts
withGoogleRoute(): SimpleNAT
```


__Returns__:
* <code>[SimpleNAT](#simple-nat-construct-simplenat)</code>



## struct SimpleNATProps  <a id="simple-nat-construct-simplenatprops"></a>


Properties for NAT instances.



Name | Type | Description 
-----|------|-------------
**vpc** | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | The VPC the NAT instances will reside.
**customScripts**? | <code>string</code> | The custom script when provisioning the NAT instances.<br/>__*Default*__: no custom script.
**instanceType**? | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | The instance type of NAT instances.<br/>__*Default*__: t3.MICRO.
**keyName**? | <code>string</code> | The key name of ssh key of NAT instances.<br/>__*Default*__: No SSH access will be possible.
**natSubnetsSelection**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets.<br/>__*Default*__: subnetType is SubnetType.PUBLIC and onePerAZ is true.
**privateSubnetsSelection**? | <code>[SubnetSelection](#aws-cdk-aws-ec2-subnetselection)</code> | The subnet selection for updating route tables for selected subnets.<br/>__*Default*__: subnetType is SubnetType.PRIVATE.
**role**? | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | The IAM role attached to NAT instances.<br/>__*Default*__: an IAM role is created.



