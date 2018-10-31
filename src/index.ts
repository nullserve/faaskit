import { Context } from 'aws-lambda'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>

export type Middleware<TEvent, TResult, TNextIn = any> = (
  next: Handler<TNextIn, TResult>,
) => Handler<TEvent, TNextIn>

export type ComposeReduceFunc<TEvent = any, TResult = any, TNextEvent = any> = (
  a: Middleware<TEvent, TNextEvent>,
  b: Middleware<TNextEvent, TResult>,
) => Middleware<TEvent, TResult>

export function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): Middleware<TEvent, TResult> {
  const callbackFn: ComposeReduceFunc = (a, b) => next => a(b(next))
  const initialValue: Middleware<TEvent, TResult> = (
    next: Handler<TEvent, TResult>,
  ) => next
  return middlewares.reduce(callbackFn, initialValue)
}

export default compose
