import debounce from 'lodash/debounce'

export default {
  computed: {
    stratigraphyLabel() {
      return this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en'
    },
  },

  methods: {
    autocompleteStratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy')
    },

    $_autocompleteMixin_search: debounce(async function (
      value,
      type,
      minLength = 3,
      clearAutocomplete = true
    ) {
      if (value) {
        if (value.length < minLength) {
          if (clearAutocomplete) this.autocomplete[type] = []
        } else if (value.length >= minLength) {
          const query = buildAutocompleteQuery(value, type)
          if (query.length === 0) return

          this.autocomplete.loaders[type] = true
          const autocompleteResponse = await this.$services.sarvSolr.getResourceList(
            type,
            {
              defaultParams: {
                fq: query,
              },
            }
          )
          this.autocomplete.loaders[type] = false
          this.autocomplete[type] = autocompleteResponse.items
        }
      }
    },
    400),
  },
}

function buildAutocompleteQuery(value, type) {
  switch (type) {
    case 'stratigraphy':
      return `stratigraphy:(*${value}*) OR stratigraphy_en:(*${value}*)&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
  }
}
