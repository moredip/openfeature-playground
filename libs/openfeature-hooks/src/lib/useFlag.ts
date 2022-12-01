import {
  Client,
  EvaluationDetails,
  FlagValue,
  ProviderEvents,
} from '@openfeature/js-sdk'
import { useCallback, useEffect, useState } from 'react'
import { FlagResult, fromEvaluationDetails } from './flagResult'
import { useOpenFeatureClient } from './provider'

export function useFeatureFlag<T extends FlagValue>(
  flagKey: string,
  defaultValue: T
): FlagResult<T> {
  const [flagEvaluationDetails, setFlagEvaluationDetails] =
    useState<EvaluationDetails<T> | null>(null)

  const client = useOpenFeatureClient()

  const refreshFlagState = () => {
    getFlag(client, flagKey, defaultValue, setFlagEvaluationDetails)
  }

  const handlerCallback = useCallback(refreshFlagState, [
    client,
    flagKey,
    defaultValue,
    setFlagEvaluationDetails,
  ])

  useEffect(() => {
    client.addHandler(ProviderEvents.Ready, handlerCallback)
    client.addHandler(ProviderEvents.ConfigurationChanged, handlerCallback)

    return () => {
      // TODO: remove handler
    }
  }, [client, handlerCallback])

  useEffect(refreshFlagState, [client, flagKey, defaultValue])

  return fromEvaluationDetails(defaultValue, flagEvaluationDetails)
}

async function getFlag<T extends FlagValue>(
  client: Client,
  flagKey: string,
  defaultValue: T,
  setFlagDetails: (details: EvaluationDetails<T>) => void
): Promise<void> {
  if (typeof defaultValue === 'boolean') {
    const flagDetails = await client.getBooleanDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  } else if (typeof defaultValue === 'string') {
    const flagDetails = await client.getStringDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  } else if (typeof defaultValue === 'number') {
    const flagDetails = await client.getNumberDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  } else {
    const flagDetails = await client.getObjectDetails(flagKey, defaultValue)
    setFlagDetails(flagDetails as EvaluationDetails<T>)
  }
}
