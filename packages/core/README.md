# FaaSKit Core

[![npm version](https://img.shields.io/npm/v/faaskit/core.svg?logo=npm&style=popout-square)](https://www.npmjs.com/package/@faaskit/core)

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

To use `@faaskit/core` in your nodejs project,

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
`faaskit` also builds on the basic compose function, offering a few patterns that the author(s) have seen in the wild for rapid customization.

Too many middlework frameworks enforce bad designs and opinions onto their users.
`faaskit` doesn't impose much at all and it stays out of your way once you define your stack.

## Basic Usage

The most basic use of `faaskit` is to add timing and error middleware to your handlers.
`recoveryMiddleware` adds code for rejected promises (or thrown `async` functions) in your handlers.
The following example wraps a rejection with an actual response so AWS API Gateway can handle and pass to clients, rather than sending its own 503 error with no information.

```javascript
import {compose, createRecoveryMiddleware} from '@faaskit/core'

// Suppose this is a client that fetches the weather from some external API
import {WeatherClient} from 'made-up-weather-library'

// Your actual handler code
async function getWeather(request, context) {
  // All this does is call this API, but suppose the API is bad and fails a lot,
  // so this is likely to throw an error, rejecting the promise of this function
  response = await WeatherClient.askBadAPIForWeather()
}


// Your own custom error handler
async function sendError(error, _event, _context) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: `${error}`,
      message: 'The darn weather API failed me again!',
    }),
  }
}

// Your own custom timing log Middleware
const TimingMiddleware = (next) => async (event, context) => {
    const startTime = new Date()
    const result = await next(event, context)
    const endTime = new Date()
    const duration = endTime - startTime
    console.log(`It took: ${duration}ms to return the weather`)
    return result
  }
}
const RecoveryMiddleware = createRecoveryMiddleware(sendError)
const MyMiddlewareStack = compose(TimingMiddleware, RecoveryMiddleware)

export const lambdaHandler = MyMiddlewareStack(getWeather)
```

## Customizing Existing Middleware

`faaskit` provides a number of middleware patterns for users to customize and create their own middleware.
These patterns aren't extensive, but do provide a large variety of options.
The current API contains the following middleware options:

### TODO

## Creating Partial Middleware

One of the best things about `compose` is that it itself returns a middleware, so you can create partial middleware chains and reuse code within a project by using `compose` on those partial chains.
Suppose you have HTTP handlers and non HTTP handlers and the non HTTP handlers don't require authentication/authorization or validation but do require recovery, timing and input mapping.

Implementing multiple middleware stacks looks like:

```javascript
// middleware.js
import {compose} from '@faaskit/core'

// ... OMITTED MIDDLEWARE IMPLEMENTATIONS ...

const OuterMiddleware = compose(MyRecoveryMiddleware, MyTimingMiddleware)

const ValidationMiddleware = compose(
  MyAuthMiddleware,
  MyEventValidationMiddleware,
)

export const HttpMiddleware = compose(
  OuterMiddleware,
  ValidationMiddleware,
  MyEventMappingMiddleware,
)

export const RegularMiddleware = compose(
  OuterMiddleware,
  MyEventMappingMiddleware,
)
```

Now, in the AWS handlers, only the middleware that is needed can be used.

```javascript
import {HttpMiddleware, RegularMiddleware} from './middleware'

function myHttpHandler(event, context) {
  // DO SOMETHING...
}

function myRegularHandler(event, context) {
  // DO SOMETHING ELSE...
}

export const handleHttp = HttpMiddleware(myHttpHandler)
export const handleCloudwatchEvents = RegularMiddleware(myRegularHandler)
```

## Building New Middleware

While `compose` is a strong function for assembling middleware, the value it provides is as a starting point as a framework for your own unique requirements.
The only requirement of a middleware is that it accept a `Handler` as its only argument and return a `Handler`, which means that as long as you follow this rule, you can easily create custom, composable middleware, or assemble middleware out of well known patterns provided by `@faaskit/core` via its convenience functions.

Below is an example for creating your own side effect middleware:

```javascript
// middleware.js
import {mySideEffect} from './my-library'

// we use the convention next to indicate the next handler in the middleware chain
// since each middleware returns a handler, we pass that inner-defined handler into the outer middleware when we invoke it
export function MyMiddleware(next) {
  return async (event, context) => {
    // A lambda with Handler signature
    await mySideEffect()

    // After calling side effect, actually call the handler
    return next(event, context)
  }
}
```

And that's it.
Now when assembling your middleware stack, `mySideEffect` will be called before the next middleware and before the handler.
Side effects or translations of the event or response can be called before or after the next handler.
Using the middleware looks like:

```javascript
// handler.js
import { compose, recoveryMiddleware } from '@faaskit/core'

import { MyMiddleware } from './middleware'
import { OtherMadeupMiddleware, SupposeThisExistsMiddleware } from 'shared-lib'

async function handler(event, context) {
  // DO SOMETHING ...
}

export lambdaHandler = compose(
  recoveryMiddleware(async (error, _event, _context) => {console.log(error)})
  SupposeThisExistsMiddleware,
  MyMiddleware,
  OtherMadeupMiddleware,
)(handler)
```

Now an error logging recovery middleware will happen outside (before your middleware and after all other middleware have returned).
Then `SupposeThisExistsMiddleware` will do whatever it does and call your `MyMiddleware` handler before your `MyMiddleware` handler calls `OtherMadeupMiddleware`.
`OtherMadeupMiddleware`, most likely, will call `handler`.
It's wired to do that, but depending on what it does, it may not.
As a middleware author, typically, you should call `next` but you don't have to.
An example of when you might not call `next` would be an authorization middleware or request validation middleware -- they're there to prevent the handler from being called if it doesn't meet certain criteria.

Check `src/middleware.ts` for some examples of translating events and responses or optionally not calling next based on input.
Note that `middleware.ts` contains middleware generators or functions that produce `Middleware`.
As an author, you can decide to generate it based on user-defined parameters or hard-code a middleware.

Suppose you want to convert a ping/pong handler into a pong only handler. You could implement a pattern similar to `createMappingMiddlleware` from `middleware.ts` but hardcode the mapping function:

```javascript
export function PongOnlyMiddleware(next) {
  return async (event, context) => {
    const response = await next(event, context)

    // Intercept the response if it's "ping" and send "pong" instead
    if response === 'ping' {
      return 'pong'
    }
    // Do whatever otherwise
    return response
  }
}
```

It's pretty simple to get started making your own middleware.
If you're not sure, open an issue in github and ask!

Happy Coding!
