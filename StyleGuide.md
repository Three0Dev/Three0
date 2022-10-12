Coding Style Guide
==================
This document will give Three0 coding standards, file formatting, and styling recommendations

## General
- Use tabs for indentation
- Use camelCase for variable names
- Use camelCase for function names
- Use camelCase for method names
- Use this-case for directory names
- Use this_case for file names

## Imports
- Use import for importing modules
- Use import as for importing modules with aliases
- Use import {x} from 'module' for importing specific symbols
- Use import {x as y} from 'module' for importing specific symbols with aliases
- Use import * as x from 'module' for importing all symbols as a group
- Use import 'module' for importing side effects only

## Exports
- Use export for exporting symbols that can be imported
- Use export default for exporting symbols that can be imported with a default
- Use export = for exporting symbols that can be imported with a default and can also be imported with aliases
- Use export as namespace for exporting symbols that can be imported with a default and can also be imported with aliases

## Directory Structure
- Use this-case for directory names
- Use this_case for file names
- Use index.ts for the main entry point of a module
- Include the following directories pathing from the root of the project
  - src
    - assets
      - images
      - styles
      - fonts
    - components
      - component1 directory
        - component1 files
      - component2 directory
        - component2 files
    - services
    - state
    - views
      - view1 directory
        - view1 files
      - view2 directory
        - view2 files
    - Core.ts (entry point for the application)
    - config.ts (configuration file for the application)
    - index.ts 
    - index.html (main html file for the application)
    - global.css (global css file for the application)

    visit https://www.taniarascia.com/react-architecture-directory-structure/ for more information
    
## eslint
- Use eslint for linting
- Use eslint-config-airbnb-base for the base configuration
- Use eslint-config-prettier for disabling all formatting-related rules
- Use eslint-plugin-import for linting import statements
- Use eslint-plugin-prettier for running Prettier as an ESLint rule

## Comments
- Use // for single line comments
- Use /* */ for multi-line comments
- Use /// for documentation comments
