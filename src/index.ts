import { Context } from 'aws-lambda'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>

export type Middleware<TEvent, TResult, TNextEvent = any> = (
  next: Handler<TNextEvent, TResult>,
) => Handler<TEvent, TNextEvent>

export type ComposeReduceFunc<TEvent = any, TResult = any, TNextEvent = any> = (
  a: Middleware<TEvent, TNextEvent>,
  b: Middleware<TNextEvent, TResult>,
) => Middleware<TEvent, TResult>

function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): Middleware<TEvent, TResult> {
  const callbackFn: ComposeReduceFunc = (a, b) => next => a(b(next))
  const initialValue: Middleware<TEvent, TResult> = (
    next: Handler<TEvent, TResult>,
  ) => next
  return middlewares.reduce(callbackFn, initialValue)
}

export default compose
