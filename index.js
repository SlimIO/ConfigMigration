"use strict";

// Require Third-party Dependencies
const { compare } = require("fast-json-patch");
const is = require("@slimio/is");
const get = require("lodash.get");
const set = require("lodash.set");
const cloneDeep = require("lodash.clonedeep");

// CONSTANTS
const SKIP_KEYWORDS = ["additionalProperties"];
const SCHEMA_KEYWORDS = new Set(["properties"]);

class ConfigMigrator {
    /**
     * @class ConfigMigrator
     * @memberof ConfigMigrator#
     * @param {*} originalSchema origin JSON Schema
     * @param {*} migrateSchema schema to migrate
     *
     * @throws {TypeError}
     */
    constructor(originalSchema, migrateSchema) {
        if (!is.plainObject(originalSchema)) {
            throw new TypeError("originalSchema should be a plain JavaScript Object!");
        }
        if (!is.plainObject(migrateSchema)) {
            throw new TypeError("migrateSchema should be a plain JavaScript Object!");
        }

        this.migrateSchema = migrateSchema;
        this.actionsToApply = compare(originalSchema, migrateSchema);
    }

    /**
     * @static
     * @function cleanJSONSchemaKeys
     * @memberof ConfigMigrator#
     * @description Remove JSON Schema properties keys
     * @param {!string} value value
     * @param {!number} index value index
     * @returns {string}
     */
    static cleanJSONSchemaKeys(value, index) {
        if (!(index % 2) && SCHEMA_KEYWORDS.has(value)) {
            return false;
        }

        return true;
    }

    /**
     * @function toJSKey
     * @memberof ConfigMigrator#
     * @description Filter JSON Diff keys
     * @param {!string} path path
     * @param {boolean} [filter=true] filter
     * @returns {string}
     */
    static toJSKey(path, filter = true) {
        const arr = path.split(/\//g).slice(1);

        return filter ? arr.filter(ConfigMigrator.cleanJSONSchemaKeys).join(".") : arr.join(".");
    }

    /**
     * @public
     * @function migrate
     * @memberof ConfigMigrator#
     * @param {*} payload JavaScript Object payload to migrate
     * @returns {*}
     *
     * @throws {TypeError}
     */
    migrate(payload) {
        if (!is.plainObject(payload)) {
            throw new TypeError("payload should be a plain JavaScript Object!");
        }
        const migPayload = cloneDeep(payload);

        for (const { op, path } of this.actionsToApply) {
            if (SKIP_KEYWORDS.some((kw) => path.endsWith(kw))) {
                continue;
            }

            // Retrieve clean path
            const schemaPath = ConfigMigrator.toJSKey(path, false);
            const propertyPath = ConfigMigrator.toJSKey(path);

            switch (op) {
                case "add": {
                    const { default: dV = null } = get(this.migrateSchema, schemaPath);
                    set(migPayload, propertyPath, dV);
                    break;
                }
                case "remove":
                    set(migPayload, propertyPath, void 0);
                    break;
            }
        }

        return JSON.parse(JSON.stringify(migPayload));
    }
}

module.exports = ConfigMigrator;
