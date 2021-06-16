import {Context as LambdaContext, Handler as LambdaHandler} from 'aws-lambda'

import {Handler as FaasKitHandler} from '@faaskit/core'

export interface Context {
  AWSLambda: LambdaContext
}

export function adaptFaasKitHandlerForLambda<TEvent, TResult>(
  handler: FaasKitHandler<TEvent, Context, TResult>,
): LambdaHandler<TEvent, TResult> {
  return async (event, context) => handler(event, {AWSLambda: context})
}

export function adaptLambdaHandlerForFaasKit<
  TEvent,
  TContext extends Context,
  TResult,
>(
  handler: LambdaHandler<TEvent, TResult>,
): FaasKitHandler<TEvent, TContext, TResult> {
  return async (event, context) =>
    new Promise((resolve, reject) => {
      const result = handler(
        event,
        context.AWSLambda,
        (error?: Error | string | null, result?: TResult) => {
          if (error === undefined || error === null) {
            // FIXME: undefined behavior here caused by trying to wrap loose AWS Lambda typing.
            // It's possible for a developer to say they'll callback with a value and call with undefined/null
            // since typescript does not enforce runtime safety and we're hooking into @types/aws-lambda types.
            // Without an error, it's not possible to know what the developer intended, so we succeed quietly.
            resolve(result!)
          } else {
            reject(error)
          }
        },
      )
      if (result) {
        result.then((result) => resolve(result)).catch((error) => reject(error))
      }
    })
}
