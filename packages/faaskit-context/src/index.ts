import {createHook, executionAsyncId} from 'async_hooks'

export interface Context<T> {
  Provider: (value: T) => void
  Consumer: () => T
}

export function createContext<T>(defaultValue: T): Context<T> {
  const context = new Map()
  createHook({
    init: (id, _type, parentId) => {
      context.set(id, context.get(parentId))
    },
    destroy: id => {
      context.delete(id)
    },
  }).enable()
  context.set(executionAsyncId(), defaultValue)

  function Provider<T>(value: T) {
    context.set(executionAsyncId(), value)
  }

  function Consumer<T>(): T {
    return context.get(executionAsyncId())
  }
  return {Provider, Consumer}
}

export function useContext<T>(context: Context<T>): T {
  return context.Consumer()
}
