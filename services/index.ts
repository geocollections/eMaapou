import { Context } from '@nuxt/types'
import createSarvRESTRepository from '~/services/sarvREST.api'
import createSarvSolrRepository from '~/services/sarvSolr.api'
import createSarvRwapiRepository from '~/services/sarvRwapi.api'
import createGeoserverRepository from '~/services/geoserver.api'

export default (context: Context) => ({
  sarvREST: createSarvRESTRepository(context.$axios),
  sarvSolr: createSarvSolrRepository(context.$axios),
  sarvRwapi: createSarvRwapiRepository(context.$axios),
  geoserver: createGeoserverRepository(context.$axios),
})
