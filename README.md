# FaaSKit

[![npm version](https://img.shields.io/npm/v/@faaskit/core.svg?logo=npm&style=popout-square)](https://www.npmjs.com/package/@faaskit/core)

_A lightweight functional middleware framework for AWS lambda that stays out of your way and lets you build kick-ass, composable middleware for your lambdas._

Zero dependencies. Functional interface. Reusable code.

## Table of Contents

- [Installation](#installation)
- [Project Purpose](#project-purpose)
- [Packages](#packages)

## Installation

To use `faaskit` in your nodejs project,

```bash
yarn add @faaskit/core
```

or

```bash
npm i @faaskit/core
```

`@faaskit/core` has no dependencies itself (peer or otherwise), so that's it!

## Project Purpose

The goal of this project is to provide a very thin middleware framework for functions as a service.
Without a well-established middleware pattern, too many bad habits can fossilize from one-off functions into bad middleware.
This library provides a `compose` function for creating coposition-style middleware and wrapping around a handler without having deeply nested code.
This function wrapping pattern allows explicitly definied, functional and onion-style (a well-established style) middleware.
`@faaskit/core` also builds on the basic compose function, offering a few patterns that the author(s) have seen in the wild for rapid customization.

Too many middlework frameworks enforce bad designs and opinions onto their users.
`faaskit` doesn't impose much at all and it stays out of your way once you define your stack.

## Packages

FaasKit provides a number of small packages so developers can easily pick and choose features and middleware which are applicable to their use case.
The packages are organized using the following naming scheme:

* `adapter-<name>`: Adapter packages are used for changing the structure of the call site.
These are useful for hooking up FaasKit to existing systems in a variety of ways.
Including different function runtimes, different middleware stacks or existing legacy functions.
* `middleware-<name>`: Middleware packages are used to provide some common middleware functionality.
They typically identify their use case in the name of the middleware.
These middleware are common patterns and expected workflow that have already been established and should be easy to use just by installing the package and composing the middleware into a middleware stack.
* `<name>`: Common goal packages are named without any prefix and are designed around a common goal of middleware.
For example, the `http` package defines a number of utility functions, middleware, contexts and adapters which help anyone using `http` and will be used by other external packages including `middleware-<name>` packages and `adapter-<name>` packages.
Typically these packages are foundational and used by middleware authors to create a consistent experience between FaaS platforms.