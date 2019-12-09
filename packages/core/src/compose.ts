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
export function compose<TEvent, TContext, TResult>(): <
  TEvent,
  TContext,
  TResult
>(
  next: Handler<TEvent, TContext, TResult>,
) => Handler<TEvent, TContext, TResult>

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
export function compose<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware: Middleware<
    TEvent,
    TContext,
    TResult,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): Middleware<TEvent, TContext, TResult, TNextEvent, TNextContext, TNextResult>

/* two functions */
export function compose<
  TEvent,
  TContext,
  TResult,
  TIntermediateEvent,
  TIntermediateContext,
  TIntermediateResult,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TContext,
    TResult,
    TIntermediateEvent,
    TIntermediateContext,
    TIntermediateResult
  >,
  middleware2: Middleware<
    TIntermediateEvent,
    TIntermediateContext,
    TIntermediateResult,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): MiddlewareStack<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>

/* three functions */
export function compose<
  TEvent,
  TContext,
  TResult,
  TIntermediateEvent1,
  TIntermediateContext1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateContext2,
  TIntermediateResult2,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TContext,
    TResult,
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): MiddlewareStack<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>

/* four functions */
export function compose<
  TEvent,
  TContext,
  TResult,
  TIntermediateEvent1,
  TIntermediateContext1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateContext2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateContext3,
  TIntermediateResult3,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TContext,
    TResult,
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): MiddlewareStack<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>

/* five functions */
export function compose<
  TEvent,
  TContext,
  TResult,
  TIntermediateEvent1,
  TIntermediateContext1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateContext2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateContext3,
  TIntermediateResult3,
  TIntermediateEvent4,
  TIntermediateContext4,
  TIntermediateResult4,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TContext,
    TResult,
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3,
    TIntermediateEvent4,
    TIntermediateContext4,
    TIntermediateResult4
  >,
  middleware5: Middleware<
    TIntermediateEvent4,
    TIntermediateContext4,
    TIntermediateResult4,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): MiddlewareStack<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>

/* six functions */
export function compose<
  TEvent,
  TContext,
  TResult,
  TIntermediateEvent1,
  TIntermediateContext1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateContext2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateContext3,
  TIntermediateResult3,
  TIntermediateEvent4,
  TIntermediateContext4,
  TIntermediateResult4,
  TIntermediateEvent5,
  TIntermediateContext5,
  TIntermediateResult5,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TContext,
    TResult,
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3,
    TIntermediateEvent4,
    TIntermediateContext4,
    TIntermediateResult4
  >,
  middleware5: Middleware<
    TIntermediateEvent4,
    TIntermediateContext4,
    TIntermediateResult4,
    TIntermediateEvent5,
    TIntermediateContext5,
    TIntermediateResult5
  >,
  middleware6: Middleware<
    TIntermediateEvent5,
    TIntermediateContext5,
    TIntermediateResult5,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): MiddlewareStack<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>

/* seven functions */
export function compose<
  TEvent,
  TContext,
  TResult,
  TIntermediateEvent1,
  TIntermediateContext1,
  TIntermediateResult1,
  TIntermediateEvent2,
  TIntermediateContext2,
  TIntermediateResult2,
  TIntermediateEvent3,
  TIntermediateContext3,
  TIntermediateResult3,
  TIntermediateEvent4,
  TIntermediateContext4,
  TIntermediateResult4,
  TIntermediateEvent5,
  TIntermediateContext5,
  TIntermediateResult5,
  TIntermediateEvent6,
  TIntermediateContext6,
  TIntermediateResult6,
  TNextEvent,
  TNextContext,
  TNextResult
>(
  middleware1: Middleware<
    TEvent,
    TContext,
    TResult,
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1
  >,
  middleware2: Middleware<
    TIntermediateEvent1,
    TIntermediateContext1,
    TIntermediateResult1,
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2
  >,
  middleware3: Middleware<
    TIntermediateEvent2,
    TIntermediateContext2,
    TIntermediateResult2,
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3
  >,
  middleware4: Middleware<
    TIntermediateEvent3,
    TIntermediateContext3,
    TIntermediateResult3,
    TIntermediateEvent4,
    TIntermediateContext4,
    TIntermediateResult4
  >,
  middleware5: Middleware<
    TIntermediateEvent4,
    TIntermediateContext4,
    TIntermediateResult4,
    TIntermediateEvent5,
    TIntermediateContext5,
    TIntermediateResult5
  >,
  middleware6: Middleware<
    TIntermediateEvent5,
    TIntermediateContext5,
    TIntermediateResult5,
    TIntermediateEvent6,
    TIntermediateContext6,
    TIntermediateResult6
  >,
  middleware7: Middleware<
    TIntermediateEvent6,
    TIntermediateContext6,
    TIntermediateResult6,
    TNextEvent,
    TNextContext,
    TNextResult
  >,
): MiddlewareStack<
  TEvent,
  TContext,
  TResult,
  TNextEvent,
  TNextContext,
  TNextResult
>

/* rest */
export function compose<TEvent, TContext, TResult>(
  middleware1: Middleware<TEvent, TContext, TResult, any, any, any>,
  ...restMiddlewares: Middleware<any, any, any>[]
): Middleware<TEvent, TContext, TResult, any, any>

export function compose<TEvent, TContext, TResult>(
  ...middlewares: Middleware<any, any, any>[]
): Middleware<TEvent, TResult, any, any>

export function compose<TEvent, TContext, TResult>(
  ...middlewares: Middleware<any, any, any>[]
): MiddlewareStack<TEvent, TResult, any, any> {
  return middlewares.reduce(
    (a: Middleware<TEvent, TContext, TResult>, b) => next => a(b(next)),
    (next: Handler<TEvent, TContext, TResult>) => next,
  )
}
