import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {mappingMiddleware, Middleware, Context} from '@faaskit/core'
import {toHeaderCase, remapKeys} from './utils'
import {NotAcceptable} from './http-errors'

export const APIGatewayProxyLogMiddleware: Middleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = next => {
  return async (event, context) => {
    const t0 = new Date()
    try {
      const response = await next(event, context)
      const t1 = new Date()

      return response
    } catch (e) {
      const t1 = new Date()
      throw e
    }
  }
}

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

function negotiateAccept(
  contentTypes: string[],
  header: string | null,
  multiValueHeader: string[],
): string | null {
  const acceptHeaders = [header, ...multiValueHeader]
  acceptHeaders.forEach(header => {
    let maybeAcceptedType = contentTypes.find(
      contentType => contentType === header,
    )
    if (maybeAcceptedType) {
      return maybeAcceptedType
    }
  })
  return null
}

// Options to override JSON Response middleware. It still responds with JSON,
// but you can change the content-type for vendor specific content types and
// set a strict accept that forces a client to use the 'accept' header for your content type
export interface JSONResponseMiddlewareOptions {
  // content types that can be returned in the order of preference
  contentTypes?: string[]
  // setting strictAccept to true means the client MUST provide an accept header containing the contentType
  strictAccept?: boolean
}

export function createJSONResponseMiddleware(
  options?: JSONResponseMiddlewareOptions,
): Middleware<APIGatewayProxyEvent, APIGatewayProxyResult, Context> {
  return next => async (event, context) => {
    const contentTypes =
      options && options.contentTypes
        ? options.contentTypes
        : ['application/json']
    const acceptedContentType = negotiateAccept(
      contentTypes,
      event.headers.accept ? event.headers.accept : null,
      event.multiValueHeaders.accept ? event.multiValueHeaders.accept : [],
    )
    if (options && options.strictAccept && acceptedContentType === null) {
      throw new NotAcceptable(
        `none of the content-types: ${contentTypes} are acceptable and strictAccept is set in JSONResponseMiddleware`,
        {
          fields: {
            'header:accept': `content-types: ${contentTypes} are not acceptable`,
          },
        },
      )
    }
    const result = await next(event, context)
    return {
      statusCode: 200,
      ...result,
      body: JSON.stringify(result.body),
      headers: {
        ...Headers,
        'content-type': acceptedContentType
          ? acceptedContentType
          : 'application/json',
      },
    }
  }
}

export const DefaultJSONResponseMiddleware = createJSONResponseMiddleware()
