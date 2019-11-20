import {Middleware} from './types'

/**
 * An interface for the parameter of a post effect function as defined in
 * the interface
 * {@link CreateEffectMiddlewareParams | CreateEffectMiddlewareParams}
 *
 * @member event - the event that was passed to the effect middleware
 * @member result - the result of the handler called after the effect
 * middleware
 */
export interface PostEffectFnParams<TEvent, TResult> {
  event: TEvent
  result: TResult
}

/**
 * An interface for the lone parameter of the
 * {@link createEffectMiddleware | createEffectMiddleware} middleware helper
 * function.
 *
 * @member pre - An async lambda function which takes a `TEvent` as its lone
 * parameter and Promises it does something as a side effect with no return
 * before the next handler in the middleware chain is called.
 * @member post - An async lambda function which takes
 * `PostEffectFnParams<TEvent, TResult>` {@link PostEffectFnParams} as its
 * lone parameter and Promises it does something as a side effect with no
 * return after the next handler in the middleware chain has been called but
 * before this middleware has returned.
 */
export interface CreateEffectMiddlewareParams<TEvent, TResult> {
  pre?: (event: TEvent) => Promise<void>
  post?: (params: PostEffectFnParams<TEvent, TResult>) => Promise<void>
}

/**
 * A helper function for creating middlewares with side effects.
 * The helper takes pre and post functions to perform around the next handler
 * and can be used to perform side effects that do not change the
 * outcome of the next handler function.
 * @param params - parameters of type
 * `CreateEffectMiddlewareParams<TEvent, TResult>`
 * {@link CreateEffectMiddlewareParams} which define the pre and post handler
 * effects to perform. The members of params are not required and if they are
 * undefined, they each default to `async () => {}`
 */
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

/**
 * An interface for the parameter of a post mapping function as defined in
 * the interface
 * {@link CreateMappingMiddlewareParams | CreateMappingMiddlewareParams}
 *
 * @member event - the event that was passed to the mapping middleware
 * @member mappedEvent - the event after mapping
 * @member result - the result of the handler called after the mapping
 * middleware
 */
export interface PostMappingFnParams<TEventFrom, TResultFrom, TEventTo> {
  event: TEventFrom
  mappedEvent: TEventTo
  result: TResultFrom
}

/**
 * An interface for the lone parameter of the
 * {@link createMappingMiddleware | createMappingMiddleware} middleware helper
 * function.
 *
 * @member pre - An async lambda function which takes a `TEventFrom` as its lone
 * parameter and Promises to map that value into `TEventTo`
 * @member post - An async lambda function which takes
 * `PostMappingFnParams<TEventFrom, TResultFrom, TEventTo>` {@link PostMappingFnParams}
 * as its lone parameter and Promises to map the value into `TResultTo`
 */
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

/**
 * A helper function for creating middlewares that map input and output.
 * The helper takes pre and post functions to perform around the next handler
 * and can be used to perform mappings to and from the next handler.
 * @param params - parameters of type
 * `CreateMappingMiddlewareParams<TEventFrom, TResultFrom, TEventTo, TResultTo>`
 * {@link CreateMappingMiddlewareParams} which define the pre and post handler
 * mapping to perform. The members of params are required, but can be bypassed by
 * setting the from to the same type as the to and using `(from) => from` as a
 * mapping function.
 */
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

/**
 * A helper function for creating middlewares that recover from thrown errors.
 * The helper takes a recovery function which can also optionally re-throw.
 * If the recovery Promise resolves, the previous handler will receive its
 * output.
 * @param recoveryFn - The function which takes an error of any type and
 * Promises to resolve to `TResult`. It can throw again if it is unable to
 * handle the error.
 */
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

/**
 * An interface for the parameter of a pre state function as defined in
 * the interface
 * {@link CreateStateMiddlewareParams | CreateStateMiddlewareParams}
 *
 * @member event - the event that was passed to the state middleware
 * @member initialState - the state before it is set to be used by the
 * middleware
 */
export interface PreStateFnParams<TEvent, TState> {
  event: TEvent
  initialState?: TState
}

/**
 *
 */
export interface PostStateFnParams<TEvent, TResult, TState> {
  event: TEvent
  result: TResult
  initialState?: TState
  state: TState
}

/**
 * An interface for the lone parameter of the
 * {@link createStateMiddleware | createStateMiddleware} middleware helper
 * function.
 *
 * @member pre - An async lambda function which takes a `PreStateFnParams`
 * as its lone parameter and Promises an a state of type `TState`
 * @member post - An async lambda function which takes
 * `PostStateFnParams` {@link PostStateFnParams} as its lone parameter
 * and Promises to have some effect based on that state and result
 */
export interface CreateStateMiddlewareParams<TEvent, TResult, TState> {
  initialState?: TState | null
  pre: (params: PreStateFnParams<TEvent, TState>) => Promise<TState>
  post?: (params: PostStateFnParams<TEvent, TResult, TState>) => Promise<void>
}

/**
 * A helper function for creating middlewares that store and react to state.
 * The helper takes pre and post functions to perform around the next handler
 * and can be used to perform state storage and side effects.
 * @param params - parameters of type `CreateStateMiddlewareParams`
 * {@link CreateStateMiddlewareParams} which define the pre and post handler
 * state effects to perform. `pre` is required but `post` is not and defaults
 * to an empty promise that does nothing with the state.
 */
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
