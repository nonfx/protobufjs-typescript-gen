import { Method, Service, Type } from 'protobufjs';
import { getCommentBlock, getImport, Import, toLowerCaseFirstLetter } from './utils';
import { ProtoGenOptions } from './options';

export function getServiceInfo(service: Service, options: ProtoGenOptions) {
    let typeString = `export interface ${service.name} {\n`;

    let imports: Array<Import> = [];

    Object.values(service.methods).forEach((method) => {
        const { code, typeImports } = getMethodCode(method, options);
        imports = imports.concat(typeImports);
        typeString += code;
    });

    typeString = `${typeString}\n}`;

    return { imports, typeString };
}

function getMethodCode(method: Method, options: ProtoGenOptions) {
    const typeImports: Array<Import> = [];

    method.resolve();

    if (!method.resolvedRequestType || !method.resolvedResponseType) {
        throw new Error(`Could not resolve type for ${method.name}`);
    }

    const { code: requestCode, import: requestImport } = getServiceTypeInfo(
        method,
        method.resolvedRequestType,
        options
    );

    const { code: responseCode, import: responseImport } = getServiceTypeInfo(
        method,
        method.resolvedResponseType,
        options
    );

    if (requestImport) {
        typeImports.push(requestImport);
    }

    if (responseImport) {
        typeImports.push(responseImport);
    }

    return {
        typeImports,

        code: `${getCommentBlock(method)}${toLowerCaseFirstLetter(
            method.name
        )}(request: ${requestCode}): Promise<${responseCode}>,\n\n`,
    };
}

function getServiceTypeInfo(
    method: Method,
    type: Type,
    options: ProtoGenOptions
): { code: string; import: Import | null } {
    switch (type.fullName) {
        case '.google.protobuf.Value':
            return { code: 'any', import: null };

        case '.google.protobuf.ListValue':
            return { code: 'any[]', import: null };

        case '.google.protobuf.Struct':
            return { code: 'Record<string, any>', import: null };

        case '.google.protobuf.Empty':
            return { code: 'Record<string, never>', import: null };

        default:
            return {
                code: type.name,
                import: getImport(method, type, options),
            };
    }
}
