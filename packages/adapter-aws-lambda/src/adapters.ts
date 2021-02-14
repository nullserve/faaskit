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
  TResult
>(
  handler: LambdaHandler<TEvent, TResult>,
): FaasKitHandler<TEvent, TContext, TResult> {
  return async (event, context) =>
    new Promise((resolve, reject) => {
      const result = handler(event, context.AWSLambda, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      })
      if (result) {
        result.then((result) => resolve(result)).catch((error) => reject(error))
      }
    })
}
