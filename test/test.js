const ConfigMigrator = require("../index");
const avaTest = require("ava");

// Original Schema
const OriginalSchema = {
    additionalProperties: false,
    properties: {
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
        release: {
            type: "string",
            description: "Agent hostname"
        }
    }
};

const Mig = new ConfigMigrator(OriginalSchema, MigrateSchema);
console.log(Mig.migrate({}));

avaTest("test bypass", (assert) => {
    assert.pass();
});
