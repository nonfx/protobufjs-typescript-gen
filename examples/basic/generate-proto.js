const path = require('path');
const { generateProtocol } = require('../../dist');

console.log(__dirname);

generateProtocol({
    protocolDir: __dirname,
    outDir: path.join(__dirname, 'protocol'),
    anyToUnknown: true,
});
