import {
  Client,
  EvaluationDetails,
  FlagValue,
  ProviderEvents,
} from '@openfeature/web-sdk'
import { useOpenFeatureClient } from './provider'
import { useEffect, useReducer } from 'react'
import { FlagResult, fromEvaluationDetails } from './flagResult'

export function useFeatureFlag<T extends FlagValue>(
  flagKey: string,
  defaultValue: T
): FlagResult<T> {
  const [, forceUpdate] = useReducer((x) => x + 1, 0) // courtesy https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate

  const client = useOpenFeatureClient()

  useEffect(() => {
    // whenever any events happen, re-run our hook just in case the feature flag result has changed
    client.addHandler(ProviderEvents.ConfigurationChanged, forceUpdate)
    client.addHandler(ProviderEvents.Ready, forceUpdate)
    client.addHandler(ProviderEvents.Error, forceUpdate)
    client.addHandler(ProviderEvents.Stale, forceUpdate)
    return () => {
      client.removeHandler(ProviderEvents.ConfigurationChanged, forceUpdate)
      client.removeHandler(ProviderEvents.Ready, forceUpdate)
      client.removeHandler(ProviderEvents.Error, forceUpdate)
      client.removeHandler(ProviderEvents.Stale, forceUpdate)
    }
  }, [client])

  const evaluation = getFlag(client, flagKey, defaultValue)

  return fromEvaluationDetails(evaluation)
}

function getFlag<T extends FlagValue>(
  client: Client,
  flagKey: string,
  defaultValue: T
): EvaluationDetails<T> {
  if (typeof defaultValue === 'boolean') {
    return client.getBooleanDetails(
      flagKey,
      defaultValue
    ) as EvaluationDetails<T>
  } else if (typeof defaultValue === 'string') {
    return client.getStringDetails(
      flagKey,
      defaultValue
    ) as EvaluationDetails<T>
  } else if (typeof defaultValue === 'number') {
    return client.getNumberDetails(
      flagKey,
      defaultValue
    ) as EvaluationDetails<T>
  } else {
    return client.getObjectDetails(
      flagKey,
      defaultValue
    ) as EvaluationDetails<T>
  }
}
