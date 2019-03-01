import { Handler, Middleware } from './middleware'

export function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): Middleware<TEvent, TResult> {
  return middlewares.reduce(
    (a: Middleware<TEvent, TResult>, b) => next => a(b(next)),
    (next: Handler<TEvent, TResult>) => next,
  )
}
