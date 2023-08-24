import protobuf, { Enum, Namespace, Service, Type } from 'protobufjs';
import { emptyDirSync, outputFileSync, existsSync } from 'fs-extra';
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

export async function generateProtocol(options: UserOptions) {
    const finalOptions = vaidateOptions(options);

    // The places where protocol files can be found
    const cwdList = [finalOptions.protocolDir, '/usr/local/include', ''];

    if (finalOptions.protoCwd) {
        cwdList.unshift(finalOptions.protoCwd);
    }

    root.resolvePath = function (_origin, target) {
        for (const cwdPath of cwdList) {
            const jointPath = path.join(cwdPath, target);
            if (existsSync(jointPath)) {
                return jointPath;
            }
        }

        return target;
    };

    const files = glob.sync('**/*.proto', {
        absolute: true,
        cwd: options.protocolDir,
    });

    const promises: Array<Promise<any>> = [];

    files.forEach((file) => {
        promises.push(
            root.load(file, {
                alternateCommentMode: true,
            })
        );
    });

    await Promise.all(promises);

    // Clear output directory
    emptyDirSync(finalOptions.outDir);

    // Generate the code
    if (!root.nested) {
        throw new Error('Could not find any protocols in root');
    }

    let generatedFiles = 0;

    // We only generate namespaces in the root
    Object.entries(root.nested).forEach(([key, type]) => {
        for (const namespace of finalOptions.ignoreNamespaces) {
            if (key === namespace) {
                return;
            }
        }

        if (isNamespaceConstructor(type)) {
            generatedFiles++;
            generateNamespace(type, finalOptions);
        }
    });

    console.log(`Generated ${generatedFiles} protocol files.`);
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
        const serviceInfos = services.map((service_) => getServiceInfo(service_, options));

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
        const filePath = namespaceToPath(namespace.fullName, options);

        outputFileSync(`${path.join(options.outDir, filePath)}.ts`, file);
    }
}
