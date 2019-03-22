export class HttpError extends Error {
  statusCode: number
}

// 400
export class BadRequest extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'BadRequest'
    this.statusCode = 400
  }
}

// 401
export class Unauthorized extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'Unauthorized'
    this.statusCode = 401
  }
}

// 402
export class PaymentRequired extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'PaymentRequired'
    this.statusCode = 402
  }
}

// 403
export class Forbidden extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'Forbidden'
    this.statusCode = 403
  }
}

// 404
export class NotFound extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'NotFound'
    this.statusCode = 404
  }
}

// 405
export class MethodNotAllowed extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'MethodNotAllowed'
    this.statusCode = 405
  }
}

// 406
export class NotAcceptable extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'NotAcceptable'
    this.statusCode = 406
  }
}

// 407
export class ProxyAuthenticationRequired extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'ProxyAuthenticationRequired'
    this.statusCode = 407
  }
}

// 408
export class RequestTimeout extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'RequestTimeout'
    this.statusCode = 408
  }
}

// 409
export class Conflict extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'Conflict'
    this.statusCode = 409
  }
}

// 410
export class Gone extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'Gone'
    this.statusCode = 410
  }
}

// 411
export class LengthRequired extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'LengthRequired'
    this.statusCode = 411
  }
}

// 412
export class PreconditionFailed extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'PreconditionFailed'
    this.statusCode = 412
  }
}

// 413
export class RequestEntityTooLarge extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'RequestEntityTooLarge'
    this.statusCode = 413
  }
}

// 414
export class RequestURITooLong extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'RequestURITooLong'
    this.statusCode = 414
  }
}

// 415
export class UnsupportedMediaType extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'UnsupportedMediaType'
    this.statusCode = 415
  }
}

// 416
export class RequestedRangeNotSatisfiable extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'BadRequest'
    this.statusCode = 416
  }
}

// 417
export class ExpectationFailed extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'ExpectationFailed'
    this.statusCode = 417
  }
}

// 418
export class ImATeapot extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'ImATeapot'
    this.statusCode = 418
  }
}

// 420
export class EnhanceYourCalm extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'EnhanceYourCalm'
    this.statusCode = 420
  }
}

// 422
export class UnprocessableEntity extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'UnprocessableEntity'
    this.statusCode = 422
  }
}

// 426
export class UpgradeRequired extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'UpgradeRequired'
    this.statusCode = 426
  }
}

// 428
export class PreconditionRequired extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'PreconditionRequired'
    this.statusCode = 428
  }
}

// 429
export class TooManyRequests extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'TooManyRequests'
    this.statusCode = 429
  }
}

// 431
export class RequestHeaderFieldsTooLarge extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'RequestHeaderFieldsTooLarge'
    this.statusCode = 431
  }
}

// 451
export class UnavailableForLegalReasons extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'UnavailableForLegalReasons'
    this.statusCode = 451
  }
}

// 500
export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'InternalServerError'
    this.statusCode = 500
  }
}

// 501
export class NotImplemented extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'NotImplemented'
    this.statusCode = 501
  }
}

// 502
export class BadGateway extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'BadGateway'
    this.statusCode = 502
  }
}

// 503
export class ServiceUnavailable extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'ServiceUnavailable'
    this.statusCode = 503
  }
}

// 504
export class GatewayTimeout extends HttpError {
  constructor(message: string) {
    super(message)
    this.name = 'GatewayTimeout'
    this.statusCode = 504
  }
}
