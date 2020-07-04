export function combineContext<
  TInitialContext extends Object,
  TAdditionalContext extends Object
>(
  initialContext: TInitialContext,
  additionalContext: TAdditionalContext,
): TInitialContext & TAdditionalContext {
  return {
    ...initialContext,
    ...additionalContext,
  }
}
