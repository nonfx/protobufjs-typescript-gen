/** @type {import('@types/prettier').Config} */
module.exports = {
    printWidth: 100,
    singleQuote: true,
    tabWidth: 4,
    overrides: [
        {
            files: ['package.json'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
