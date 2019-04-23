# DevOps CLI

Provides a handy CLI for DevOps functionality on Typescript based NodeJS projects.

## Commands

- `build`
- `deploy` - deploy some or all of the serverless functions
- `publish`
- `invoke` - invoke a function locally
- `fns` - lists all of the defined serverless functions
- `package` - packages up the deployable content but does not deploy; allows for analysis
- `test` - runs all unit tests (`test/**/*spec.ts`)

## Configuration

All configuration is done in the `do.config.ts` and the configuration is fully typed so please use that as the primary documentation source.

## Usage

The cli command is `do [command]` but whenever you need help just append the `--help` option to the end for a full explanation of syntax/function.

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