# openfeature-chaos-provider

A meta-provider for OpenFeature which injects [controlled chaos](https://en.wikipedia.org/wiki/Chaos_engineering) into the feature flag evaluation process.

This provider wraps another provider and simulates "sad path" scenarios: error conditions, delays, back-end connectivity issues.