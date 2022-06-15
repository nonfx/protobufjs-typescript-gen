import protobuf, { Enum, Namespace, Service, Type } from '@cldcvr/protobufjs';
import { emptyDirSync, outputFileSync } from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import prettier from 'prettier';
import { getEnumCode } from './enums';
import { ProtoGenOptions, UserOptions, vaidateOptions } from './options';
import { getServiceInfo } from './services';
import { getTypeInfo } from './types';
import {
    getImportString,
    isEnumConstructor,
    isNamespaceConstructor,
    isServiceConstructor,
    isTypeConstructor,
    namespaceToPath,
} from './utils';

const root = new protobuf.Root();

export function generateProtocol(options: UserOptions) {
    const finalOptions = vaidateOptions(options);

    root.resolvePath = function (_origin, target) {
        return path.join(finalOptions.protocolDir, target);
    };

    const files = glob.sync('**/*.proto', {
        cwd: options.protocolDir,
        ignore: options.ignoreFiles,
    });

    files.forEach((file) => {
        root.loadSync(file, {
            alternateCommentMode: true,
        });
    });

    // Clear output directory
    emptyDirSync(finalOptions.outDir);

    // Generate the code
    if (!root.nested) {
        throw new Error('Could not find any protocols in root');
    }

    // We only generate namespaces in the root
    Object.values(root.nested).forEach((type) => {
        if (isNamespaceConstructor(type)) {
            generateNamespace(type, finalOptions);
        }
    });

    console.log(`Generated ${files.length} protocol files.`);
}

function generateNamespace(namespace: Namespace, options: ProtoGenOptions) {
    if (!namespace.nested) {
        console.warn(`Namespace ${namespace.name} has no nested members to be generated`);
        return;
    }

    const types: Type[] = [];
    const enums: Enum[] = [];
    const services: Service[] = [];
    const imports: Map<string, Set<string>> = new Map();

    Object.entries(namespace.nested).forEach(([, type]) => {
        if (isNamespaceConstructor(type)) {
            generateNamespace(type, options);
        } else if (isTypeConstructor(type)) {
            types.push(type);
        } else if (isEnumConstructor(type)) {
            enums.push(type);
        } else if (isServiceConstructor(type)) {
            services.push(type);
        }
    });

    // We have types in this namespace, we need to generate a file
    if (types.length > 0 || enums.length > 0 || services.length > 0) {
        const typeInfos = types.map((type) => getTypeInfo(type, options));
        const serviceInfos = services.map(getServiceInfo);

        [...typeInfos, ...serviceInfos].forEach((typeInfo) => {
            typeInfo.imports.forEach(({ path, name }) => {
                if (!imports.has(path)) {
                    imports.set(path, new Set());
                }

                imports.get(path)?.add(name);
            });
        });

        const file = prettier.format(
            `
            /* eslint-disable */
            ${getImportString(imports)}

            ${enums.map(getEnumCode).join('\n\n')}

            ${typeInfos.map((info) => info.typeString).join('\n\n')}

            ${serviceInfos.map((info) => info.typeString).join('\n\n')}
        `,
            { ...options.prettierConfig, parser: 'typescript' }
        );

        // Ensure that type's parent has a file
        const filePath = namespaceToPath(namespace.fullName);

        outputFileSync(`${path.join(options.outDir, filePath)}.ts`, file);
    }
}
