/* eslint-disable */

export enum OuterEnum {
    FOO = 'FOO',
    BAR = 'BAR',
}

export enum MapValueEnumNoBinary {
    MAP_VALUE_FOO_NOBINARY = 'MAP_VALUE_FOO_NOBINARY',
    MAP_VALUE_BAR_NOBINARY = 'MAP_VALUE_BAR_NOBINARY',
    MAP_VALUE_BAZ_NOBINARY = 'MAP_VALUE_BAZ_NOBINARY',
}

export interface Empty {}

export interface EnumContainer {
    outerEnum?: OuterEnum;
}

export interface Simple1 {
    aString: string;
    aRepeatedString?: string[];
    aBoolean?: boolean;
}

// A message that differs from Simple1 only by name
export interface Simple2 {
    aString: string;
    aRepeatedString?: string[];
}

export interface SpecialCases {
    normal: string;
    // Examples of Js reserved names that are converted to pb_<name>.
    default: string;
    function: string;
    var: string;
}

export interface OptionalFields_Nested {
    anInt?: number;
}

export interface OptionalFields {
    aString?: string;
    aBool: boolean;
    aNestedMessage?: OptionalFields_Nested;
    aRepeatedMessage?: OptionalFields_Nested[];
    aRepeatedString?: string[];
    anyValue?: unknown;
}

export interface HasExtensions {
    str1?: string;
    str2?: string;
    str3?: string;
    taxonomy1?: string;
}

export interface Complex_Nested {
    anInt: number;
}

export interface Complex {
    aString: string;
    anOutOfOrderBool: boolean;
    aNestedMessage?: Complex_Nested;
    aRepeatedMessage?: Complex_Nested[];
    aRepeatedString?: string[];
}

// Make sure this doesn't conflict with the other Complex message.
export interface OuterMessage_Complex {
    innerComplexField?: number;
    value?: unknown;
    struct?: Record<string, unknown>;
}

export interface OuterMessage {}

export enum Enum {
    E1 = 'E1',
    E2 = 'E2',
}

export interface DefaultValues {
    // Options: [{"default":"default<>abc"}]
    stringField?: string;
    // Options: [{"default":true}]
    boolField?: boolean;
    // Options: [{"default":11}]
    intField?: string;
    // Options: [{"default":"E1"}]
    enumField?: Enum;
    // Options: [{"default":""}]
    emptyField?: string;
    // Base64 encoding is "bW9v"
    // Options: [{"default":"moo"}]
    bytesField?: Uint8Array;
}

export interface FloatingPointFields {
    optionalFloatField?: number;
    requiredFloatField: number;
    // Options: {"packed":false}
    repeatedFloatField?: number[];
    // Options: [{"default":2}]
    defaultFloatField?: number;
    optionalDoubleField?: number;
    requiredDoubleField: number;
    // Options: {"packed":false}
    repeatedDoubleField?: number[];
    // Options: [{"default":2}]
    defaultDoubleField?: number;
}

export interface TestClone {
    str?: string;
    simple1?: Simple1;
    simple2?: Simple1[];
    bytesField?: Uint8Array;
    unused?: string;
}

export interface CloneExtension {
    // extend TestClone {
    // optional CloneExtension ext_field = 100;
    // }
    ext?: string;
}

export interface TestGroup_OptionalGroup {
    id: string;
}

export interface TestGroup_RequiredGroup {
    id: string;
}

export interface TestGroup_RepeatedGroup {
    id: string;
    // Options: {"packed":false}
    someBool?: boolean[];
}

export interface TestGroup {
    repeatedGroup?: TestGroup_RepeatedGroup[];
    requiredGroup: TestGroup_RequiredGroup;
    optionalGroup?: TestGroup_OptionalGroup;
    id?: string;
    requiredSimple: Simple2;
    optionalSimple?: Simple2;
}

export interface TestGroup1 {
    group?: TestGroup_RepeatedGroup;
}

export interface TestReservedNames {
    extension?: number;
}

export interface TestReservedNamesExtension {}

export interface TestMessageWithOneof {
    pone?: string;
    pthree?: string;
    rone?: TestMessageWithOneof;
    rtwo?: string;
    normalField?: boolean;
    repeatedField?: string[];
    // Options: [{"default":1234}]
    aone?: number;
    atwo?: number;
    bone?: number;
    // Options: [{"default":1234}]
    btwo?: number;
}

export interface TestEndsWithBytes {
    value?: number;
    data?: Uint8Array;
}

export interface TestMapFieldsNoBinary {
    mapStringString?: Record<string, string>;
    mapStringInt32?: Record<string, number>;
    mapStringInt64?: Record<string, string>;
    mapStringBool?: Record<string, boolean>;
    mapStringDouble?: Record<string, number>;
    mapStringEnum?: Record<string, MapValueEnumNoBinary>;
    mapStringMsg?: Record<string, MapValueMessageNoBinary>;
    mapInt32String?: Record<string, string>;
    mapInt64String?: Record<string, string>;
    mapBoolString?: Record<string, string>;
    testMapFields?: TestMapFieldsNoBinary;
    mapStringTestmapfields?: Record<string, TestMapFieldsNoBinary>;
}

export interface MapValueMessageNoBinary {
    foo?: number;
}

export interface Deeply_Nested_Message {
    count?: number;
}

export interface Deeply_Nested {}

export interface Deeply {}

export interface BasicService {
    // Options: [{"(google.api.http)":{"get":"/taxonomy-service/v1/taxonomy/domain"}}]
    getDomain(): Promise<TestMessageWithOneof>;

    // Options: [{"(google.api.http)":{"get":"/taxonomy-service/v1/taxonomy/domain/{domainLevel}"}}]
    getDomainByLevel(request: MapValueMessageNoBinary): Promise<TestMapFieldsNoBinary>;
}
