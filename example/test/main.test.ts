import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SimpleNATStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new SimpleNATStack(app, 'test');

  Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});