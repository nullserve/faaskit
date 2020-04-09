import {Context as FunctionsContext, AzureFunction} from '@azure/functions'
import {Handler as FaasKitHandler} from '@faaskit/core'

export interface AzureFunctionsContext {
  AzureFunction: FunctionsContext
}

export function adaptFaasKitHandlerForFunctions<TEvent, TResult>(
  handler: FaasKitHandler<TEvent, AzureFunctionsContext, TResult>,
): AzureFunction {
  return async (context, event) => handler(event, {AzureFunction: context})
}

export function adaptFunctionsHandlerForFaasKit<
  TEvent,
  TContext extends AzureFunctionsContext,
  TResult
>(handler: AzureFunction): FaasKitHandler<TEvent, TContext, TResult> {
  return async (event, context) => {
    return handler(context.AzureFunction, event)
  }
}
