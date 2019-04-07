import { Operation } from "fast-json-patch";

declare class ConfigMigrator {
    constructor(originalSchema: object, migrateSchema: object);

    public migrateSchema: object;
    public actionsToApply: Operation[];

    static cleanJSONSchemaKeys(value: string, index: number): string;
    static toJSKey(path: string, filter?: boolean): string;

    migrate(payload: any): any;
}

export = ConfigMigrator;
