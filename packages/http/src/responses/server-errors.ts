import {HttpError, ErrorDetails} from './error'

export class InternalServerError extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'InternalServerError', 500, details)
  }
}

export class NotImplemented extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NotImplemented', 501, details)
  }
}

export class BadGateway extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'BadGateway', 502, details)
  }
}

export class ServiceUnavailable extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ServiceUnavailable', 503, details)
  }
}

export class GatewayTimeout extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'GatewayTimeout', 504, details)
  }
}

export class HTTPVersionNotSupported extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'HTTPVersionNotSupported', 505, details)
  }
}
