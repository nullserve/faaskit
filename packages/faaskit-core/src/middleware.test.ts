import {
  createTimingLogMiddleware,
  createRecoveryMiddleware,
  createRequestMappingMiddleware,
  createResponseMappingMiddleware,
  createValidationMiddleware,
} from '../src'
import MockDate from 'mockdate'

describe('timingLogMiddleware', () => {
  const blackHoleTimingLogger = async () => {}
  const expectedEvent = 'expected event'
  const expectedResult = 'expected result'

  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockTimingLogger = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    mockHandler.mockClear()
    mockTimingLogger.mockClear()
    MockDate.set(0)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('returns a middleware function', () => {
    // When
    const middleware = createTimingLogMiddleware(blackHoleTimingLogger)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls handler function with same parameters it is passed', async () => {
    // Given
    const middleware = createTimingLogMiddleware(blackHoleTimingLogger)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(expectedEvent)

    //Then
    expect(mockHandler).toBeCalledWith(expectedEvent)
  })

  test('returns value that handler returns', async () => {
    // Given
    const middleware = createTimingLogMiddleware(blackHoleTimingLogger)
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(expectedEvent)

    //Then
    expect(result).toBe(expectedResult)
  })

  test('calls timing log function with duration of call', async () => {
    // Given
    const middleware = createTimingLogMiddleware(mockTimingLogger)
    const wrappedHandler = middleware(async () => {
      MockDate.set(500)
      return expectedResult
    })

    // When
    await wrappedHandler(expectedEvent)

    // Then
    expect(mockTimingLogger).toBeCalledWith(500, {
      event: expectedEvent,
      result: expectedResult,
    })
  })
})

describe('validationMiddleware', () => {
  const inputEvent = 'input event'
  const expectedResult = 'expected result'
  const expectedError = 'expected error'
  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockPassesValidationFn = jest.fn(
    (event: any) =>
      new Promise<void>(resolve => {
        resolve()
      }),
  )
  const mockFailsValidationFn = jest.fn(
    (event: any) =>
      new Promise<void>((_, reject) => {
        reject(expectedError)
      }),
  )

  beforeEach(() => {
    mockHandler.mockClear()
    mockPassesValidationFn.mockClear()
    mockFailsValidationFn.mockClear()
  })

  test('returns a middleware function', () => {
    // When
    const middleware = createValidationMiddleware(mockPassesValidationFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls validator function with input event', async () => {
    // Given
    const middleware = createValidationMiddleware(mockPassesValidationFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent)

    // Then
    expect(mockPassesValidationFn).toBeCalledWith(inputEvent)
  })

  test('calls handler function with input event', async () => {
    // Given
    const middleware = createValidationMiddleware(mockPassesValidationFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent)

    // Then
    expect(mockHandler).toBeCalledWith(inputEvent)
  })

  test('throws expected exception when validation fails', async () => {
    // Given
    const middleware = createValidationMiddleware(mockFailsValidationFn)
    const wrappedHandler = middleware(mockHandler)

    // Then
    await expect(wrappedHandler(inputEvent)).rejects.toBe(expectedError)
    expect(mockHandler).not.toBeCalled()
  })
})

describe('responseMappingMiddleware', () => {
  const inputEvent = 'input event'
  const expectedResult = 'expected result'
  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockMappingFn = jest.fn(
    (input: any) =>
      new Promise(resolve => {
        resolve(`mapped ${input}`)
      }),
  )

  beforeEach(() => {
    mockHandler.mockClear()
    mockMappingFn.mockClear()
  })

  test('returns middleware function', () => {
    // When
    const middleware = createResponseMappingMiddleware(mockMappingFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls mapper function with handler response', async () => {
    // Given
    const middleware = createResponseMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent)

    // Then
    expect(mockMappingFn).toBeCalledWith(expectedResult)
  })

  test('calls handler function with input event', async () => {
    // Given
    const middleware = createResponseMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent)

    // Then
    expect(mockHandler).toBeCalledWith(inputEvent)
  })

  test('returns mapped handler response', async () => {
    // Given
    const middleware = createResponseMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(inputEvent)

    // Then
    expect(result).toBe(`mapped ${expectedResult}`)
  })
})

describe('requestMappingMiddleware', () => {
  const inputEvent = 'input event'
  const expectedResult = 'expected result'
  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockMappingFn = jest.fn(
    (input: any) =>
      new Promise(resolve => {
        resolve(`mapped ${input}`)
      }),
  )

  beforeEach(() => {
    mockHandler.mockClear()
    mockMappingFn.mockClear()
  })

  test('returns middleware function', () => {
    // When
    const middleware = createRequestMappingMiddleware(mockMappingFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls handler function with mapped event', async () => {
    // Given
    const middleware = createRequestMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent)

    // Then
    expect(mockHandler).toBeCalledWith(`mapped ${inputEvent}`)
  })

  test('calls mapper function with input event', async () => {
    // Given
    const middleware = createRequestMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent)

    // Then
    expect(mockMappingFn).toBeCalledWith(inputEvent)
  })

  test('returns value that handler returns', async () => {
    // Given
    const middleware = createRequestMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(inputEvent)

    // Then
    expect(result).toBe(expectedResult)
  })
})

describe('recoveryHandler', () => {
  const inputEvent = 'input event'
  const expectedResolve = 'expected resolve'
  const expectedReject = 'expected reject'
  const resolveHandler = jest.fn().mockResolvedValue(expectedResolve)
  const rejectHandler = jest.fn().mockRejectedValue(expectedReject)

  const recoveryFn = (error: any, event: any) =>
    new Promise(resolve => {
      resolve(error)
    })
  const mockRecoveryResolve = 'mock reolve'
  const mockRecoveryFn = jest.fn().mockResolvedValue(mockRecoveryResolve)

  beforeEach(() => {
    rejectHandler.mockClear()
    resolveHandler.mockClear()
    mockRecoveryFn.mockClear()
  })

  test('returns a middleware function', () => {
    // When
    const middleware = createRecoveryMiddleware(recoveryFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('recovers from failing handler', async () => {
    // Given
    const middleware = createRecoveryMiddleware(recoveryFn)
    const wrappedHandler = middleware(rejectHandler)

    // When
    const result = await wrappedHandler(inputEvent)

    // Then
    expect(result).toBe(expectedReject)
  })

  test('returns value from successful handler', async () => {
    // Given
    const middleware = createRecoveryMiddleware(mockRecoveryFn)
    const wrappedHandler = middleware(resolveHandler)

    // When
    const result = await wrappedHandler(inputEvent)

    // Then
    expect(mockRecoveryFn).not.toHaveBeenCalled()
    expect(result).toBe(expectedResolve)
  })
})
