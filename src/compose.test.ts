import { compose } from './'

describe('compose', () => {
  test('returns a middleware function', () => {
    const output = compose()
    expect(output).toBeInstanceOf(Function)
  })

  test('wraps middleware in order', () => {})
})
