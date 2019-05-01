import {ExtendedElasticCommonSchema} from './ecs'

export interface Logger {
  emerg(...params: any[]): void
  alert(...params: any[]): void
  crit(...params: any[]): void
  error(...params: any[]): void
  warning(...params: any[]): void
  notice(...params: any[]): void
  log(...params: any[]): void
  info(...params: any[]): void
  debug(...params: any[]): void

  withContext<T>(
    context: ExtendedElasticCommonSchema,
    closure: (logger: Logger) => Promise<T>,
  ): Promise<T>
}

export type LoggerContextMixin = {
  logger: Logger
}

export {ExtendedElasticCommonSchema} from './ecs'
