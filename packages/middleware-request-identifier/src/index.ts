import {
  requestMappingMiddleware,
  responseMappingMiddleware,
  Middleware,
  Handler,
} from 'serverless-compose'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import uuidv4 from 'uuid/v4'

// A Mixin for Lambda Context.
// Using Typescript Intersection types you can define a handler context as `Context & RequestIdentifierContextMixin`
type RequestIdentifierContextMixin = {
  requestIdentity: RequestIdentifierContext
}

type RequestIdentifierContext = {
  correlationId: string
  parentId?: string
  requestId: string
  sessionId: string
  spanId: string
  traceId: string
}

const byteToHex: string[] = []
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1)
}

function bytesToUuid(bytes: Array<number>): string {
  const hex = bytesToHexString(bytes)
  return [
    hex.slice(0, 8),
    '-',
    hex.slice(8, 12),
    '-',
    hex.slice(12, 16),
    '-',
    hex.slice(16, 24),
    '-',
    hex.slice(24, 36),
  ].join('')
}

function bytesToHexString(bytes: Array<number>): string {
  return bytes.map(byte => byteToHex[byte]).join('')
}

function convertMaybeUuidToHexString(uuid: string): string | void {
  // FIXME: handle case where it's not a UUID
  return uuid.replace('-', '')
}

function convertMaybeHexStringToUuid(hexString: string): string | void {
  // FIXME: handle case where its not a Hex string suitable for a UUID
  return [
    hexString.slice(0, 8),
    '-',
    hexString.slice(8, 12),
    '-',
    hexString.slice(12, 16),
    '-',
    hexString.slice(16, 24),
    '-',
    hexString.slice(24, 36),
  ].join('')
}

// I hate this name too. Sorry.
export const DefaultAPIGatewayProxyRequestIdentifyingMiddleware: Middleware<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = (next: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>) => async (
  event: APIGatewayProxyEvent,
  context: Context & Object,
) => {
  const trace = new Array<number>(16)
  uuidv4(null, trace)

  const span = new Array<number>(16)
  uuidv4(null, span)

  const correlationId: string | undefined =
    event.headers['correlation-id'] || event.headers['x-correlation-id']

  const parentId: string | undefined =
    event.headers['parent-id'] ||
    event.headers['x-parent-id'] ||
    event.headers['x-b3-parentspanid']

  const requestId: string | undefined =
    event.headers['request-id'] || event.headers['x-request-id']

  const sessionId: string | undefined =
    event.headers['session-id'] || event.headers['x-session-id']

  const spanId: string | undefined =
    event.headers['span-id'] ||
    event.headers['x-span-id'] ||
    event.headers['x-b3-spanid']

  const traceId: string | undefined =
    event.headers['trace-id'] ||
    event.headers['x-trace-id'] ||
    event.headers['x-b3-traceid']

  const requestIdentifierContext: RequestIdentifierContext = {
    correlationId:
      correlationId ||
      convertMaybeHexStringToUuid(traceId) ||
      bytesToUuid(trace),
    parentId,
    requestId:
      requestId ||
      correlationId ||
      convertMaybeHexStringToUuid(traceId) ||
      bytesToUuid(trace),
    sessionId:
      sessionId ||
      correlationId ||
      convertMaybeHexStringToUuid(traceId) ||
      bytesToUuid(trace),
    spanId: spanId || bytesToHexString(span.slice(0, 8)),
    traceId:
      traceId ||
      convertMaybeUuidToHexString(correlationId) ||
      bytesToHexString(trace),
  }
  return next(event, { ...context, ...requestIdentifierContext })
}
