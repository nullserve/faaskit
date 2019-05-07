import {Middleware} from 'serverless-compose'
import {
  Logger,
  LoggerContextMixin,
  ExtendedElasticCommonSchema,
} from 'serverless-compose-logger'
import winston from 'winston'

const ecsFormat = winston.format((info, opts) => {
  return info
})

class WinstonLogger implements Logger {
  winstonLogger: winston.Logger

  constructor(winstonLogger?: winston.Logger) {
    if (winstonLogger != undefined) {
      this.winstonLogger = winstonLogger
    } else {
      this.winstonLogger = winston.createLogger({
        level: 'info',
        levels: winston.config.syslog.levels,
        transports: new winston.transports.Console({handleExceptions: true}),
        format: winston.format.combine(ecsFormat()),
      })
    }
  }

  emerg = this.winstonLogger.emerg
  alert = this.winstonLogger.alert
  crit = this.winstonLogger.crit
  error = this.winstonLogger.error
  warning = this.winstonLogger.warning
  notice = this.winstonLogger.notice
  info = this.winstonLogger.info
  log = this.winstonLogger.log
  debug = this.winstonLogger.debug

  withContext<T>(
    context: ExtendedElasticCommonSchema,
    closure: (logger: Logger) => Promise<T>,
  ) {
    const childLogger = this.winstonLogger.child(context)
    return closure(new WinstonLogger(childLogger))
  }
}

export const WinstonLoggerMiddleware: Middleware<any, any> = next => {
  const logger = new WinstonLogger()
  const loggerContextMixin: LoggerContextMixin = {
    logger,
  }
  return async (event, context) =>
    next(event, {...context, ...loggerContextMixin})
}
