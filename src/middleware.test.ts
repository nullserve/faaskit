import {
  timingLogMiddleware,
  recoveryMiddleware,
  requestMappingMiddleware,
  responseMappingMiddleware,
  validationMiddleware,
} from '.'
import MockDate from 'mockdate'
import { Context } from 'aws-lambda'

describe('timingLogMiddleware', () => {
  const blackHoleTimingLogger = async () => {}
  const expectedEvent = 'expected event'
  const expectedContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'functionName',
    functionVersion: 'functionVersion',
    invokedFunctionArn: 'invokedFunctionArn',
    memoryLimitInMB: 1,
    awsRequestId: 'awsRequestId',
    logGroupName: 'logGroupName',
    logStreamName: 'logStreamName',
    getRemainingTimeInMillis: () => 1,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  }
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
    const middleware = timingLogMiddleware(blackHoleTimingLogger)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls handler function with same parameters it is passed', async () => {
    // Given
    const middleware = timingLogMiddleware(blackHoleTimingLogger)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(expectedEvent, expectedContext)

    //Then
    expect(mockHandler).toBeCalledWith(expectedEvent, expectedContext)
  })

  test('returns value that handler returns', async () => {
    // Given
    const middleware = timingLogMiddleware(blackHoleTimingLogger)
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(expectedEvent, expectedContext)

    //Then
    expect(result).toBe(expectedResult)
  })

  test('calls timing log function with duration of call', async () => {
    // Given
    const middleware = timingLogMiddleware(mockTimingLogger)
    const wrappedHandler = middleware(async () => {
      MockDate.set(500)
    })

    // When
    await wrappedHandler(expectedEvent, expectedContext)

    // Then
    expect(mockTimingLogger).toBeCalledWith(500)
  })
})

describe('validationMiddleware', () => {
  const inputEvent = 'input event'
  const inputContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'functionName',
    functionVersion: 'functionVersion',
    invokedFunctionArn: 'invokedFunctionArn',
    memoryLimitInMB: 1,
    awsRequestId: 'awsRequestId',
    logGroupName: 'logGroupName',
    logStreamName: 'logStreamName',
    getRemainingTimeInMillis: () => 1,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  }
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
    const middleware = validationMiddleware(mockPassesValidationFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls validator function with input event', async () => {
    // Given
    const middleware = validationMiddleware(mockPassesValidationFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockPassesValidationFn).toBeCalledWith(inputEvent)
  })

  test('calls handler function with input event', async () => {
    // Given
    const middleware = validationMiddleware(mockPassesValidationFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockHandler).toBeCalledWith(inputEvent, inputContext)
  })

  test('throws expected exception when validation fails', async () => {
    // Given
    const middleware = validationMiddleware(mockFailsValidationFn)
    const wrappedHandler = middleware(mockHandler)

    // Then
    await expect(wrappedHandler(inputEvent, inputContext)).rejects.toBe(
      expectedError,
    )
    expect(mockHandler).not.toBeCalled()
  })
})

describe('responseMappingMiddleware', () => {
  const inputEvent = 'input event'
  const inputContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'functionName',
    functionVersion: 'functionVersion',
    invokedFunctionArn: 'invokedFunctionArn',
    memoryLimitInMB: 1,
    awsRequestId: 'awsRequestId',
    logGroupName: 'logGroupName',
    logStreamName: 'logStreamName',
    getRemainingTimeInMillis: () => 1,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  }
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
    const middleware = responseMappingMiddleware(mockMappingFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls mapper function with handler response', async () => {
    // Given
    const middleware = responseMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockMappingFn).toBeCalledWith(expectedResult)
  })

  test('calls handler function with input event', async () => {
    // Given
    const middleware = responseMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockHandler).toBeCalledWith(inputEvent, inputContext)
  })

  test('returns mapped handler response', async () => {
    // Given
    const middleware = responseMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(result).toBe(`mapped ${expectedResult}`)
  })
})

describe('requestMappingMiddleware', () => {
  const inputEvent = 'input event'
  const inputContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'functionName',
    functionVersion: 'functionVersion',
    invokedFunctionArn: 'invokedFunctionArn',
    memoryLimitInMB: 1,
    awsRequestId: 'awsRequestId',
    logGroupName: 'logGroupName',
    logStreamName: 'logStreamName',
    getRemainingTimeInMillis: () => 1,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  }
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
    const middleware = requestMappingMiddleware(mockMappingFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls handler function with mapped event', async () => {
    // Given
    const middleware = requestMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockHandler).toBeCalledWith(`mapped ${inputEvent}`, inputContext)
  })

  test('calls mapper function with input event', async () => {
    // Given
    const middleware = requestMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockMappingFn).toBeCalledWith(inputEvent)
  })

  test('returns value that handler returns', async () => {
    // Given
    const middleware = requestMappingMiddleware(mockMappingFn)
    const wrappedHandler = middleware(mockHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(result).toBe(expectedResult)
  })
})

describe('recoveryHandler', () => {
  const inputEvent = 'input event'
  const inputContext: Context = {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'functionName',
    functionVersion: 'functionVersion',
    invokedFunctionArn: 'invokedFunctionArn',
    memoryLimitInMB: 1,
    awsRequestId: 'awsRequestId',
    logGroupName: 'logGroupName',
    logStreamName: 'logStreamName',
    getRemainingTimeInMillis: () => 1,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  }

  const expectedResolve = 'expected resolve'
  const expectedReject = 'expected reject'
  const resolveHandler = jest.fn().mockResolvedValue(expectedResolve)
  const rejectHandler = jest.fn().mockRejectedValue(expectedReject)

  const recoveryFn = (error: any, event: any, context: Context) =>
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
    const middleware = recoveryMiddleware(recoveryFn)

    // Then
    expect(middleware).toBeInstanceOf(Function)
  })

  test('recovers from failing handler', async () => {
    // Given
    const middleware = recoveryMiddleware(recoveryFn)
    const wrappedHandler = middleware(rejectHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(result).toBe(expectedReject)
  })

  test('returns value from successful handler', async () => {
    // Given
    const middleware = recoveryMiddleware(mockRecoveryFn)
    const wrappedHandler = middleware(resolveHandler)

    // When
    const result = await wrappedHandler(inputEvent, inputContext)

    // Then
    expect(mockRecoveryFn).not.toHaveBeenCalled()
    expect(result).toBe(expectedResolve)
  })
})
