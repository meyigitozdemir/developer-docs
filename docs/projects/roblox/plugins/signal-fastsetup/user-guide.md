---
title: User Guide
description: Learn how to use Signal_FastSetup in Roblox Studio.
---

# User Guide

Learn the basic workflow of **Signal_FastSetup**, a Roblox Studio plugin designed to simplify Signal module imports with autocomplete and automatic setup.

## Overview

Signal_FastSetup is intended to make working with Signal modules easier during Roblox Studio development.

The project focuses on three areas:

- **Module imports:** Simplifying the process of importing Signal modules.
- **Autocomplete:** Assisting developers while writing Luau code.
- **Automatic setup:** Reducing repetitive setup work.

The exact behavior depends on the installed plugin version.

## Getting Started

Before continuing:

1. Install FastSignal using the [Installation Guide](./installation).
2. Open Roblox Studio.
3. Open the project where you want to work with Signal modules.
4. Make sure the plugin is installed and available.

## Working With Signal Modules

Signal modules are commonly used in Roblox development to organize event-based communication.

When working with a supported Signal module:

1. Open the relevant Luau script.
2. Navigate to the location where the module is used or imported.
3. Use the autocomplete or setup functionality provided by your installed plugin version.
4. Review any code generated or inserted by the plugin.
5. Verify that module references point to the intended objects.

Do not assume that all Signal implementations use the same API or module structure.

## Autocomplete

Roblox Studio includes a built-in autocomplete system in its Script Editor.

Depending on the installed FastSignal version, additional suggestions may be available when working with supported Signal modules.

When suggestions appear:

1. Review the available completion options.
2. Select the intended suggestion.
3. Use **Tab** or **Enter** to accept it.
4. Check the inserted code before continuing.

Autocomplete availability can depend on the current script and editor context.

## Automatic Setup

Signal_FastSetup is designed to reduce repetitive Signal setup work.

After using a supported setup operation, verify the resulting project structure and code.

Check that:

- Module references are correct.
- Required dependencies are available.
- No unintended changes were introduced.
- Your scripts behave as expected when tested.

Always review automatically generated code before using it in a published experience.

## Recommended Workflow

For a typical development session:

1. Open your Roblox Studio project.
2. Confirm that FastSignal is installed.
3. Open the script you want to edit.
4. Work with your Signal modules using the available plugin features.
5. Review any autocomplete or setup results.
6. Test your changes in Roblox Studio.

## Troubleshooting

### Autocomplete suggestions are missing

- Check whether the plugin is enabled.
- Confirm that Roblox Studio's Script Editor autocomplete is enabled.
- Verify that you are editing a supported script.
- Restart Roblox Studio if necessary.

### Module references are incorrect

Review the module location and check that your code references the intended ModuleScript.

### Unexpected behavior after setup

Inspect the generated code and test your project. Check Roblox Studio's Output window for errors.

## Additional Resources

- [Installation Guide](./installation)
- [Technical Reference](./reference)
- [Changelog](./changelog)
- [Roblox Script Editor Documentation](https://create.roblox.com/docs/studio/script-editor)
- [FastSignal on Creator Store](https://create.roblox.com/store/asset/95297540676869/FastSignal)
