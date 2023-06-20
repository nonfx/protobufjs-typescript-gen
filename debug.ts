import path from 'path';

import { generateProtocol } from './src/index';

console.log(__dirname);

generateProtocol({
    protocolDir: 'examples/basic',
    outDir: path.join(__dirname, 'examples/basic/protocol'),
    anyToUnknown: true,
});
