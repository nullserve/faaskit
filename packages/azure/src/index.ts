import { AzureFunction, Context } from "@azure/functions";
import { Handler } from "./node_modules/@nullserve/faaskit-core";

export function convertHandler<TEvent, TResult>(
  next: Handler<TEvent, TResult>
): AzureFunction {
  const handler: AzureFunction = async (
    context: Context,
    request: TEvent
  ): Promise<TResult> => {
    return next(request);
  };
  return handler;
}
