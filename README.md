# serverless-compose

A lightweight middleware framework for AWS lambda

## Table of Contents

- [Installation](#installation)

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
