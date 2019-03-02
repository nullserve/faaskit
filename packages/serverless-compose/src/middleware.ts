import { Context as LambdaContext } from 'aws-lambda'

// Because Compose can create synthetic handler environments,
// the context typing is loosened to allow for users to add their own
export type Context = LambdaContext & Object

export type Handler<TEvent = any, TResult = any, TContext = Context> = (
  event: TEvent,
  context: TContext,
) => Promise<TResult>

export type Middleware<
  TEvent,
  TResult,
  TContext = Context,
  TNextEvent = any,
  TNextResult = any,
  TNextContext = Context
> = (
  next: Handler<TNextEvent, TNextResult, TNextContext>,
) => Handler<TEvent, TResult, TContext>

export type LogFunctionContext<TEvent, TResult> = {
  event: TEvent
  result: TResult
}

export function timingLogMiddleware<TEvent, TResult>(
  logFn: (
    duration: number,
    context?: LogFunctionContext<TEvent, TResult>,
  ) => Promise<void>,
): Middleware<TEvent, TResult> {
  return next => async (event, context) => {
    const start = Date.now()
    const result = await next(event, context)
    const end = Date.now()
    const duration = end - start
    await logFn(duration, { event, result })
    return result
  }
}

export function validationMiddleware<TEvent, TResult>(
  validateFn: (event: TEvent) => Promise<void>,
): Middleware<TEvent, TResult> {
  return next => async (event, context) => {
    await validateFn(event)
    return await next(event, context)
  }
}

export function responseMappingMiddleware<TFrom, TTo>(
  mapFn: (result: TFrom) => Promise<TTo>,
): Middleware<any, TTo, Context, TFrom, any, Context> {
  return mappingMiddleware(
    async (event, context) => ({ event, context }),
    async result => mapFn(result),
  )
}

export function requestMappingMiddleware<TFrom, TTo>(
  mapFn: (event: TFrom) => Promise<TTo>,
): Middleware<TFrom, any, Context, TTo, any, Context> {
  return mappingMiddleware(
    async (event, context) => {
      const mappedEvent = await mapFn(event)
      return {
        event: mappedEvent,
        context: context,
      }
    },
    async result => result,
  )
}

export type MappedEventContext<TEvent, TContext = Context> = {
  event: TEvent
  context: TContext
}

export function mappingMiddleware<
  TEventFrom,
  TResultFrom,
  TEventTo,
  TResultTo,
  TContextFrom = Context,
  TContextTo = Context
>(
  preMapFn: (
    event: TEventFrom,
    context: TContextFrom,
  ) => Promise<MappedEventContext<TEventTo, TContextTo>>,
  postMapFn: (result: TResultFrom, context: TContextTo) => Promise<TResultTo>,
): Middleware<
  TEventFrom,
  TResultTo,
  TContextFrom,
  TEventTo,
  TResultFrom,
  TContextTo
> {
  return next => async (event, context) => {
    let mappedEvent = await preMapFn(event, context)
    let result = await next(mappedEvent.event, mappedEvent.context)
    let mappedResult = await postMapFn(result, mappedEvent.context)
    return mappedResult
  }
}

export function recoveryMiddleware<TEvent, TResult>(
  recoveryFn: (error: any, event: TEvent, context: Context) => Promise<TResult>,
): Middleware<TEvent, TResult> {
  return next => async (event, context) => {
    let response
    try {
      response = await next(event, context)
    } catch (error) {
      response = await recoveryFn(error, event, context)
    }
    return response
  }
}
