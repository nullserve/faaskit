import Ajv, {Options as AjvOptions} from 'ajv'
import type {FromSchema} from 'json-schema-to-ts'

import {createEffectMiddleware, Middleware} from '@faaskit/core'

export type ValidatedObject<T> = FromSchema<T>

export interface CreateAjvEventValidatingMiddlewareParams {
  schema: object
  options?: AjvOptions
}
export function createAjvEventValidatingMiddleware<TEvent, TContext, TResult>({
  schema,
  options,
}: CreateAjvEventValidatingMiddlewareParams): Middleware<
  TEvent,
  TContext,
  TResult,
  ValidatedObject<typeof schema>
> {
  const ajv = new Ajv(options)
  const validate = ajv.compile(schema)
  return createEffectMiddleware({
    pre: ({event}) => {
      const isValid = validate(event)
      return new Promise((resolve, reject) => {
        isValid ? resolve() : reject()
      })
    },
  })
}

export interface CreateAjvResultValidatingMiddlewareParams {
  schema: object
  options?: AjvOptions
}
export function createAjvResultValidatingMiddleware<TEvent, TContext, TResult>({
  schema,
  options,
}: CreateAjvResultValidatingMiddlewareParams): Middleware<
  TEvent,
  TContext,
  ValidatedObject<typeof schema>,
  TEvent,
  TContext,
  TResult
> {
  const ajv = new Ajv(options)
  const validate = ajv.compile(schema)
  return createEffectMiddleware({
    post: ({result}) => {
      const isValid = validate(result)
      return new Promise((resolve, reject) => {
        isValid ? resolve() : reject()
      })
    },
  })
}
