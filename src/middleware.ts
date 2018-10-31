import { Handler, Middleware } from './'

export type Mapper<TFrom, TTo> = (input: TFrom) => Promise<TTo>
export type TimingLogger = (number) => void
export type Validator<T> = (T) => Promise<void>

export type TimingLogMiddleware = (logger: TimingLogger) => Middleware
export const TimingLogMiddleware: TimingLogMiddleware = logger => next => async (
  event,
  context,
) => {
  const start = Date.now()
  await next(event, context)
  const end = Date.now()
  const duration = end - start
  logger(duration)
}

export type ValidationMiddleware<T = any> = (
  validator: Validator<T>,
) => Middleware<T, T>
export const ValidationMiddleware: ValidationMiddleware = validator => next => {
  return async (event, context) => {
    await validator(event)
    await next(event, context)
  }
}

export type MappingMiddleware<TFrom = any, TTo = any> = (
  mapper: Mapper<TFrom, TTo>,
) => Middleware<TFrom, TTo>
export const ResponseMappingMiddleware: MappingMiddleware = mapper => next => async (
  event,
  context,
) => {
  const response = await next(event, context)
  return mapper(response)
}

export const RequestMappingMiddleware: MappingMiddleware = mapper => next => async (
  event,
  context,
) => {
  const mappedRequest = await mapper(event)
  return
}
