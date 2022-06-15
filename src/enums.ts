import { Enum } from '@cldcvr/protobufjs';
import { getCommentBlock } from './utils';

export function getEnumCode(enum_: Enum) {
    let enumString = `${getCommentBlock(enum_)}export enum ${enum_.name} {\n`;

    Object.entries(enum_.values).forEach(([key, id]) => {
        const enumValue = enum_.valuesById[Number(id)];
        enumString += `${key} = "${enumValue}",\n`;
    });

    enumString = `${enumString}\n}`;

    return enumString;
}
