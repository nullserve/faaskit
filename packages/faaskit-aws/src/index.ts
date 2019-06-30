import {Context as LambdaContext, Handler as LambdaHandler} from 'aws-lambda'

import {Handler as FaasHandler} from '@nullserve/faaskit-core'
import {createContext} from '@nullserve/faaskit-context'

export type AWSMiddleware<
  TEvent,
  TResult,
  TNextEvent = any,
  TNextResult = any
> = (
  next: LambdaHandler<TNextEvent, TNextResult>,
) => LambdaHandler<TEvent, TResult>

export type AWSMiddlewareStack<
  TEvent,
  TResult,
  TNextEvent = any,
  TNextResult = any
> = AWSMiddleware<TEvent, TResult, TNextEvent, TNextResult>

export type AWSFaasMiddlewareAdapter<
  TEvent,
  TResult,
  TNextEvent = any,
  TNextResult = any
> = (
  next: FaasHandler<TNextEvent, TNextResult>,
) => LambdaHandler<TEvent, TResult>

export const Context = createContext<LambdaContext>(null)

export function convertHandler<TEvent, TResult>(
  handler: FaasHandler<TEvent, TResult>,
): LambdaHandler<TEvent, TResult> {
  const wrappedHandler: LambdaHandler<TEvent, TResult> = async (
    event,
    context,
  ) => {
    Context.provide(context)
    return handler(event)
  }
  return wrappedHandler
}
