export interface JSONError {
  error: {
    code: number
    message: string
    fields: {
      name: string
      message: string
    }[]
  }
}
