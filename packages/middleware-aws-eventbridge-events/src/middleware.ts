import {EventBridgeEvent} from 'aws-lambda'
import {createMappingMiddleware, Middleware} from '@faaskit/core'

import parseISO from 'date-fns/parseISO'

export interface EventBridgeContext<TDetailType> {
  AWSEventBridge: {
    id: string
    version: string
    account: string
    time: Date
    region: string
    resources: string[]
    source: string
    detailType: TDetailType
  }
}

export function createEventBridgeMiddleware<
  TDetailType extends string,
  TDetail,
  TContext,
  TResult
>(): Middleware<
  EventBridgeEvent<TDetailType, TDetail>,
  TContext,
  TResult,
  TDetail,
  TContext & EventBridgeContext<TDetailType>
> {
  return createMappingMiddleware({
    pre: async (event, context) => {
      const {id, version, account, time, region, resources, source} = event
      return {
        event: event.detail,
        context: {
          ...context,
          AWSEventBridge: {
            id,
            version,
            account,
            time: parseISO(time),
            region,
            resources,
            source,
            detailType: event['detail-type'],
          },
        },
      }
    },
  })
}
