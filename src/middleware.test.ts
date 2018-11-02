import { timingLogMiddleware } from './middleware'
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
  const mockTimingLogger = jest.fn(() => new Promise(() => {}))

  beforeEach(() => {
    mockHandler.mockReset()
    mockTimingLogger.mockReset()
    MockDate.set(0)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('returns a handler function', () => {
    const middleware = timingLogMiddleware(blackHoleTimingLogger)
    expect(middleware).toBeInstanceOf(Function)
  })

  test('calls handler function with same parameters it is passed', async () => {
    const middleware = timingLogMiddleware(blackHoleTimingLogger)
    const wrappedHandler = middleware(mockHandler)
    await wrappedHandler(expectedEvent, expectedContext)

    expect(mockHandler).toBeCalledWith(expectedEvent, expectedContext)
  })

  test('calls timing log function with duration of call', async () => {
    const middleware = timingLogMiddleware(mockTimingLogger)
    const wrappedHandler = middleware(async () => {
      MockDate.set(500)
    })
    await wrappedHandler(expectedEvent, expectedContext)

    expect(mockTimingLogger).toBeCalledWith(500)
  })
})
