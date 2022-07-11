import { Enum, FieldBase, Namespace, ReflectionObject, Service, Type } from 'protobufjs';
import { ProtoGenOptions } from './options';

export function getCommentBlock(object: ReflectionObject) {
    let typeString = '\n';

    if (object.comment) {
        typeString += object.comment
            .trim()
            .split('\n')
            .map((commentLine) => `// ${commentLine}`)
            .join('\n');
    }

    const options = object.parsedOptions ?? object.options;
    if (options) {
        typeString += `\n// Options: ${JSON.stringify(options)}`;
    }

    typeString = typeString.trim();

    return typeString ? `${typeString}\n` : '';
}

export function getImport(object: ReflectionObject, targetObject: ReflectionObject | null) {
    if (!targetObject) {
        return null;
    }

    const objectNameSpace = getClosestNamespace(object);
    const targetObjectNamespace = getClosestNamespace(targetObject);

    // Field and type belong in same namespace
    if (objectNameSpace === targetObjectNamespace) {
        return null;
    }

    return {
        name: targetObject.name,
        path: namespaceToPath(targetObject.fullName).replace(`/${targetObject.name}`, ''),
    };
}

export function getClosestNamespace(root: ReflectionObject) {
    let currentRoot = root;

    while (currentRoot.parent) {
        if (currentRoot.parent && isNamespaceConstructor(currentRoot.parent)) {
            return currentRoot.parent;
        }

        currentRoot = currentRoot.parent;
    }

    return null;
}

export function namespaceToPath(namespace: string) {
    const pathsToExclude = ['v0'];

    return namespace
        .split('.')
        .filter(Boolean)
        .filter((str) => str.length > 0 && !pathsToExclude.includes(str))
        .join('/');
}

export function isTypeConstructor(type: ReflectionObject): type is Type {
    return type.toString().split(' ')[0] === 'Type';
}

export function isNamespaceConstructor(type: ReflectionObject): type is Namespace {
    return type.toString().split(' ')[0] === 'Namespace';
}

export function isEnumConstructor(type: ReflectionObject): type is Enum {
    return type.toString().split(' ')[0] === 'Enum';
}

export function isServiceConstructor(type: ReflectionObject): type is Service {
    return type.toString().split(' ')[0] === 'Service';
}

export function toLowerCaseFirstLetter(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export type Import = {
    name: string;
    path: string;
};

export function fieldToTypescriptType(field: FieldBase, options: ProtoGenOptions) {
    let type: string;
    let isOptional = field.optional;
    let typeImport: Import | null = null;

    if (field.options) {
        Object.keys(field.options).forEach((fieldKey) => {
            if (fieldKey.startsWith('(validate.')) {
                isOptional = false;
            }
        });
    }

    switch (field.type) {
        case 'double':
        case 'float':
        case 'int32':
        case 'uint32':
        case 'sint32':
        case 'fixed32':
        case 'sfixed32':
            type = 'number';
            break;
        case 'int64':
        case 'uint64':
        case 'sint64':
        case 'fixed64':
        case 'sfixed64':
            // type = config.forceLong ? "Long" : config.forceNumber ? "number" : "number|Long";
            type = 'number';
            break;
        case 'bool':
            type = 'boolean';
            break;
        case 'string':
            type = 'string';
            break;
        case 'bytes':
            type = 'Uint8Array';
            break;

        // Custom protobuf mapping
        case 'google.protobuf.Value':
            type = 'any';
            break;

        case 'google.protobuf.ListValue':
            type = 'any[]';
            break;

        case 'google.protobuf.Struct':
            type = 'Record<string, any>';
            break;

        case 'google.protobuf.Empty':
            type = 'Record<string, never>';
            break;

        default:
            // Resolve nested type
            field.resolve();

            if (field.resolvedType?.name) {
                type = field.resolvedType.name;
                typeImport = getImport(field, field.resolvedType);
            } else {
                type = 'unknown';
            }

            break;
    }

    if (field.map) {
        type = 'Record<string,' + type + '>';
    }

    if (field.repeated) {
        if (options.repeatedFieldIsRequired) {
            isOptional = false;
        }

        type = `${type}[]`;
    }

    return { type, typeImport, isOptional };
}

export function getImportString(imports: Map<string, Set<string>>) {
    const entries = Array.from(imports.entries());

    return entries
        .map(([importPath, importNames]) => {
            return `import { ${Array.from(importNames).join(', ')} } from './${importPath}';`;
        })
        .join('\n');
}
