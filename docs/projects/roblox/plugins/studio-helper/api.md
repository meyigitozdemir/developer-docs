
---
title: API Reference
description: Technical API documentation for Studio Helper.
---

# API Reference

Technical reference for the StudioHelper Luau module.

::: warning Demo API
The functions on this page are fictional examples
for learning API documentation.
:::

## Overview

The StudioHelper module provides utility functions
for developers working with Roblox Studio.

## Getting Started

In this hypothetical example, the ModuleScript
is located next to the script that uses it.

```luau
local StudioHelper = require(script.Parent.StudioHelper)
```

## Functions

### formatName()

Formats a name by removing leading and trailing spaces.

**Signature**

```luau
StudioHelper.formatName(input: string): string
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| input | string | Yes | Name to format |

**Returns**

`string` — The formatted name.

**Example**

```luau
local result = StudioHelper.formatName("  My Model  ")

print(result)
-- Output: My Model
```

### getVersion()

Returns the current version of the module.

**Signature**

```luau
StudioHelper.getVersion(): string
```

**Parameters**

This function does not require parameters.

**Returns**

`string` — The current module version.

**Example**

```luau
local version = StudioHelper.getVersion()

print(version)
-- Example output: 1.0.0
```

## Error Handling

Document possible errors for each function.

For example:

| Error | Description |
|---|---|
| InvalidArgument | A parameter has an invalid type |
| ModuleNotFound | The required module cannot be found |

These are illustrative errors, not verified
behaviors of an implemented module.

## Types

| Type | Description |
|---|---|
| string | Text value |
| number | Numeric value |
| boolean | True or false |
| Vector3 | Roblox 3D vector |
| Instance | Roblox object |

## Related Documentation

- [Overview](./)
- [Installation](./installation)
- [User Guide](./user-guide)
- [Changelog](./changelog)
