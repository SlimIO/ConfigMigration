# ConfigMigration
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![V1.0](https://img.shields.io/badge/version-0.1.0-blue.svg)

SlimIO Configuration Migration. This package is used in SlimIO when addon Schema has been updated, so we need to migrate the Configuration Content to not break the startup.

## Features
- Support both `add` and `remove` action.

> Replace is not supported because it's considered dangerous and a bad practices to update keys!

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/config-migration
# or
$ yarn add @slimio/config-migration
```

## Usage example
```js
const { strictEqual } = require("assert");
const ConfigMigrator = require("@slimio/config-migration");

// Original Schema
const originalSchema = {
    properties: {
        hostname: { type: "string" },
        release: { type: "string" }
    }
};

// Migrated Schema (remove >> release, add >> version)
const migratedSchema = {
    properties: {
        hostname: { type: "string" },
        version: {
            type: "string",
            default: "v1.0.0"
        }
    }
}

const cfgMigrator = new ConfigMigrator(originalSchema, migratedSchema);
const migratedPayload = cfgMigrator.migrate({
    hostname: "localhost",
    release: "v1.0.0"
});

const expected = { hostname: "localhost", version: "v1.0.0" };
strictEqual(JSON.stringify(migratedPayload), JSON.stringify(expected));
```

## API
Schema and payload should be plain JavaScript object.
```js
{} || Object.create(null);
```

### constructor(originalSchema: Object, migrateSchema: Object);
Create a new Configuration migrator.

### migrate(payload: Object): Object
Migrate a given payload. The payload will be cloned deep (the original copy shall not be updated).

## LICENCE
MIT
