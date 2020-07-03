import {
  createEffectMiddleware,
  createMappingMiddleware,
  createRecoveryMiddleware,
  PreMappingFnResult,
  preMapIdentity,
  postMapIdentity,
} from './middleware'

describe('createEffectMiddleware', () => {
  const inputEvent = 'input event'
  const inputContext = 'input context'
  const expectedResult = 'expected result'
  const expectedError = 'expected error'
  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockPassesValidationFn = jest.fn(
    (event: any, context: any) =>
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
    const middleware = createEffectMiddleware({pre: mockPassesValidationFn})

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls effect function with input event', async () => {
    // Given
    const middleware = createEffectMiddleware({pre: mockPassesValidationFn})
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockPassesValidationFn).toBeCalledWith(inputEvent, inputContext)
  })

  test('calls handler function with input event', async () => {
    // Given
    const middleware = createEffectMiddleware({pre: mockPassesValidationFn})
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockHandler).toBeCalledWith(inputEvent, inputContext)
  })

  test('throws expected exception when validation fails', async () => {
    // Given
    const middleware = createEffectMiddleware({pre: mockFailsValidationFn})
    const wrappedHandler = middleware(mockHandler)

    // Then
    await expect(wrappedHandler(inputEvent, inputContext)).rejects.toBe(
      expectedError,
    )
    expect(mockHandler).not.toBeCalled()
  })
})

describe('createMappingMiddleware', () => {
  const inputEvent = 'input event'
  const inputContext = 'input context'
  const expectedResult = 'expected result'
  const expectedMappedEvent = `mapped ${inputEvent}`
  const expectedMappedContext = `mapped ${inputContext}`
  const expectedPostInput = {
    context: inputContext,
    event: inputEvent,
    mappedEvent: inputEvent,
    mappedContext: inputContext,
    result: expectedResult,
  }
  const mockHandler = jest.fn().mockResolvedValue(expectedResult)
  const mockPreMappingFn = jest.fn(
    _params =>
      new Promise<PreMappingFnResult<string, string>>(resolve => {
        resolve({event: expectedMappedEvent, context: expectedMappedContext})
      }),
  )
  const mockPostMappingFn = jest.fn(
    ({result}) =>
      new Promise(resolve => {
        resolve(`mapped ${result}`)
      }),
  )

  beforeEach(() => {
    mockHandler.mockClear()
    mockPreMappingFn.mockClear()

    mockPostMappingFn.mockClear()
  })

  test('returns middleware function', () => {
    // When
    const middleware = createMappingMiddleware({
      pre: preMapIdentity,
      post: mockPostMappingFn,
    })

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls mapper function with handler response', async () => {
    // Given
    const middleware = createMappingMiddleware({
      pre: preMapIdentity,
      post: mockPostMappingFn,
    })
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockPostMappingFn).toBeCalledWith(expectedPostInput)
  })

  test('calls handler function with input event', async () => {
    // Given
    const middleware = createMappingMiddleware({
      pre: preMapIdentity,
      post: mockPostMappingFn,
    })
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockHandler).toBeCalledWith(inputEvent, inputContext)
  })

  test('returns mapped handler response', async () => {
    // Given
    const middleware = createMappingMiddleware({
      pre: preMapIdentity,
      post: mockPostMappingFn,
    })
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(result).toBe(`mapped ${expectedResult}`)
  })

  test('returns middleware function', () => {
    // When
    const middleware = createMappingMiddleware({
      pre: mockPreMappingFn,
      post: postMapIdentity,
    })

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls handler function with mapped event', async () => {
    // Given
    const middleware = createMappingMiddleware({
      pre: mockPreMappingFn,
      post: postMapIdentity,
    })
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockHandler).toBeCalledWith(
      `mapped ${inputEvent}`,
      `mapped ${inputContext}`,
    )
  })

  test('calls mapper function with input event', async () => {
    // Given
    const middleware = createMappingMiddleware({
      pre: mockPreMappingFn,
      post: postMapIdentity,
    })
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockPreMappingFn).toBeCalledWith({
      event: inputEvent,
      context: inputContext,
    })
  })

  test('returns value that handler returns', async () => {
    // Given
    const middleware = createMappingMiddleware({
      pre: mockPreMappingFn,
      post: postMapIdentity,
    })
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(result).toBe(expectedResult)
  })
})

describe('createRecoveryMiddleware', () => {
  const inputEvent = 'input event'
  const inputContext = 'input context'
  const expectedResolve = 'expected resolve'
  const expectedReject = 'expected reject'
  const resolveHandler = jest.fn().mockResolvedValue(expectedResolve)
  const rejectHandler = jest.fn().mockRejectedValue(expectedReject)

  const recoveryFn = (error: any, event: any) =>
    new Promise(resolve => {
      resolve(error)
    })
  const mockRecoveryResolve = 'mock resolve'
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
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(result).toBe(expectedReject)
  })

  test('returns value from successful handler', async () => {
    // Given
    const middleware = createRecoveryMiddleware(mockRecoveryFn)
    const wrappedHandler = middleware(resolveHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockRecoveryFn).not.toHaveBeenCalled()
    expect(result).toBe(expectedResolve)
  })
})
