# FaaSKit Adapter AWS Lambda

This package is a sub package of [FaaSKit](https://github.com/nullserve/faaskit) which makes FaaSKit easier to use in AWS Lambda or with libraries and handlers already designed for AWS Lambda; it should be used when utilizing any other FaaSKit middleware packages designed for AWS types.

The primary purpose of this and other adaptors is they translate the context and handler typings into the expected FaaSKit generalized typings; this will provide a lot of utility for Typescript and VSCode users.
Since FaaSKit was designed from an AWS Lambda perspective, not much needs to be adapted -- but the context-passing done by Middleware works better if the root context is mostly empty, which Lambda does not provide.

## Use

Suppose you have an existing handler, but want some of the perks of FaaSKit or its middleware ecosystem.
You can wrap the existing handler and compose middleware around that.

```typescript
// Typescript typings
import {Handler, Context, Callback} from 'aws-lambda'

import {compose} from '@faaskit/core'
import {adaptLambdaHandlerForFaasKit} from '@faaskit/adapter-aws-lambda'

// These are made up
import {FakeMiddlewareStack, MadeUpMiddlewareStack} from '@fake/middlewares'

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
  FakeMiddlewareStack,
  MadeUpMiddlewareStack,
)(adaptLambdaHandlerForFaasKit(myOldLambdaHandler))
```

Alternatively, if you have some existing middleware stack and want to wrap around a FaaSKit Stack or just want to use FaaSKit directly with AWS Lambda:

```typescript
import {compose, Handler} from '@faaskit/core'
import {adaptFaasKitHandlerForLambda} from '@faaskit/adapter-aws-lambda'

// These are made up
import {FakeMiddlewareStack, MadeUpMiddlewareStack} from '@fake/middlewares'

const myFaasKitHandler: Handler<string, SomeContext, string> = async (
  event,
  context,
) => {
  // Do Something!
  return 'Hello World'
}

export const myNewHandler = adaptFaasKitHandlerForLambda(
  compose(
    FakeMiddlewareStack,
    FakeMiddlewareStack,
    MadeUpMiddlewareStack,
  )(myFaasKitHandler),
)
```

You can mix these as needed to work with external middleware.

## If you've written an AWS Lambda before.

If you've written an AWS Lambda before and are trying to decide if the adapter overhead is worth the FaaSKit abstraction -- IT IS.
