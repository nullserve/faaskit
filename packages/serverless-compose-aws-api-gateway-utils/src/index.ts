import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {mappingMiddleware, Middleware, Context} from 'serverless-compose'

import {toHeaderCase, remapKeys} from './utils'

export {
  HttpError,
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  ProxyAuthenticationRequired,
  RequestTimeout,
  Conflict,
  Gone,
  LengthRequired,
  PreconditionFailed,
  RequestEntityTooLarge,
  RequestURITooLong,
  UnsupportedMediaType,
  RequestedRangeNotSatisfiable,
  ExpectationFailed,
  ImATeapot,
  EnhanceYourCalm,
  UnprocessableEntity,
  UpgradeRequired,
  PreconditionRequired,
  TooManyRequests,
  RequestHeaderFieldsTooLarge,
  UnavailableForLegalReasons,
  InternalServerError,
  NotImplemented,
  BadGateway,
  ServiceUnavailable,
  GatewayTimeout,
} from './http-errors'

export const HeaderNormalizingMiddleware: Middleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = mappingMiddleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>(
  async (event, context) => {
    return {
      event: {
        ...event,
        headers: remapKeys(event.headers, key => key.toLowerCase()),
        multiValueHeaders: remapKeys(event.multiValueHeaders, key =>
          key.toLowerCase(),
        ),
      },
      context,
    }
  },
  async result => {
    return {
      ...result,
      headers: result.headers
        ? remapKeys(result.headers, key => toHeaderCase(key))
        : {},
      multiValueHeaders: result.multiValueHeaders
        ? remapKeys(result.multiValueHeaders, key => toHeaderCase(key))
        : {},
    }
  },
)
