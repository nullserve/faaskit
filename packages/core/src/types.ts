/**
 * A Handler is a function which response transactionally (by `Promise`) to some event.
 * This is the base building block for FaaS -- All invoked functions must be `Handler`s.
 *
 * @typeParam TEvent - the event type passed as an input to the handler function
 * @typeParam TResult - the result type promised to be returned by the handler function
 * @param event - the event for the handler function
 * @returns a `Promise<TResult>` which reflects the success of the handler transaction
 */
export type Handler<TEvent, TResult> = (event: TEvent) => Promise<TResult>

/**
 * A Middleware is a function which wraps a handler for the purpose of extracting shared functionality from any number of handlers.
 * The purpose of extracting functionality is to improve code reuse and attempt to keep `Handler`s focused on business logic.
 * A Middleware "wraps" a `Handler` by taking the `Handler` as a parameter and returning a new `Handler` with its logic surrounding the internal Handler logic.
 * This function typing is designed to be "chained", so that individual shared functionalities can be performed in whatever order desired so long as their types match.
 *
 * @typeParam TEvent - the event type to be passed as an input to the **resulting** handler function returned by the middleware
 * @typeParam TResult - the result type to be promised returned by the **resulting** handler function returned by the middleware
 * @typeParam TNextEvent = `TEvent` - the event type expected by the `Handler` **to be wrapped** by the middleware.
 * This defaults to TEvent for the case that the middleware logic does not change the event type
 * @typeParam TNextResult = `TResult` - the result type promised to be returned by the `Handler` **to be wrapped** by the middleware.
 * This defaults to TResult for the case that the middleware logic does not change the result type.
 * @param next - the `Handler` to be wrapped by the middleware.
 * The name `next` stems from an "onion style middleware" design, where middleware are thought of as a chain where the outer middleware invokes the inner middleware "next" in the chain.
 * @returns a `Handler<TEvent, TResult>` which is the new handler, created by wrapping the `next` parameter with some functionality.
 */
export type Middleware<
  TEvent,
  TResult,
  TNextEvent = TEvent,
  TNextResult = TResult
> = (next: Handler<TNextEvent, TNextResult>) => Handler<TEvent, TResult>

/**
 * A type alias for {@link Middleware | Middleware}
 * See the documentation there for type parameter definitions and parameter definitions
 */
export type MiddlewareStack<
  TEvent,
  TResult,
  TNextEvent = TEvent,
  TNextResult = TResult
> = Middleware<TEvent, TResult, TNextEvent, TNextResult>
