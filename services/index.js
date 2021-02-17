import createSarvRESTRepository from '~/services/sarvREST.api'
import createSarvSolrRepository from '~/services/sarvSolr.api'
import createSarvRwapiRepository from '~/services/sarvRwapi.api'

export default (context) => ({
  sarvREST: createSarvRESTRepository(context.$axios),
  sarvSolr: createSarvSolrRepository(context.$axios),
  sarvRwapi: createSarvRwapiRepository(context.$axios),
})
