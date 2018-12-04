// Require Third-party Dependencies
const avaTest = require("ava");

// Require Internal Dependencies
const ConfigMigrator = require("../index");

// Original Schema
const OriginalSchema = {
    additionalProperties: false,
    properties: {
        test: {
            type: "object",
            properties: {
                yop: {
                    type: "string"
                }
            }
        },
        hostname: {
            type: "string",
            description: "Agent hostname"
        }
    }
};

// Original Schema
const MigrateSchema = {
    additionalProperties: true,
    properties: {
        test: {
            type: "object",
            properties: {}
        },
        release: {
            type: "string",
            default: "hello",
            description: "Agent hostname"
        }
    }
};

avaTest("test bypass", (assert) => {
    const Mig = new ConfigMigrator(OriginalSchema, MigrateSchema);
    const migrated = Mig.migrate({
        test: {
            yop: "hello"
        },
        hostname: "yopyopdu98"
    });

    assert.deepEqual(migrated, { test: {}, release: "hello" });
});
