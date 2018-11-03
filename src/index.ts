import { Context } from 'aws-lambda'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>

export type Middleware<TEvent, TResult, TNextEvent = any, TNextResult = any> = (
  next: Handler<TNextEvent, TNextResult>,
) => Handler<TEvent, TResult>

export function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): Middleware<TEvent, TResult> {
  return middlewares.reduce(
    (a: Middleware<TEvent, TResult>, b) => next => a(b(next)),
    (next: Handler<TEvent, TResult>) => next,
  )
}

export default compose
