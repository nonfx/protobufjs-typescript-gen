import prettier from 'prettier';

export async function vaidateOptions(options?: UserOptions): Promise<ProtoGenOptions> {
    if (!options) {
        throw new Error('Options must be provided');
    }

    if (!options.outDir) {
        throw new Error('No output directory found');
    }

    if (!options.protocolDir) {
        throw new Error('protocolDir folder is required');
    }

    if (!options.cwd) {
        options.cwd = process.cwd();
    }

    if (!options.prettierConfig) {
        options.prettierConfig = (await prettier.resolveConfig(options.cwd)) ?? {
            printWidth: 100,
            singleQuote: true,
            tabWidth: 4,
        };
    }

    if (!('repeatedFieldIsRequired' in options)) {
        options.repeatedFieldIsRequired = false;
    }

    if (!('uint64ToNumber' in options)) {
        options.uint64ToNumber = false;
    }

    if (!('anyToUnknown' in options)) {
        options.anyToUnknown = false;
    }

    if (!('ignoreNamespaces' in options)) {
        options.ignoreNamespaces = ['grpc', 'validate', 'google'];
    }

    if (!('pathsToExclude' in options)) {
        options.pathsToExclude = ['v0'];
    }

    return options as ProtoGenOptions;
}

export type ProtoGenOptions = Required<UserOptions>;

export type UserOptions = {
    outDir: string;
    protocolDir: string;
    pathsToExclude?: string[];
    protoCwd?: string;
    ignoreNamespaces?: string[];
    cwd?: string;
    repeatedFieldIsRequired?: boolean;
    prettierConfig?: prettier.Options;
    uint64ToNumber?: boolean;
    anyToUnknown?: boolean;
};
