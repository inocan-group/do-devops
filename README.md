# Do Devops CLI

> _found on **NPM** as `dd`_

Provides a handy CLI for DevOps functionality on Typescript projects (and particularly those also using the Serverless framework targeting the AWS cloud).

## Install

You can install `do-devops` both locally to a repo as well as globally. For a global install:

```sh
npm install global dd
```

With a global install the `dd` CLI command should be available to you. Global installs are in general the most convenient way to get started using this CLI.

Local installs to a repo are recommended if you are using any of the CLI commands as part of your repo's devops. This then allows these commands to be wrapped as scripts in your `package.json` file and ensures that everyone interacting with the repo is using `do-devops` and using a consistent version of it.

```sh
# using npm
npm install --save-dev dd
# using yarn
yarn add --dev dd
```

## Commands

To get an up-to-date list of commands from `do-devops` just run `dd` by itself from the terminal and it will list out all commands. Furthermore, if you want more detail on a command you can just type `dd [command] --help`.

That said we wanted to give you some idea of what you're getting here. It's not like we're running for political office and want to abstract everything to the point of saying nothing. :)

Think of the commands you get as fitting into two camps ... well maybe three. We'll discuss the camps in the following two sections.

### The Serverless Crowd

The first camp (which you could argue is two camps) are those commands whose primary function is to aid and abet people who use the [Serverless Framework](https://serverless.com) and so their primary utility is only activated when you're inside a repo that's using the framework. The two primary examples of this are listed below:

- `deploy` - the Serverless framework is largely a deployment framework but open a really powerful set of tooling that allows for strongly typed configuration, inline configuration, and much more. A full description of this is actually descibed on the [`aws-orchestrate`]() website. This is a sister repo for this command and if you're using this then you'd probably be interested in both (though you don't need it). Basically the short version is we'll make your serverless life a lot easier and more powerful while maintaining at the core the same Serverless framework that you know and love.
- `build` - the idea of _building_ in a repo that uses the Serverless framework may not immediately connect because there is no serverless "build" command but rather what this represents is a pre-step that we take in every deployment where we both transpile your Typescript to Javascript and bundle/tree-shake it with an opinionated Rollup configuration (you can opt out if you like). This gives you more compact handler functions as well enabling the type support and power configurations aluded to above. To really understand this you'll want to read the docs at [`aws-orchestrate`]().

Now for folks who type `dd deploy` or `dd build` in a repo which is not got the serverless framework installed, you'll instead get a thin wrapper around your package manager of choice (aka., yarn, npm, and pnpm). Mainly we're just trying to get out of your way here but it does have utility for folks who are constantly switching between repos which use differnt package managers and accidentally typing `yarn build` instead of `npm run build`, etc.

In situations such as this, the CLI will detect which package manager is being used in the the wrapper and then run the appropriate script in `package.json` for you. You can completely ignore this functionality if you like but sometimes this abstraction is nice too. For those who like this we also have a few _hidden_ commands that perform this abstraction for you:

- `tt install` - runs `yarn`, `npm install`, or `pnpm install` based on the repo
- `tt outdated` - runs `yarn outdated`, `npm outdated`, or `pnpm outdated` based on the repo
- `tt update` - runs `yarn update`, `npm update`, or `pnpm update` based on the repo

> By "hidden" we mean that these commands will not be listed when you enter just `dd` to the console. You can force their visibility with `dd --showHidden`.

### The Rest of Us

Ok the remaining commands are a little less attached to the idea of AWS and Serverless but some are still connected. Here are a few examples:

1. `autoindex`

    it is quite common to spread a related set of functionality across files in a sub-directory and then to add a `index.ts` file which makes each of these files available in a more convenient fashion. The problem is that everytime you add, remove, or rename a file you also need to update the `index.ts` file. With this feature this can be done for you. You simply state your interest in the file to be autoindexed by dropping in `// #autoindex` into the file and then run `tt autoindex` in the repo and it'll autoindex all which have this hint.

2. `latest`

    Do you find yourself wonder what the _latest_ tagged version is in your repo? Just type `tt latest` to find out. You can also type `tt latest [pkg]` and it will tell you about another npm packages latest release.

3. `info`

    Provides interesting information about the repo you are in. This info is contextual and will add in serverless info if your repo is using serverless, it also knows about certain frameworks (like VueJS, React, Lerna, RushJS, etc.). Primarily just meant as a way to give you a summary overview of the repo's characteristics.

4. `ssm`

    AWS provides a handy way for you to manage your _secrets_. Well actually they provide two. Most people will be aware of secrets manager but there is also [SSM]() and SSM is much more cost effective and will meet the needs for a majority of your use cases (secrets manager is more power for those that need it's features). Of course the AWS CLI does provide utility to manage SSM from the command line but it's awkward. From this CLI you can a compact _list_, _get_, and _set_ surface area that we find much nicer. Let's face it, we all have a lot of secrets ... why not make managing them lower friction.

5. `endpoints`

    If you're in a serverless repo it will bring up a nice tabular view of all the serverless functions which are exposed by the repo. If you're not in a serverless repo it will switch to interactive mode and ask you which AWS _profile_ in your crentials file to use to report on the same information (it'll ask you which region too if that's not stated in the profile).

There are plenty more functions but this should give you a flavor and hopefully let you decide if you're interested.

## Path Aliases

In order to have the transpiled source and types resolve the Typescript path aliases we have installed `ts-patch` to patch **tsc** to allow for the plugin API to be used in the CLI. This then let's us use `typescript-transform-paths`.

## Contribution

We welcome contributions as PR's but we ask that you respect the `eslint` rules that are defined in this repo from a code style standpoint and that you target the **develop** branch for your PR.

## License

Copyright (c) 2019 Inocan Group

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
