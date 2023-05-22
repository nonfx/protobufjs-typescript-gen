import path from 'path';

import { generateProtocol } from './src/index';

console.log(__dirname);

generateProtocol({
    protocolDir: 'examples/basic',
    outDir: path.join(__dirname, 'examples/basic/protocol'),
    // ignoreFiles: ['**/{google,grpc,protoc-gen-openapiv2}/**/*.*'],
    anyToUnknown: true,
});
