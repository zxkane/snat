# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### SimpleNAT <a name="SimpleNAT" id="cdk-construct-simple-nat.SimpleNAT"></a>

Simple NAT instances construct.

#### Initializers <a name="Initializers" id="cdk-construct-simple-nat.SimpleNAT.Initializer"></a>

```typescript
import { SimpleNAT } from 'cdk-construct-simple-nat'

new SimpleNAT(scope: Construct, id: string, props: SimpleNATProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-construct-simple-nat.SimpleNATProps">SimpleNATProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-construct-simple-nat.SimpleNAT.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-construct-simple-nat.SimpleNAT.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-construct-simple-nat.SimpleNAT.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-construct-simple-nat.SimpleNATProps">SimpleNATProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.addV4Route">addV4Route</a></code> | *No description.* |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.addV6Route">addV6Route</a></code> | *No description.* |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.withCloudflareRoute">withCloudflareRoute</a></code> | Add Cloudflare IPs to route table. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.withGithubRoute">withGithubRoute</a></code> | Add Github IPs to route table. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.withGoogleRoute">withGoogleRoute</a></code> | Add Google IPs to route table. |

---

##### `toString` <a name="toString" id="cdk-construct-simple-nat.SimpleNAT.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-construct-simple-nat.SimpleNAT.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-construct-simple-nat.SimpleNAT.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addV4Route` <a name="addV4Route" id="cdk-construct-simple-nat.SimpleNAT.addV4Route"></a>

```typescript
public addV4Route(v4CIDR: string): SimpleNAT
```

###### `v4CIDR`<sup>Required</sup> <a name="v4CIDR" id="cdk-construct-simple-nat.SimpleNAT.addV4Route.parameter.v4CIDR"></a>

- *Type:* string

---

##### `addV6Route` <a name="addV6Route" id="cdk-construct-simple-nat.SimpleNAT.addV6Route"></a>

```typescript
public addV6Route(v6CIDR: string): SimpleNAT
```

###### `v6CIDR`<sup>Required</sup> <a name="v6CIDR" id="cdk-construct-simple-nat.SimpleNAT.addV6Route.parameter.v6CIDR"></a>

- *Type:* string

---

##### `withCloudflareRoute` <a name="withCloudflareRoute" id="cdk-construct-simple-nat.SimpleNAT.withCloudflareRoute"></a>

```typescript
public withCloudflareRoute(props?: RouteProps): SimpleNAT
```

Add Cloudflare IPs to route table.

See https://www.cloudflare.com/ips/ for details

###### `props`<sup>Optional</sup> <a name="props" id="cdk-construct-simple-nat.SimpleNAT.withCloudflareRoute.parameter.props"></a>

- *Type:* <a href="#cdk-construct-simple-nat.RouteProps">RouteProps</a>

---

##### `withGithubRoute` <a name="withGithubRoute" id="cdk-construct-simple-nat.SimpleNAT.withGithubRoute"></a>

```typescript
public withGithubRoute(props?: RouteProps): SimpleNAT
```

Add Github IPs to route table.

###### `props`<sup>Optional</sup> <a name="props" id="cdk-construct-simple-nat.SimpleNAT.withGithubRoute.parameter.props"></a>

- *Type:* <a href="#cdk-construct-simple-nat.RouteProps">RouteProps</a>

---

##### `withGoogleRoute` <a name="withGoogleRoute" id="cdk-construct-simple-nat.SimpleNAT.withGoogleRoute"></a>

```typescript
public withGoogleRoute(props?: RouteProps): SimpleNAT
```

Add Google IPs to route table.

###### `props`<sup>Optional</sup> <a name="props" id="cdk-construct-simple-nat.SimpleNAT.withGoogleRoute.parameter.props"></a>

- *Type:* <a href="#cdk-construct-simple-nat.RouteProps">RouteProps</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-construct-simple-nat.SimpleNAT.isConstruct"></a>

```typescript
import { SimpleNAT } from 'cdk-construct-simple-nat'

SimpleNAT.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-construct-simple-nat.SimpleNAT.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-construct-simple-nat.SimpleNAT.isOwnedResource"></a>

```typescript
import { SimpleNAT } from 'cdk-construct-simple-nat'

SimpleNAT.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-construct-simple-nat.SimpleNAT.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-construct-simple-nat.SimpleNAT.isResource"></a>

```typescript
import { SimpleNAT } from 'cdk-construct-simple-nat'

SimpleNAT.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-construct-simple-nat.SimpleNAT.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-construct-simple-nat.SimpleNAT.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-construct-simple-nat.SimpleNAT.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-construct-simple-nat.SimpleNAT.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-simple-nat.SimpleNAT.property.Ipv6Regex">Ipv6Regex</a></code> | <code>string</code> | *No description.* |

---

##### `Ipv6Regex`<sup>Required</sup> <a name="Ipv6Regex" id="cdk-construct-simple-nat.SimpleNAT.property.Ipv6Regex"></a>

```typescript
public readonly Ipv6Regex: string;
```

- *Type:* string

---

## Structs <a name="Structs" id="Structs"></a>

### RouteProps <a name="RouteProps" id="cdk-construct-simple-nat.RouteProps"></a>

Properties for how adding IPs to route.

#### Initializer <a name="Initializer" id="cdk-construct-simple-nat.RouteProps.Initializer"></a>

```typescript
import { RouteProps } from 'cdk-construct-simple-nat'

const routeProps: RouteProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-simple-nat.RouteProps.property.excludeIPv6">excludeIPv6</a></code> | <code>boolean</code> | If excluding IPv6 when creating route. |

---

##### `excludeIPv6`<sup>Optional</sup> <a name="excludeIPv6" id="cdk-construct-simple-nat.RouteProps.property.excludeIPv6"></a>

```typescript
public readonly excludeIPv6: boolean;
```

- *Type:* boolean
- *Default:* false

If excluding IPv6 when creating route.

---

### SimpleNATProps <a name="SimpleNATProps" id="cdk-construct-simple-nat.SimpleNATProps"></a>

Properties for NAT instances.

#### Initializer <a name="Initializer" id="cdk-construct-simple-nat.SimpleNATProps.Initializer"></a>

```typescript
import { SimpleNATProps } from 'cdk-construct-simple-nat'

const simpleNATProps: SimpleNATProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | The VPC the NAT instances will reside. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.customScripts">customScripts</a></code> | <code>string</code> | The custom script when provisioning the NAT instances. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | The instance type of NAT instances. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.keyName">keyName</a></code> | <code>string</code> | The key name of ssh key of NAT instances. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.machineImage">machineImage</a></code> | <code>aws-cdk-lib.aws_ec2.IMachineImage</code> | The AMI of NAT instances. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.natSubnetsSelection">natSubnetsSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.privateSubnetsSelection">privateSubnetsSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | The subnet selection for updating route tables for selected subnets. |
| <code><a href="#cdk-construct-simple-nat.SimpleNATProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The IAM role attached to NAT instances. |

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="cdk-construct-simple-nat.SimpleNATProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

The VPC the NAT instances will reside.

---

##### `customScripts`<sup>Optional</sup> <a name="customScripts" id="cdk-construct-simple-nat.SimpleNATProps.property.customScripts"></a>

```typescript
public readonly customScripts: string;
```

- *Type:* string
- *Default:* no custom script.

The custom script when provisioning the NAT instances.

---

##### `instanceType`<sup>Optional</sup> <a name="instanceType" id="cdk-construct-simple-nat.SimpleNATProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType
- *Default:* t3.MICRO.

The instance type of NAT instances.

---

##### `keyName`<sup>Optional</sup> <a name="keyName" id="cdk-construct-simple-nat.SimpleNATProps.property.keyName"></a>

```typescript
public readonly keyName: string;
```

- *Type:* string
- *Default:* No SSH access will be possible.

The key name of ssh key of NAT instances.

---

##### `machineImage`<sup>Optional</sup> <a name="machineImage" id="cdk-construct-simple-nat.SimpleNATProps.property.machineImage"></a>

```typescript
public readonly machineImage: IMachineImage;
```

- *Type:* aws-cdk-lib.aws_ec2.IMachineImage
- *Default:* Amazon Linux 2 for x86_64.

The AMI of NAT instances.

---

##### `natSubnetsSelection`<sup>Optional</sup> <a name="natSubnetsSelection" id="cdk-construct-simple-nat.SimpleNATProps.property.natSubnetsSelection"></a>

```typescript
public readonly natSubnetsSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* subnetType is SubnetType.PUBLIC and onePerAZ is true.

The subnet selection for NAT instances, one NAT instance will be placed in the selected subnets.

NOTE: must select the public subnet

---

##### `privateSubnetsSelection`<sup>Optional</sup> <a name="privateSubnetsSelection" id="cdk-construct-simple-nat.SimpleNATProps.property.privateSubnetsSelection"></a>

```typescript
public readonly privateSubnetsSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* subnetType is SubnetType.PRIVATE_WITH_NAT.

The subnet selection for updating route tables for selected subnets.

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-construct-simple-nat.SimpleNATProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* an IAM role is created.

The IAM role attached to NAT instances.

---



