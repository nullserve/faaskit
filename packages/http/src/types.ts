import {Stream} from 'stream'
import {CaseInsensitiveDefaultMultiValueObject} from './headers'

export interface Request {
  body: string | Buffer | Stream
  headers: CaseInsensitiveDefaultMultiValueObject
  method: string
}
export interface Response {
  body: string | Buffer | Stream
  headers: CaseInsensitiveDefaultMultiValueObject
  statusCode: number
}
export interface Context {
  request: Request
  response: Response
}
