import {Middleware} from './types'

/**
 * An interface for the parameter of a post effect function as defined in
 * the interface
 * {@link CreateEffectMiddlewareParams | CreateEffectMiddlewareParams}
 *
 * @member event - the event that was passed to the effect middleware
 * @member context - the context that was passed to the effect middleware
 * @member result - the result of the handler called after the effect
 * middleware
 */
export interface PostEffectFnParams<TEvent, TContext, TResult> {
  event: TEvent
  context: TContext
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
 * `PostEffectFnParams<TEvent, TContext, TResult>` {@link PostEffectFnParams}
 * as its lone parameter and Promises it does something as a side effect with
 * no return after the next handler in the middleware chain has been called
 * but before this middleware has returned.
 */
export interface CreateEffectMiddlewareParams<TEvent, TContext, TResult> {
  pre?: (event: TEvent, context: TContext) => Promise<void>
  post?: (
    params: PostEffectFnParams<TEvent, TContext, TResult>,
  ) => Promise<void>
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
export function createEffectMiddleware<TEvent, TContext, TResult>({
  pre = async () => {},
  post = async () => {},
}: CreateEffectMiddlewareParams<TEvent, TContext, TResult>): Middleware<
  TEvent,
  TContext,
  TResult
> {
  return next => async (event, context) => {
    await pre(event, context)
    const result = await next(event, context)
    await post({event, context, result})
    return result
  }
}

/**
 *
 */
export interface PreMappingFnResult<TEvent, TContext> {
  event: TEvent
  context: TContext
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
export interface PostMappingFnParams<
  TEventFrom,
  TContextFrom,
  TResultFrom,
  TEventTo,
  TContextTo
> {
  event: TEventFrom
  mappedEvent: TEventTo
  context: TContextFrom
  mappedContext: TContextTo
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
  TContextFrom,
  TResultFrom,
  TEventTo,
  TContextTo,
  TResultTo
> {
  pre?: (
    event: TEventFrom,
    context: TContextFrom,
  ) => Promise<PreMappingFnResult<TEventTo, TContextTo>>
  post?: (
    params: PostMappingFnParams<
      TEventFrom,
      TContextFrom,
      TResultFrom,
      TEventTo,
      TContextTo
    >,
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
  TContextFrom,
  TResultFrom,
  TEventTo,
  TContextTo,
  TResultTo
>({
  pre = async (event, context) => ({
    event: (event as unknown) as TEventTo,
    context: (context as unknown) as TContextTo,
  }),
  post = async ({result}) => (result as unknown) as TResultTo,
}: CreateMappingMiddlewareParams<
  TEventFrom,
  TContextFrom,
  TResultFrom,
  TEventTo,
  TContextTo,
  TResultTo
>): Middleware<
  TEventFrom,
  TContextFrom,
  TResultTo,
  TEventTo,
  TContextTo,
  TResultFrom
> {
  return next => async (event, context) => {
    const {event: mappedEvent, context: mappedContext} = await pre(
      event,
      context,
    )
    const result = await next(mappedEvent, mappedContext)
    const mappedResult = await post({
      event,
      mappedEvent,
      context,
      mappedContext,
      result,
    })
    return mappedResult
  }
}

export async function preMapIdentity<TEvent, TContext>(
  event: TEvent,
  context: TContext,
): Promise<PreMappingFnResult<TEvent, TContext>> {
  return {event, context}
}

export async function postMapIdentity<TResult>({
  result,
}: PostMappingFnParams<any, any, TResult, any, any>): Promise<TResult> {
  return result
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
export function createRecoveryMiddleware<TEvent, TContext, TResult>(
  recoveryFn: (
    error: any,
    event: TEvent,
    context: TContext,
  ) => Promise<TResult>,
): Middleware<TEvent, TContext, TResult> {
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
