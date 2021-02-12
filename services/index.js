import createSarvRESTRepository from '~/services/sarvREST.api'
import createSarvSolrRepository from '~/services/sarvSolr.api'

export default (context) => ({
  sarvREST: createSarvRESTRepository(context.$axios),
  sarvSolr: createSarvSolrRepository(context.$axios),
})
