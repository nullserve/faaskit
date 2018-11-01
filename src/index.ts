import { Context } from 'aws-lambda'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>

export type Middleware<TEvent, TResult, TNextEvent = any, TNextResult = any> = (
  next: Handler<TNextEvent, TNextResult>,
) => Handler<TEvent, TResult>

export type ComposeReduceFunc<
  TEvent = any,
  TResult = any,
  TNextEvent = any,
  TNextResult = any
> = (
  a: Middleware<TEvent, TResult>,
  b: Middleware<TNextEvent, TNextResult>,
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
