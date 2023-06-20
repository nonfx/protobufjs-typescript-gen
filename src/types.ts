import { Type } from 'protobufjs';
import { getEnumCode } from './enums';
import { ProtoGenOptions } from './options';
import {
    fieldToTypescriptType,
    getCommentBlock,
    Import,
    isEnumConstructor,
    isTypeConstructor,
    safeObjectKey,
} from './utils';

export function getTypeInfo(type_: Type, options: ProtoGenOptions) {
    let typeString = `${getCommentBlock(type_)}export interface ${type_.name} {\n`;

    let imports: Array<Import> = [];

    // We only support nested types for now
    if (type_.nested) {
        Object.values(type_.nested).forEach((nestedType) => {
            if (isTypeConstructor(nestedType)) {
                nestedType.name = `${type_.name}_${nestedType.name}`;

                const typeInfo = getTypeInfo(nestedType, options);

                imports = imports.concat(typeInfo.imports);
                typeString = `${typeInfo.typeString}\n\n${typeString}`;
            } else if (isEnumConstructor(nestedType)) {
                typeString = `${getEnumCode(nestedType)}\n\n${typeString}`;
            }
        });
    }

    Object.values(type_.fields).forEach((field) => {
        const fieldType = fieldToTypescriptType(field, options);

        if (fieldType.typeImport) {
            imports.push(fieldType.typeImport);
        }

        typeString += `${getCommentBlock(field)}${safeObjectKey(field.name)}${
            fieldType.isOptional ? '?' : ''
        }: ${fieldType.type},\n`;
    });

    typeString = `${typeString}\n}`;

    return { imports, typeString };
}
