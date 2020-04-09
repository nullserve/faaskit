import {HttpError, ErrorDetails} from './error'

// 500
export class InternalServerError extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'InternalServerError', 500, details)
  }
}

// 501
export class NotImplemented extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NotImplemented', 501, details)
  }
}

// 502
export class BadGateway extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'BadGateway', 502, details)
  }
}

// 503
export class ServiceUnavailable extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ServiceUnavailable', 503, details)
  }
}

// 504
export class GatewayTimeout extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'GatewayTimeout', 504, details)
  }
}

// 505
export class HTTPVersionNotSupported extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'HTTPVersionNotSupported', 505, details)
  }
}
