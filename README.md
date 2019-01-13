# serverless-compose

_A lightweight functional middleware framework for AWS lambda that stays out of your way and lets you build kick-ass, composable middleware for your lambdas._

Zero dependencies. Functional Interface. Reusable code.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Building Middleware](#building-middleware)

## Installation

To use `serverless-compose` in your nodejs project,

```bash
yarn add serverless-compose
```

or

```bash
npm i serverless-compose
```

`serverless-compose` has no dependencies itself (peer or otherwise), so that's it!

## Goals

The goal of this project is to provide a very thin middleware framework for AWS lambda.
This library provides a compose function for wrapping middleware around a handler without having deeply nested code.
It also provides a few middleware patterns that the author(s) believed were valuable to help users get started.

## Basic Usage

The most basic use of `serverless-compose` is to add timing and error middleware to your handlers.
`recoveryMiddleware` adds code for rejected promises (or thrown `async` functions) in your handlers.
The following example wraps a rejection in a response that AWS API Gateway can handle and pass to clients, rather than sending its own 503 error with no information.

```javascript
import {
  compose,
  recoveryMiddleware,
  timingLogMiddleware,
} from 'serverless-compose'

// Suppose this is a client that fetches the weather from some external API
import { WeatherClient } from 'made-up-weather-library'

async function getWeather(request, context) {
  // All this does is call this API, but suppose the API is bad and fails a lot,
  // so this is likely to throw an error, rejecting the promise of this function
  response = await WeatherClient.askBadAPIForWeather()
}

async function logDuration(duration) {
  console.log(`It took: ${duration}ms to return the weather`)
}

async function sendError(error) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: `${error}`,
      message: 'The darn weather API failed me again!',
    }),
  }
}

const TimingMiddleware = timingLogMiddleware(logDuration)
const RecoveryMiddleware = recoveryMiddleware(sendError)
const MyMiddlewareStack = compose(
  TimingMiddleware,
  RecoveryMiddleware,
)

export const lambdaHandler = MyMiddlewareStack(getWeather)
```

## Building Middleware

While `compose` is a strong function for assembling middleware, the value it provides is a starting point as a framework for your own unique requirements.
`serverless-compose` has attempted to provide a few well known patterns for middleware authors as convenience functions, but these are only for convenience, not a restriction or necessity.
Authors may feel free to create middleware without the convenience functions.
The only requirement of a middleware is that it accept a `Handler` as its only argument and return a `Handler`.

```javascript
// TODO
```

## Using serverless-compose to wrap handlers

In your handler code, you can create a normal AWS lambda handler and wrap it with provided middleware using the `compose` function.

```javascript
import { compose } from 'serverless-compose'

// Suppose you have middleware defined elsewhere in your codebase
import {
  RecoveryMiddleware,
  TimingLogMiddleware,
  RequestValidationMiddleware,
} from './middleware'

// Your handler
async function MyHandler(event, context) {
  // Do something
}

// Creating a middleware stack inline and wrapping the handler
// Use this wrapped handler as your lambda handler
export const MiddlewareWrappedHandler = compose(
  RecoveryMiddleware,
  TimingLogMiddleware,
  RequestValidationMiddleware,
)(MyHandler) // Notice! compose returns a function that takes your handler as its only parameter
```

Optionally, you can create the middleware stack that all of your lambdas will use in one location:

```javascript
// middleware.js
import {
  compose,
  recoveryMiddleware,
  timingLogMiddleware,
  validationMiddleware,
} from 'serverless-compose'

// A very simple timing log middleware which simply logs the duration to console log
export const TimingLogMiddleware = timingLogMiddleware(
  duration =>
    new Promise(resolve => {
      console.log(duration)
      resolve()
    }),
)

// A very simple validation middleware which allows anything ;)
export const RequestValidationMiddleware = validationMiddleware(
  (event, context) =>
    new Promise(resolve => {
      resolve()
    }),
)

// A recovery middleware that wraps an error in a known object type
export const RecoveryMiddleware = recoveryMiddleware(
  async (error, event, context) => {
    // perhaps log the error remotely
    await logError(error, event, context) // not defined, but just an example
    // Defer to a known error type
    return {
      status: '500',
      message: 'Internal service error',
      error: string(error),
    }
  },
)

export const MyMiddleware = compose(
  RecoveryMiddleware,
  TimingLogMiddleware,
  RequestValidationMiddleware,
)
```

Then import it for your handlers to all use:

```javascript
// handle.js
import { MyMiddleware } from './middleware'

export const HandleHello = MyMiddleware((event, context) => {
  return new Promise(resolve => {
    resolve(`Hello ${event}`)
  })
})

export const HandlePing = MyMiddleware((event, context) => {
  return new Promise((resolve, reject) => {
    if event === 'Ping' {
      resolve(pong)
    } else {
      reject('Error: expected ping')
    }
  })
})
```
