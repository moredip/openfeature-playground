import { MinimalistProvider } from '@openfeature-sandbox/openfeature-minimalist-provider'
import { OpenFeature } from '@openfeature/js-sdk'
import { render } from '@testing-library/react'
import { createSpy } from '../testing-support/spyComponent'
import { OpenFeatureProvider } from './provider'

describe('useFlag', () => {
  describe('happy path', () => {
    it('returns the configured value', () => {
      const flags = {
        'a-flag': true,
      }
      const provider = new MinimalistProvider(flags)
      OpenFeature.setProvider(provider)

      const { SpyComponent, getFlagEvalHistory } = createSpy('a-flag', false)

      expect(getFlagEvalHistory().length).toBe(0)

      render(
        <OpenFeatureProvider>
          <SpyComponent />
        </OpenFeatureProvider>
      )

      expect(getFlagEvalHistory().length).toBe(1)
      expect(getFlagEvalHistory()).toEqual([true])
    })
  })
})
