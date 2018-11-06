# serverless-compose

A lightweight middleware framework for AWS lambda

## Goals

The goal of this project is to provide a very thin middleware framework for AWS lambda.

## Example

```javascript
import { compose, mappingMiddleware, timingLogMiddleware, validationMiddleware } from 'serverless-compose'

// A very simple timing log middleware which simply logs the duration to console log
const TimingLogMiddleware = timingLogMiddleware(
  duration => new Promise(resolve => {
    console.log(duration)
    resolve()
  })
)

// A very simple validation middleware which allows anything ;)
const ValidationMiddleware = validationMiddleware(
  event => new Promise(resolve => {
    resolve()
  })
)

// Suppose we have some middleware stack provided for us
const providedMiddleware = compose(
  TimingLogMiddleware,
  ValidationMiddleware,
)

// Suppose we have some handler that does a thing
const someHandler = (event, context) => new Promise((resolve, reject) => {
    // Demo. Do nothing
    resolve()
})

// Suppose the provided middleware isn't perfect, so we add a mapping middleware which adds a default value before our handler
const myWrappedHandler = requestMappingMiddleware(
  event => new Promise(resolve => {
    resolve({
      someKey: 'default value'
      ...event,
    })
  })
)(someHandler)

// We can wrap our middleware with provided middleware
const finalHandler = providedMiddleware(myWrappedHandler)
export finalHandler
```
