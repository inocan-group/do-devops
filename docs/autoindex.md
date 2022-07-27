# Auto Indexing

> `dd autoindex`

The `dd` utility provides a handy pattern for ensuring that `index.js` and `index.ts` files are automatically updated to point to other resources in their immediate directory or below.

## General Usage

Either add an _empty_ index file to a directory or add a file with the following content:

```ts
// #autoindex
```

In both cases, when you run `dd autoindex` in a directory below this file it will be converted into an autoindex file.

## Export Types

By default, it will be assumed that files will export _named exports_ but you can control this by choosing from the following:

1. `#autoindex: named` - this is equivalent to the default of not specifying export type
2. `#autoindex: default` - it will assume that files are exporting just a _default export_ and will export like this:
3. `#autoindex: named-offset` - 