import { Context } from 'aws-lambda'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
) => Promise<TResult>

export type Middleware<TEvent, TResult, TNextEvent = any, TNextResult = any> = (
  next: Handler<TNextEvent, TNextResult>,
) => Handler<TEvent, TResult>

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
  mapFn: (input: TFrom) => Promise<TTo>,
): Middleware<TFrom, TTo> {
  return next => async (event, context) => {
    const response = await next(event, context)
    return mapFn(response)
  }
}

export function requestMappingMiddleware<TFrom, TTo>(
  mapFn: (input: TFrom) => Promise<TTo>,
): Middleware<TFrom, TTo> {
  return next => async (event, context) => {
    const mappedRequest = await mapFn(event)
    return next(mappedRequest, context)
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
