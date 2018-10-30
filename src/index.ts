import { Context } from 'aws-lambda'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>

export type Middleware = (next: Handler) => Handler

const compose = (...middlewares: Middleware[]) => {
  return middlewares.reduce(
    (a: Middleware, b: Middleware) => (next: Handler) => a(b(next)),
    (next: Handler) => next,
  )
}

export default compose
