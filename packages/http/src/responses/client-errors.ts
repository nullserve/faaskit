import {HttpError, ErrorDetails} from './error'

export class BadRequest extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'BadRequest', 400, details)
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Unauthorized', 401, details)
  }
}

export class PaymentRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'PaymentRequired', 402, details)
  }
}

export class Forbidden extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Forbidden', 403, details)
  }
}

export class NotFound extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NotFound', 404, details)
  }
}

export class MethodNotAllowed extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'MethodNotAllowed', 405, details)
  }
}

export class NotAcceptable extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NotAcceptable', 406, details)
  }
}

export class ProxyAuthenticationRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ProxyAuthenticationRequired', 407, details)
  }
}

export class RequestTimeout extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestTimeout', 408, details)
  }
}

export class Conflict extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Conflict', 409, details)
  }
}

export class Gone extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'Gone', 410, details)
  }
}

export class LengthRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'LengthRequired', 411, details)
  }
}

export class PreconditionFailed extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'PreconditionFailed', 412, details)
  }
}

export class RequestEntityTooLarge extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestEntityTooLarge', 413, details)
  }
}

export class RequestURITooLong extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestURITooLong', 414, details)
  }
}

export class UnsupportedMediaType extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UnsupportedMediaType', 415, details)
  }
}

export class RequestedRangeNotSatisfiable extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'BadRequest', 416, details)
  }
}

export class ExpectationFailed extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ExpectationFailed', 417, details)
  }
}

export class ImATeapot extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'ImATeapot', 418, details)
  }
}

export class EnhanceYourCalm extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'EnhanceYourCalm', 420, details)
  }
}

export class UnprocessableEntity extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UnprocessableEntity', 422, details)
  }
}

export class UpgradeRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UpgradeRequired', 426, details)
  }
}

export class PreconditionRequired extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'PreconditionRequired', 428, details)
  }
}

export class TooManyRequests extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'TooManyRequests', 429, details)
  }
}

export class RequestHeaderFieldsTooLarge extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'RequestHeaderFieldsTooLarge', 431, details)
  }
}

export class UnavailableForLegalReasons extends HttpError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UnavailableForLegalReasons', 451, details)
  }
}
