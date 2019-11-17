import {Middleware} from './types'

export interface PostEffectFnParams<TEvent, TResult> {
  event: TEvent
  result: TResult
}
export interface CreateEffectMiddlewareParams<TEvent, TResult> {
  pre?: (event: TEvent) => Promise<void>
  post?: (params: PostEffectFnParams<TEvent, TResult>) => Promise<void>
}
export function createEffectMiddleware<TEvent, TResult>({
  pre = async () => {},
  post = async () => {},
}: CreateEffectMiddlewareParams<TEvent, TResult>): Middleware<TEvent, TResult> {
  return next => async event => {
    await pre(event)
    const result = await next(event)
    await post({event, result})
    return result
  }
}

export interface PostMappingFnParams<TEventFrom, TResultFrom, TEventTo> {
  event: TEventFrom
  mappedEvent: TEventTo
  result: TResultFrom
}
export interface CreateMappingMiddlewareParams<
  TEventFrom,
  TResultFrom,
  TEventTo,
  TResultTo
> {
  pre: (event: TEventFrom) => Promise<TEventTo>
  post: (
    params: PostMappingFnParams<TEventFrom, TResultFrom, TEventTo>,
  ) => Promise<TResultTo>
}
export function createMappingMiddleware<
  TEventFrom,
  TResultFrom,
  TEventTo,
  TResultTo
>({
  pre,
  post,
}: CreateMappingMiddlewareParams<
  TEventFrom,
  TResultFrom,
  TEventTo,
  TResultTo
>): Middleware<TEventFrom, TResultTo, TEventTo, TResultFrom> {
  return next => async event => {
    const mappedEvent = await pre(event)
    const result = await next(mappedEvent)
    const mappedResult = await post({event, mappedEvent, result})
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

export interface PreStateFnParams<TEvent, TState> {
  event: TEvent
  initialState?: TState
}
export interface PostStateFnParams<TEvent, TResult, TState> {
  event: TEvent
  result: TResult
  initialState?: TState
  state: TState
}
export interface CreateStateMiddlewareParams<TEvent, TResult, TState> {
  initialState?: TState | null
  pre: (params: PreStateFnParams<TEvent, TState>) => Promise<TState>
  post?: (params: PostStateFnParams<TEvent, TResult, TState>) => Promise<void>
}
export function createStateMiddleware<TEvent, TResult, TState = any>({
  initialState = null,
  pre,
  post = async () => {},
}: CreateStateMiddlewareParams<TEvent, TResult, TState>): Middleware<
  TEvent,
  TResult
> {
  return next => async event => {
    const state = await pre({event, initialState})
    const result = await next(event)
    await post({event, result, initialState, state})
    return result
  }
}
