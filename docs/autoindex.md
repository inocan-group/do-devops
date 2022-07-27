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
