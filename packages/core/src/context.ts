export function combineContext<TInitialContext, TAdditionalContext>(
  initialContext: TInitialContext,
  additionalContext: TAdditionalContext,
): TInitialContext & TAdditionalContext {
  return {
    ...initialContext,
    ...additionalContext,
  }
}
