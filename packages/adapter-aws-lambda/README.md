# FaaSKit Adapter AWS Lambda

[![npm version](https://img.shields.io/npm/v/@faaskit/adapter-aws-lambda.svg?logo=npm&style=popout-square)](https://www.npmjs.com/package/@faaskit/adapter-aws-lambda)

This package is a sub-package of [FaaSKit](https://github.com/nullserve/faaskit) which makes FaaSKit easier to use in AWS Lambda or with libraries and handlers already designed for AWS Lambda; It should be used when utilizing any other FaaSKit middleware packages designed for AWS types.

## Table of Contents

- [Installation](#installation)
- [Project Purpose](#project-purpose)
- [Basic Use](#basic-use)
- [API](#customizing-existing-middleware)
  - [adaptFaasKitHandlerForLambda](#adaptFaasKitHandlerForLambda)
  - [adaptLambdaHandlerForFaasKit](#adaptLambdaHandlerForFaasKit)
- [Endorsement for Experienced Developers](#endorsement-for-experienced-developers)

## Installation

To use `@faaskit/adapter-aws-lambda` in your nodejs project,

```bash
yarn add @faaskit/core @faaskit/adapter-aws-lambda
# Helpful for typescript users
yarn add -D @types/aws-lambda
```

or

```bash
npm i @faaskit/core @faaskit/adapter-aws-lambda
# Helpful for typescript users
npm i -D @types/aws-lambda

```

## Project Purpose

The primary purpose of this and other adaptors is they translate the context and handler typings into the expected FaaSKit generalized typings; this will provide a lot of utility for Typescript and VSCode users.
Since FaaSKit was designed from an AWS Lambda perspective, not much needs to be adapted -- but the context-passing done by Middleware works better if the root context is mostly empty, which Lambda does not provide.

## Use

Suppose you have an existing handler in use with AWS, but want some of the perks of FaaSKit or its middleware ecosystem.
You can wrap the existing handler and compose middleware around that.

```typescript
// Typescript typings
import {Handler, Context, Callback} from 'aws-lambda'

import {compose, composeMiddleware} from '@faaskit/core'
import {adaptLambdaHandlerForFaasKit} from '@faaskit/adapter-aws-lambda'

// These are made up
import {
  FakeFaasKitMiddlewareStack,
  MadeUpFaasKitMiddlewareStack,
} from '@fake/middlewares'

const myOldLambdaHandler: Handler<string, string> = async (
  event: string,
  context: context,
  callback: Callback<string>,
) => {
  // Do Something!
  return 'Hello World'
  // ...or
  // callback(null, "Hello World")
  // but not both
}

export const myNewHandler = compose(
  composeMiddleware(FakeFaasKitMiddlewareStack, MadeUpFaasKitMiddlewareStack),
  adaptLambdaHandlerForFaasKit,
)(myOldLambdaHandler)
```

Alternatively, if you have some existing AWS middleware stack and want to wrap around a FaaSKit Stack or just want to use FaaSKit directly with AWS Lambda:

```typescript
import {compose, composeMiddleware, Handler} from '@faaskit/core'
import {adaptFaasKitHandlerForLambda} from '@faaskit/adapter-aws-lambda'

// These are made up
import {
  FakeAWSMiddlewareStack,
  MadeUpAWSMiddlewareStack,
} from '@fake/middlewares'

const myFaasKitHandler: Handler<string, SomeContext, string> = async (
  event,
  context,
) => {
  // Do Something!
  return 'Hello World'
}

export const myNewHandler = compose(
  adaptFaasKitHandlerForLambda,
  composeMiddleware(FakeAWSMiddlewareStack, MadeUpAWSMiddlewareStack),
)(myFaasKitHandler)
```

You can mix these as needed to work with external middleware.

## API

This package provides two core functions:

### adaptFaasKitHandlerForLambda

This adapter will take a FaaSKit-compatible handler and wrap it in an AWS Lambda-compatible handler, wiring all of the expected FaaSKit values in from AWS Lambda context.
When using FaaSKit in Lambda, this adapter should often be your outermost (first) composed function, unless you have middleware designed specifically for AWS handlers, in which case it should sit between those middleware (first) and FaaSKit middleware (second).

### adaptLambdaHandlerForFaasKit

This adapter will take an AWS Lambda-compatible handler and wrap it in a FaaSKit-compatible handler so that existing lambdas can utilize FaaSKit middlewares. This adapter should often be yore innermost (last) composed function if you are wrapping an existing handler.

## Endorsement for Experienced Developers

If you've hand-written an AWS Lambda before and are trying to decide if the adapter overhead is worth the FaaSKit abstraction -- IT IS. Take a look at the code.
