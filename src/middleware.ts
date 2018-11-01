import { Handler, Middleware } from './'

export type MapperFn<TFrom, TTo> = (input: TFrom) => Promise<TTo>
export type TimingLogFn = (duration: number) => void
export type ValidateFn<T> = (...params: any) => Promise<void>

export type TimingLogMiddleware<TEvent = any, TResult = any> = (
  logFn: TimingLogFn,
) => Middleware<TEvent, TResult>

export const TimingLogMiddleware: TimingLogMiddleware = logFn => next => async (
  event,
  context,
) => {
  const start = Date.now()
  const result = await next(event, context)
  const end = Date.now()
  const duration = end - start
  logFn(duration)
  return result
}

export type ValidationMiddleware<T = any> = (
  validateFn: ValidateFn<T>,
) => Middleware<T, T>

export const ValidationMiddleware: ValidationMiddleware = validateFn => next => {
  return async (event, context) => {
    await validateFn(event)
    await next(event, context)
  }
}

export type MappingMiddleware<TFrom = any, TTo = any> = (
  mapFn: MapperFn<TFrom, TTo>,
) => Middleware<TFrom, TTo>

export const ResponseMappingMiddleware: MappingMiddleware = mapFn => next => async (
  event,
  context,
) => {
  const response = await next(event, context)
  return mapFn(response)
}

export const RequestMappingMiddleware: MappingMiddleware = mapFn => next => async (
  event,
  context,
) => {
  const mappedRequest = await mapFn(event)
  return next(mappedRequest, context)
}
