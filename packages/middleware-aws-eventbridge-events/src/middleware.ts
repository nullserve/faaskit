import {EventBridgeEvent} from 'aws-lambda'
import parseISO from 'date-fns/parseISO'

import {
  createMappingMiddleware,
  Middleware,
  postMapIdentity,
} from '@faaskit/core'

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
    pre: async ({event, context}) => {
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
    post: postMapIdentity,
  })
}
