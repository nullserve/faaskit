import {createHook, executionAsyncId} from 'async_hooks'

export interface Context<T> {
  provide: (value: T) => void
  consume: () => T
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

  function provide<T>(value: T) {
    context.set(executionAsyncId(), value)
  }

  function consume<T>(): T {
    return context.get(executionAsyncId())
  }
  return {provide, consume}
}
