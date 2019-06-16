export type Handler<TEvent, TResult> = (event: TEvent) => Promise<TResult>

export type Middleware<TEvent, TResult, TNextEvent = any, TNextResult = any> = (
  next: Handler<TNextEvent, TNextResult>,
) => Handler<TEvent, TResult>

export type MiddlewareStack<
  TEvent,
  TResult,
  TNextEvent = any,
  TNextResult = any
> = Middleware<TEvent, TResult, TNextEvent, TNextResult>
