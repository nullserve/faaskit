export type Handler<TEvent, TResult> = (event: TEvent) => Promise<TResult>

export type Middleware<
  TEvent,
  TResult,
  TNextEvent = TEvent,
  TNextResult = TResult
> = (next: Handler<TNextEvent, TNextResult>) => Handler<TEvent, TResult>

export type MiddlewareStack<
  TEvent,
  TResult,
  TNextEvent = TEvent,
  TNextResult = TResult
> = Middleware<TEvent, TResult, TNextEvent, TNextResult>
