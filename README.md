# FaaSKit

[![npm version](https://img.shields.io/npm/v/@faaskit/core.svg?logo=npm&style=popout-square)](https://www.npmjs.com/package/@faaskit/core)

_A lightweight functional middleware framework for AWS lambda that stays out of your way and lets you build kick-ass, composable middleware for your lambdas._

Zero dependencies. Functional interface. Reusable code.

## Table of Contents

- [Installation](#installation)
- [Project Purpose](#project-purpose)
- [Basic Usage](#basic-usage)
- [Customizing Existing Middleware](#customizing-existing-middleware)
- [Creating Partial Middleware](#creating-partial-middleware)
- [Building New Middleware](#building-new-middleware)

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

The goal of this project is to provide a very thin middleware framework for AWS lambda.
Without a well-established middleware pattern, too many bad habits can fossilize from one-off functions into bad middleware.
This library provides a `compose` function for wrapping middleware around a handler without having deeply nested code.
This function wrapping pattern allows explicitly definied, functional and onion-style (a well-established style) middleware.
`@faaskit/core` also builds on the basic compose function, offering a few patterns that the author(s) have seen in the wild for rapid customization.

Too many middlework frameworks enforce bad designs and opinions onto their users.
`faaskit` doesn't impose much at all and it stays out of your way once you define your stack.

