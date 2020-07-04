import {composeMiddleware, Middleware} from '../src'
import {compose} from './compose'

describe('composeMiddleware', () => {
  const expectedEvent = 'expected event'
  const expectedContext = 'expected context'
  const expectedResult = 'expected result'

  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockMiddleware = jest.fn().mockReturnValue(() => new Promise(() => {}))

  test('returns a middleware function', () => {
    // When
    const output = composeMiddleware()

    // Then
    expect(output).toBeInstanceOf(Function)
  })

  test('returns identity on empty', () => {
    // Given
    const emptyMiddlewares = composeMiddleware()

    // When
    const result = emptyMiddlewares(mockHandler)

    // Then
    expect(result).toBe(mockHandler)
  })

  test('returns middleware when unary', () => {
    // Given
    const unaryMiddlewares = composeMiddleware(mockMiddleware)
    const expectedReturn = mockMiddleware(mockHandler)

    // When
    const actualReturn = unaryMiddlewares(mockHandler)

    // Then
    expect(actualReturn).toBe(expectedReturn)
  })

  test('wraps middleware in order', async () => {
    // Given
    const firstMiddleware: Middleware<string, string, string> = next => async (
      event,
      context,
    ) => {
      const result = await next(event, context)
      return 'first ' + result
    }
    const secondMiddleware: Middleware<string, string, string> = next => async (
      event,
      context,
    ) => {
      const result = await next(event, context)
      return 'second ' + result
    }
    const middlewares = composeMiddleware(firstMiddleware, secondMiddleware)
    const wrappedHandler = middlewares(
      () =>
        new Promise(resolve => {
          resolve('expected')
        }),
    )

    // When
    const result = await wrappedHandler(expectedEvent, expectedContext)

    // Then
    expect(result).toBe('first second expected')
  })
})

describe('compose', () => {
  const expectedResult = 'expected result'

  const mockFn = jest.fn().mockReturnValue(expectedResult)

  test('returns a function', () => {
    // When
    const output = compose()

    // Then
    expect(output).toBeInstanceOf(Function)
  })
  test('returns identity on empty', () => {
    // Given
    const input = 'test'
    const emptyMiddlewares = compose()

    // When
    const result = emptyMiddlewares(input)

    // Then
    expect(result).toBe(input)
  })
  test('returns the same function when unary', () => {
    // Given
    const input = 'test'
    const unaryFns = compose(mockFn)
    const expectedReturn = mockFn(input)

    // When
    const actualReturn = unaryFns(input)

    // Then
    expect(actualReturn).toBe(expectedReturn)
  })
  test('wraps functions in correct order', () => {
    // Given
    const input = 'test'
    const firstFn = (input: string) => `first ${input}`
    const secondFn = (input: string) => `second ${input}`
    const fns = compose(firstFn, secondFn)
    const expected = 'first second test'

    // When
    const actual = fns(input)

    // Then
    expect(actual).toEqual(expected)
  })
})
