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
- Import modules in the following order:
  - external modules
  - modules from a parent directory
  - modules from the same or a sibling's directory
  - modules from a child's directory
    - directory import order
      - assets
      - components
      - services
      - state
      - views
- Group similar import together
- Don't skip lines between import

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

## Classes
- Use class for declaring classes
- Use extends for inheriting from a parent class
- Use implements for implementing an interface
- Use constructor for declaring a constructor
- Use super for calling the parent class constructor

## Functions
- Use function for declaring functions
- Use => for declaring arrow functions
- Use async for declaring async functions
- Use async => for declaring async arrow functions

## Variables
- Use let for declaring variables that can be reassigned
- Use const for declaring variables that cannot be reassigned

## Types
- Use type for declaring types
- Use interface for declaring interfaces
- Use enum for declaring enums
- Use namespace for declaring namespaces

## Testing
- Use jest for testing
- Use jest-cli for running tests from the command line
- Use jest-junit for outputting test results in JUnit format
- Use jest-sonar-reporter for outputting test results in SonarQube format
- Use jest-html-reporter for outputting test results in HTML format
- Use jest-coverage-badges for outputting test coverage in badges
    
## Comments
- Use // for single line comments
- Use /* */ for multi-line comments
- Use /// for documentation comments

## eslint
- Use eslint for linting
- Use eslint-config-airbnb-base for the base configuration
- Use eslint-config-prettier for disabling all formatting-related rules
- Use eslint-plugin-import for linting import statements
- Use eslint-plugin-prettier for running Prettier as an ESLint rule

## Formatting
- Use Prettier for formatting
- Use prettier-eslint for formatting with ESLint
- Use prettier-eslint-cli for formatting with ESLint from the command line
- Use prettier-eslint-config for formatting with ESLint

## npm
- Use npm for package management
- Use package.json for defining the package   

