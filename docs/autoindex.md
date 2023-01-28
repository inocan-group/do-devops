# Auto Indexing

> `dd autoindex`

The `dd` utility provides a handy pattern for ensuring that `index.js` and `index.ts` files are automatically updated to point to other resources in their immediate directory or below.

## General Configuration

Either add an _empty_ index file to a directory or add a file with the following content:

```ts
// #autoindex
```

> Note: you may also use `// #auto-index` if you prefer (nicer if you have a spell checker plugin in your editor)

Now when you run `dd autoindex` in a directory anywhere below this new file it will be converted into an autoindex file.

### Export Types

By default we assume all files are _named exports_ but you can control this by choosing from the following:

1. `#autoindex: named` - this is equivalent to the default of not specifying export type
2. `#autoindex: default` - it will assume that files are exporting just a _default export_ and will export like this:
3. `#autoindex: named-offset` -

### Exceptions

There are time where you may want to make exceptions and this is supported through the following mechanisms:

1. **Exclusions** - you may create a list of files or directories which you do _not_ want to have indexed by adding `exclude: a.ts,b.ts,c.ts` to the same line as the auto-index.
2. **Orphans** - if you want to be sure that the _parent_ index file **does not** index a given index file you can add `; orphan` immediately after the autoindex strategy is stated.
3. **Bespoke** - when autoindex runs it creates a blocked area demarcated for it's own management and anything written into this block will be removed the next time autoindex is run. However, all text _outside_ this block is fair game and you can put whatever you like there.

## Using the CLI

### Installing `do-devops`

The autoindex feature is contained in the [**do-devops**](https://github.com/inocan/do-devops) repo and is available on **npm** as `dd`:

```sh
# install with pnpm or whichever pkg manager you prefer
pnpm install dd
```

### Usage

The most basic usage is to go into the base of a repo you're working on and run:

```sh
dd autoindex
```

This will do the following:

- **Find Index Candidates**
  - find all `index.ts` (or `index.js` files if Typescript is not detected) in the `./src` directory
  
    > **Note:** if the repo is a _monorepo_ then this will be detected and each repo's "src" directory will be looked at instead
- **Qualify Index Files**
  - determine from contents which of the existing "candidate" files should be treated as an autoindex file

- **Update Qualified Index Files**
  - all `.ts` files (or `.js` files if TS not detected) local to an "autoindex file" will be added to that file
  - by default all VueJS SFC files will also be added too but this can be turned off with `--no-sfc` flag on the command line

Moving beyond the basics involves using a combination or _parameters_ and _command line flags_.

- The parameters you supply will provide one or more base directories to point the utility at. If no parameters are passed in (as you've seen in above example) then the "src" directory is assumed.
- For a full list of command line flags, type:
  
  ```sh
  dd autoindex --help
  ```
