import {MiddlewareStack, Middleware, Handler} from './types'

/**
 * Composes middleware from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @returns A middleware obtained by composing the argument middlewares from right
 *   to left. For example, `compose(f, g, h)(handler)` is identical to doing
 *   `(...args) => f(g(h(...args)))(handler)`.
 */
export function compose<TEvent, TResult>(): <TEvent, TResult>(
  next: Handler<TEvent, TResult>,
) => Handler<TEvent, TResult>

/**
 * Composes middleware from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param middleware - The outermost middleware to compose.
 * @returns A middleware obtained by composing the argument middlewares from right
 *   to left. For example, `compose(f, g, h)(handler)` is identical to doing
 *   `(...args) => f(g(h(...args)))(handler)`.
 */
export function compose<TEvent, TResult, TNextEvent, TNextResult>(
  middleware: Middleware<TEvent, TResult, TNextEvent, TNextResult>,
): Middleware<TEvent, TResult, TNextEvent, TNextResult>

/* two functions */
export function compose<
  TEvent,
  TResult,
  TIntermediateEvent,
  TIntermediateResult,
  TNextEvent,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TResult,
    TIntermediateEvent,
    TIntermediateResult
  >,
  middleware2: Middleware<
    TIntermediateEvent,
    TIntermediateResult,
    TNextEvent,
    TNextResult
  >,
): MiddlewareStack<TEvent, TResult, TNextEvent, TNextResult>

/* three functions */
export function compose<
  TEvent,
  TResult,
  TIntermediateEvent1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateResult2,
  TNextEvent,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TResult,
    TIntermediateEvent1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateResult2,
    TNextEvent,
    TNextResult
  >,
): MiddlewareStack<TEvent, TResult, TNextEvent, TNextResult>

/* four functions */
export function compose<
  TEvent,
  TResult,
  TIntermediateEvent1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateResult3,
  TNextEvent,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TResult,
    TIntermediateEvent1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateResult3,
    TNextEvent,
    TNextResult
  >,
): MiddlewareStack<TEvent, TResult, TNextEvent, TNextResult>

/* five functions */
export function compose<
  TEvent,
  TResult,
  TIntermediateEvent1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateResult3,
  TIntermediateEvent4,
  TIntermediateResult4,
  TNextEvent,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TResult,
    TIntermediateEvent1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateResult3,
    TIntermediateEvent4,
    TIntermediateResult4
  >,
  middleware5: Middleware<
    TIntermediateEvent4,
    TIntermediateResult4,
    TNextEvent,
    TNextResult
  >,
): MiddlewareStack<TEvent, TResult, TNextEvent, TNextResult>

/* six functions */
export function compose<
  TEvent,
  TResult,
  TIntermediateEvent1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateResult3,
  TIntermediateEvent4,
  TIntermediateResult4,
  TIntermediateEvent5,
  TIntermediateResult5,
  TNextEvent,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TResult,
    TIntermediateEvent1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateResult3,
    TIntermediateEvent4,
    TIntermediateResult4
  >,
  middleware5: Middleware<
    TIntermediateEvent4,
    TIntermediateResult4,
    TIntermediateEvent5,
    TIntermediateResult5
  >,
  middleware6: Middleware<
    TIntermediateEvent5,
    TIntermediateResult5,
    TNextEvent,
    TNextResult
  >,
): MiddlewareStack<TEvent, TResult, TNextEvent, TNextResult>

/* seven functions */
export function compose<
  TEvent,
  TResult,
  TIntermediateEvent1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateResult3,
  TIntermediateEvent4,
  TIntermediateResult4,
  TIntermediateEvent5,
  TIntermediateResult5,
  TIntermediateEvent6,
  TIntermediateResult6,
  TNextEvent,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TResult,
    TIntermediateEvent1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateResult3,
    TIntermediateEvent4,
    TIntermediateResult4
  >,
  middleware5: Middleware<
    TIntermediateEvent4,
    TIntermediateResult4,
    TIntermediateEvent5,
    TIntermediateResult5
  >,
  middleware6: Middleware<
    TIntermediateEvent5,
    TIntermediateResult5,
    TIntermediateEvent6,
    TIntermediateResult6
  >,
  middleware7: Middleware<
    TIntermediateEvent6,
    TIntermediateResult6,
    TNextEvent,
    TNextResult
  >,
): MiddlewareStack<TEvent, TResult, TNextEvent, TNextResult>

/* rest */
export function compose<TEvent, TResult>(
  middleware1: Middleware<TEvent, TResult, any, any>,
  ...restMiddlewares: Middleware<any, any>[]
): Middleware<TEvent, TResult, any, any>

export function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): Middleware<TEvent, TResult, any, any>

export function compose<TEvent, TResult>(
  ...middlewares: Middleware<any, any>[]
): MiddlewareStack<TEvent, TResult, any, any> {
  return middlewares.reduce(
    (a: Middleware<TEvent, TResult>, b) => next => a(b(next)),
    (next: Handler<TEvent, TResult>) => next,
  )
}
