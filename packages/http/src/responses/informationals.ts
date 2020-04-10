import {HttpStatus} from './status'

export class Continue extends HttpStatus {
  constructor() {
    super('Continue', 100)
  }
}

export class SwitchingProtocols extends HttpStatus {
  constructor() {
    super('SwitchingProtocols', 101)
  }
}

export class Processing extends HttpStatus {
  constructor() {
    super('Processing', 102)
  }
}

export class EarlyHints extends HttpStatus {
  constructor() {
    super('EarlyHints', 103)
  }
}
