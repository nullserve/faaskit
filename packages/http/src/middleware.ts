import {Middleware} from '@faaskit/core'
import {Context} from './context'

export function createHeaderAcceptMiddleware<
  TEvent,
  TContext extends Context,
  TResult
>(): Middleware<TEvent, TContext, TResult> {
  return (next) => async (event, context) => {
    return next(event, context)
  }
}
