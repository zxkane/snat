const { AwsCdkConstructLibrary, AwsCdkTypeScriptApp } = require('projen');

const cdkVersion = '2.0.0-rc.27';

const tsCustomConfig = {
  exclude: ['example'],
  include: [
    'src/*.sh',
    'src/snat.service',
  ],
};

const project = new AwsCdkConstructLibrary({
  author: 'Kane Zhu',
  authorAddress: 'me@kane.mx',
  cdkVersion: cdkVersion,
  defaultReleaseBranch: 'main',
  compileBeforeTest: true, // since we want to run the cli in tests
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-construct-simple-nat',
  description: 'A CDK construct to build Simple NAT instance on AWS.',
  repositoryUrl: 'git@github.com:zxkane/snat.git',

  tsconfigDev: tsCustomConfig,
  buildWorkflowMutable: true,
  /* AwsCdkConstructLibraryOptions */
  // cdkAssert: true,                                                          /* Install the @aws-cdk/assert library? */
  cdkDependencies: [
  ], /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkDependenciesAsDeps: true,                                              /* If this is enabled (default), all modules declared in `cdkDependencies` will be also added as normal `dependencies` (as well as `peerDependencies`). */
  // cdkTestDependencies: undefined,                                           /* AWS CDK modules required for testing. */
  cdkVersionPinning: false, /* Use pinned version instead of caret version for CDK. */

  /* ConstructLibraryOptions */
  // catalog: undefined,                                                       /* Libraries will be picked up by the construct catalog when they are published to npm as jsii modules and will be published under:. */

  /* JsiiProjectOptions */
  // compat: false,                                                            /* Automatically run API compatibility test against the latest version published to npm after compilation. */
  // compatIgnore: '.compatignore',                                            /* Name of the ignore file for API compatibility tests. */
  // docgen: true,                                                             /* Automatically generate API.md from jsii. */
  // eslint: true,                                                             /* Install eslint. */
  // eslintOptions: undefined,                                                 /* Eslint options. */
  excludeTypescript: [
    'example',
  ], /* Accepts a list of glob patterns. */
  // publishToGo: undefined,                                                   /* Publish Go bindings to a git repository. */
  // publishToMaven: undefined,                                                /* Publish to maven. */
  // publishToNuget: undefined,                                                /* Publish to NuGet. */
  // publishToPypi: undefined,                                                 /* Publish to pypi. */
  // rootdir: '.',                                                             /* undefined */
  // sampleCode: true,                                                         /* Generate one-time sample in `src/` and `test/` if there are no files there. */

  /* NodePackageOptions */
  // allowLibraryDependencies: true,                                           /* Allow the project to include `peerDependencies` and `bundledDependencies`. */
  authorEmail: 'me@kane.mx', /* Author's e-mail. */
  authorName: 'Kane Zhu', /* Author's name. */
  // authorOrganization: undefined,                                            /* Author's Organization. */
  // autoDetectBin: true,                                                      /* Automatically add all executables under the `bin` directory to your `package.json` file under the `bin` section. */
  // bin: undefined,                                                           /* Binary programs vended with your module. */
  bundledDeps: [
    'sync-fetch@^0.3.0',
    'mustache@^4.2.0',
  ], /* List of dependencies to bundle into this module. */
  // deps: undefined,                                                                 /* Runtime dependencies of this module. */
  // description: undefined,                                                   /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'aws-cdk-lib@' + cdkVersion,
    'constructs@10.0.5',
    '@types/mustache',
  ], /* Build dependencies for this module. */
  // entrypoint: 'lib/index.js',                                               /* Module entrypoint (`main` in `package.json`). */
  // homepage: undefined,                                                      /* Package's Homepage / Website. */
  keywords: [
    'aws',
    'aws-cdk',
    'cdk',
    'cdk-construct',
    'nat',
  ], /* Keywords to include in `package.json`. */
  license: 'Apache-2.0', /* License's SPDX identifier. */
  licensed: true, /* Indicates if a license should be added. */
  // maxNodeVersion: undefined,                                                /* Minimum node.js version to require via `engines` (inclusive). */
  minNodeVersion: '14.15.0', /* Minimum Node.js version to require via package.json `engines` (inclusive). */
  // npmAccess: undefined,                                                     /* Access level of the npm package. */
  // npmDistTag: 'latest',                                                     /* Tags can be used to provide an alias instead of version numbers. */
  // npmRegistryUrl: 'https://registry.npmjs.org',                             /* The base URL of the npm package registry. */
  // npmTaskExecution: NpmTaskExecution.PROJEN,                                /* Determines how tasks are executed when invoked as npm scripts (yarn/npm run xyz). */
  // packageManager: NodePackageManager.YARN,                                  /* The Node Package Manager used to execute scripts. */
  // packageName: undefined,                                                   /* The "name" in package.json. */
  // peerDependencyOptions: undefined,                                         /* Options for `peerDeps`. */
  peerDeps: [
    'aws-cdk-lib@^' + cdkVersion,
  ], /* Peer dependencies for this module. */
  // projenCommand: 'npx projen',                                              /* The shell command to use in order to run the projen CLI. */
  // repository: undefined,                                                    /* The repository is the location where the actual code for your package lives. */
  // repositoryDirectory: undefined,                                           /* If the package.json for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives. */
  // scripts: {},                                                              /* npm scripts to include. */
  // stability: undefined,                                                     /* Package's Stability. */

  /* NodeProjectOptions */
  // antitamper: true,                                                         /* Checks that after build there are no modified files on git. */
  // artifactsDirectory: 'dist',                                               /* A directory which will contain artifacts to be published to npm. */
  // buildWorkflow: undefined,                                                 /* Define a GitHub workflow for building PRs. */
  codeCov: true, /* Define a GitHub workflow step for sending code coverage metrics to https://codecov.io/ Uses codecov/codecov-action@v1 A secret is required for private repos. Configured with @codeCovTokenSecret. */
  // codeCovTokenSecret: undefined,                                            /* Define the secret name for a specified https://codecov.io/ token A secret is required to send coverage for private repositories. */
  // copyrightOwner: undefined,                                                /* License copyright owner. */
  // copyrightPeriod: undefined,                                               /* The copyright years to put in the LICENSE file. */
  // dependabot: true,                                                         /* Include dependabot configuration. */
  // dependabotOptions: undefined,                                             /* Options for dependabot. */
  // gitignore: undefined,                                                     /* Additional entries to .gitignore. */
  // jest: true,                                                               /* Setup jest unit tests. */
  // jestOptions: undefined,                                                   /* Jest options. */
  // jsiiReleaseVersion: 'latest',                                             /* Version requirement of `jsii-release` which is used to publish modules to npm. */
  // mutableBuild: true,                                                       /* Automatically update files modified during builds to pull-request branches. */
  npmignore: [
    '/example',
    '/*.md',
    '/*.png',
    '/version.json',
  ], /* Additional entries to .npmignore. */
  npmignoreEnabled: true, /* Defines an .npmignore file. Normally this is only needed for libraries that are packaged as tarballs. */
  // projenDevDependency: true,                                                /* Indicates of "projen" should be installed as a devDependency. */
  // projenUpgradeAutoMerge: undefined,                                        /* Automatically merge projen upgrade PRs when build passes. */
  // projenUpgradeSchedule: [ '0 6 * * *' ],                                   /* Customize the projenUpgrade schedule in cron expression. */
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN', /* Periodically submits a pull request for projen upgrades (executes `yarn projen:upgrade`). */
  // projenVersion: '^0.23.0', /* Version of projen to install. */
  // pullRequestTemplate: true,                                                /* Include a GitHub pull request template. */
  pullRequestTemplateContents: [
    '---',
    'By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.',
  ],
  // releaseBranches: [ 'main' ],                                              /* Branches which trigger a release. */
  // releaseEveryCommit: true,                                                 /* Automatically release new versions every commit to one of branches in `releaseBranches`. */
  // releaseSchedule: undefined,                                               /* CRON schedule to trigger new releases. */
  // releaseToNpm: false,                                                      /* Automatically release to npm when new versions are introduced. */
  // releaseWorkflow: undefined,                                               /* Define a GitHub workflow for releasing from "main" when new versions are bumped. */
  // workflowBootstrapSteps: 'yarn install --frozen-lockfile && yarn projen',  /* Workflow steps to use in order to bootstrap this repo. */
  // workflowContainerImage: undefined,                                        /* Container image to use for GitHub workflows. */
  // workflowNodeVersion: undefined,                                           /* The node version to use in GitHub workflows. */

  /* ProjectOptions */
  // clobber: true,                                                            /* Add a `clobber` task which resets the repo to origin. */
  // devContainer: false,                                                      /* Add a VSCode development environment (used for GitHub Codespaces). */
  gitpod: true, /* Add a Gitpod development environment. */
  // logging: {},                                                              /* Configure logging options such as verbosity. */
  // outdir: '.',                                                              /* The root directory of the project. */
  // parent: undefined,                                                        /* The parent project, if this project is part of a bigger project. */
  // projectType: ProjectType.UNKNOWN,                                         /* Which type of project this is (library/app). */
  // readme: undefined,                                                        /* The README setup. */
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: 'PROJEN_GITHUB_TOKEN',
    },
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['github-actions'],
    secret: 'REPO_SCOPED_TOKEN',
  },
  autoMergeOptions: {
    approvedReviews: 0,
  },
  mergifyOptions: {
    rules: [
      {
        name: 'rule1',
        conditions: [],
      },
    ],
  },
});
project.package.addField('resolutions', {
  'set-value': '^4.0.1',
  'ansi-regex': '^5.0.1',
});
// console.log(project)
project.postCompileTask.exec('cp src/snat.* src/runonce.sh lib/');
// project.releaseTask.spawn(project.packageTask);

const examplePrj = new AwsCdkTypeScriptApp({
  cdkVersion: cdkVersion,
  name: 'simple-nat-example',
  cdkDependencies: [
  ] /* Which AWS CDK modules (those that start with "@aws-cdk/") this app uses. */,
  cdkVersionPinning: true /* Use pinned version instead of caret version for CDK. */,
  deps: [
    'cdk-construct-simple-nat@^0.1.98',
  ],
  description:
    'An example CDK app uses SimpleNAT construct.' /* The description is just a string that helps people understand the purpose of the package. */,
  license: 'Apache-2.0' /* License's SPDX identifier. */,
  licensed: false /* Indicates if a license should be added. */,
  defaultReleaseBranch: 'main',
  outdir: 'example',
  parent: project,
  gitignore: [
    'cdk.context.json',
  ],
});
examplePrj.package.addField('resolutions', {
  'pac-resolver': '^5.0.0',
  'set-value': '^4.0.1',
  'ansi-regex': '^5.0.1',
});

project.synth();
