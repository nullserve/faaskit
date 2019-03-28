import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {mappingMiddleware, Middleware, Context} from 'serverless-compose'

import {toHeaderCase, remapKeys} from './utils'
import {NotAcceptable} from './http-errors'

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

function isAcceptable(
  contentType: string,
  header: string,
  multiValueHeader: string[],
): boolean {
  return false
}

function x(a: {
  contentType: string
  strictAccept: boolean
}): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> {
  return next => async (event, context) => {
    if (
      a.strictAccept &&
      !isAcceptable(
        a.contentType,
        event.headers.accept,
        event.multiValueHeaders.accept,
      )
    ) {
      throw new NotAcceptable('')
    }
    const result = await next(event, context)
    return {
      statusCode: 200,
      ...result,
      body: JSON.stringify(result.body),
      headers: {...Headers, 'content-type': a.contentType},
    }
  }
}
