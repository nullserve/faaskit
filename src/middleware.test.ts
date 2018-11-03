import { timingLogMiddleware, recoveryMiddleware } from './middleware'
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
