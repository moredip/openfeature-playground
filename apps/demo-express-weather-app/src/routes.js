import Router from 'express-promise-router'
import { OpenFeature } from "@openfeature/js-sdk";

import { allLocations, getLocationInfo } from './lib/locations';
import { getTemperature, getConditions, getUmbrellaPrediction } from './lib/conditions';

const featureFlags = OpenFeature.getClient();

export const routes = Router()
export default routes

routes.get('/', async (req, res) => {
  res.redirect('/seattle')
})

routes.get('/:slug', async (req, res) => {
  const slug = req.params['slug']
  const locations = allLocations(slug)

  const location = getLocationInfo(slug)
  const temperature = getTemperature(slug)
  const conditions = getConditions(slug)

  let umbrellaNeeded = null
  if( await featureFlags.getBooleanValue('show-umbrella-prediction', false)){
    umbrellaNeeded = await getUmbrellaPrediction(slug)
  }

  res.render( 'weather', {locations,location,temperature,conditions,umbrellaNeeded})
})
