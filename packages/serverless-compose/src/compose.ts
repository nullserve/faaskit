import {MiddlewareStack, Middleware, Handler} from './types'

export function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): MiddlewareStack<TEvent, TResult, any, any> {
  return middlewares.reduce(
    (a: Middleware<TEvent, TResult>, b) => next => a(b(next)),
    (next: Handler<TEvent, TResult>) => next,
  )
}
