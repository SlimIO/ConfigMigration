// Require Third-party Dependencies
const { compare } = require("fast-json-patch");
const is = require("@slimio/is");
const get = require("lodash.get");
const set = require("lodash.set");
const cloneDeep = require("lodash.clonedeep");

// CONSTANTS
const SKIP_KEYWORDS = ["additionalProperties"];
const SCHEMA_KEYWORDS = new Set(["properties"]);

/**
 * @class ConfigMigrator
 * @property {Array} actionsToApply
 */
class ConfigMigrator {
    /**
     * @constructor
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

        this.originalSchema = originalSchema;
        this.migrateSchema = migrateSchema;
        this.actionsToApply = compare(originalSchema, migrateSchema);
    }

    /**
     * @static
     * @method cleanJSONSchemaKeys
     * @memberof ConfigMigrator#
     * @desc Remove JSON Schema properties keys
     * @param {!String} value value
     * @param {!Number} index value index
     * @returns {String}
     */
    static cleanJSONSchemaKeys(value, index) {
        if (!(index % 2) && SCHEMA_KEYWORDS.has(value)) {
            return false;
        }

        return true;
    }

    /**
     * @method toJSKey
     * @memberof ConfigMigrator#
     * @desc Filter JSON Diff keys
     * @param {!String} path path
     * @param {Boolean} [filter=true] filter
     * @returns {String}
     */
    static toJSKey(path, filter = true) {
        const arr = path.split(/\//g).slice(1);

        return filter ? arr.filter(ConfigMigrator.cleanJSONSchemaKeys).join(".") : arr.join(".");
    }

    /**
     * @public
     * @method migrate
     * @memberof ConfigMigrator#
     * @param {*} payload JavaScript Object payload to migrate
     * @return {*}
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

            // console.log(`${op} >> ${schemaPath} => ${propertyPath}`);
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
