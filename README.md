# ConfigMigration
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/ConfigMigration/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![size](https://img.shields.io/bundlephobia/min/@slimio/config-migration.svg?style=flat)
![dep](https://img.shields.io/david/SlimIO/ConfigMigration.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/SlimIO/ConfigMigration/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/ConfigMigration?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/ConfigMigration.svg?branch=master)](https://travis-ci.com/SlimIO/ConfigMigration)
[![Greenkeeper badge](https://badges.greenkeeper.io/SlimIO/ConfigMigration.svg)](https://greenkeeper.io/)

SlimIO Configuration Migration. This package is used in SlimIO when addon Schema has been updated, so we need to migrate the Configuration Content to not break the startup.

## Requirements
- [Node.js](https://nodejs.org/en/) v12 or higher

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

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|Type checker|
|[fast-json-patch](https://github.com/Starcounter-Jack/JSON-Patch)|⚠️Major|High|Interact with JSON file|
|[lodash.clonedeep](https://lodash.com/)|Minor|Low|Clone deep Objects|
|[lodash.get](https://lodash.com/)|Minor|Low|Get deep a value|
|[lodash.set](https://lodash.com/)|Minor|Low|Set deep a value|

## License
MIT
