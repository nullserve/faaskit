import {composeMiddleware, Middleware} from '../src'

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
