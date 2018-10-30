# serverless-compose

A lightweight middleware framework for AWS lambda

```typescript
const fakeType = {}

// Suppose we have some middleware stack provided for us
const providedMiddleware = compose(
  TimingLogMiddleware,
  ValidationMiddleware(fakeType),
)

// Suppose we have some handler that does a thing
const someHandler: Handler = async (event, context) => {
  return new Promise<void>((resolve, reject) => {
    // Demo. Do nothing
    resolve()
  })
}

// Suppose we want to just apply one middleware before our handler
const myHandler = MappingMiddleware(thing => thing)(someHandler)

// We can wrap a handler with provided middleware
const finalHandler: Handler = providedMiddleware(myHandler)
export finalHandler
}
```
