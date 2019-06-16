import {Middleware} from './types'

export type LogFunctionContext<TEvent, TResult> = {
  event: TEvent
  result: TResult
}

export function createTimingLogMiddleware<TEvent, TResult>(
  logFn: (
    duration: number,
    context?: LogFunctionContext<TEvent, TResult>,
  ) => Promise<void>,
): Middleware<TEvent, TResult> {
  return next => async event => {
    const start = Date.now()
    const result = await next(event)
    const end = Date.now()
    const duration = end - start
    await logFn(duration, {event, result})
    return result
  }
}

// Alias this with another name
export const creatEffectMiddleware = createValidationMiddleware
export function createValidationMiddleware<TEvent, TResult>(
  validateFn: (event: TEvent) => Promise<void>,
): Middleware<TEvent, TResult> {
  return next => async event => {
    await validateFn(event)
    return await next(event)
  }
}

export function createResponseMappingMiddleware<TFrom, TTo>(
  mapFn: (result: TFrom) => Promise<TTo>,
): Middleware<any, TTo, TFrom, any> {
  return createMappingMiddleware(
    async event => event,
    async result => mapFn(result),
  )
}

export function createRequestMappingMiddleware<TFrom, TTo>(
  mapFn: (event: TFrom) => Promise<TTo>,
): Middleware<TFrom, any, TTo, any> {
  return createMappingMiddleware(
    async event => mapFn(event),
    async result => result,
  )
}

export function createMappingMiddleware<
  TEventFrom,
  TResultFrom,
  TEventTo,
  TResultTo
>(
  preMapFn: (event: TEventFrom) => Promise<TEventTo>,
  postMapFn: (result: TResultFrom) => Promise<TResultTo>,
): Middleware<TEventFrom, TResultTo, TEventTo, TResultFrom> {
  return next => async event => {
    let mappedEvent = await preMapFn(event)
    let result = await next(mappedEvent)
    let mappedResult = await postMapFn(result)
    return mappedResult
  }
}

export function createRecoveryMiddleware<TEvent, TResult>(
  recoveryFn: (error: any, event: TEvent) => Promise<TResult>,
): Middleware<TEvent, TResult> {
  return next => async event => {
    let response
    try {
      response = await next(event)
    } catch (error) {
      response = await recoveryFn(error, event)
    }
    return response
  }
}
