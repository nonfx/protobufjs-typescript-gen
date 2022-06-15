# @cldcvr/protobufjs-typescript-gen

<a href="https://npmjs.org/package/@cldcvr/protobufjs-typescript-gen"><img src="https://img.shields.io/npm/v/@cldcvr/protobufjs-typescript-gen.svg" alt=""></a> <a href="https://npmjs.org/package/@cldcvr/protobufjs-typescript-gen"><img src="https://img.shields.io/npm/dm/@cldcvr/protobufjs-typescript-gen.svg" alt=""></a>

**@cldcvr/protobufjs-typescript-gen** is a tool which used protocol buffers to generate a Typescript interface. The tool is currently highly opinionated in how it generates files. It internally uses protobuf.js.

**protobuf.js** is a pure JavaScript implementation with [TypeScript](https://www.typescriptlang.org) support for [node.js](https://nodejs.org) and the browser. It's easy to use, blazingly fast and works out of the box with [.proto](https://developers.google.com/protocol-buffers/docs/proto) files!

## Installation

### node.js

```bash
$> npm install @cldcvr/protobufjs-typescript-gen [--save --save-prefix=~]
```

```js
// generate-protocol.js
const { generateProtocol } = require('@cldcvr/protobufjs-typescript-gen');

generateProtocol({
    protocolDir: 'YOUR_PROTOCOL_DIRECTORY',
    outDir: 'YOUR_OUTPUT_DIRECTORY',
});
```

```bash
$> node generate-protocol.js
```

## Example

Please see the examples folder for the structure of the generated interface.
