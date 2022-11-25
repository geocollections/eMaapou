import { Context } from '@nuxt/types'
import createSarvRESTRepository from '~/services/sarvREST'
import createSarvSolrRepository from '~/services/sarvSolr'
import createGeoserverRepository from '~/services/geoserver'

export interface IOptions {
  page?: number
  itemsPerPage?: number
  sortBy?: string[]
  sortDesc?: boolean[]
}

export default (context: Context) => ({
  sarvREST: createSarvRESTRepository(context.$axios),
  sarvSolr: createSarvSolrRepository(context.$axios),
  geoserver: createGeoserverRepository(context.$axios),
})
