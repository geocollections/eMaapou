import debounce from 'lodash/debounce'

export default {
  computed: {
    stratigraphyLabel() {
      return this.$i18n.locale === 'et' ? 'stratigraphy' : 'stratigraphy_en'
    },

    nameLabel() {
      return this.$i18n.locale === 'et' ? 'name' : 'name_en'
    },
  },

  methods: {
    autocompleteStratigraphySearch(value) {
      this.$_autocompleteMixin_search(value, 'stratigraphy')
    },

    autocompleteChronostratigraphySearch(value) {
      this.$_autocompleteMixin_search(
        value,
        'stratigraphy',
        'chronostratigraphy'
      )
    },

    autocompleteLithostratigraphySearch(value) {
      this.$_autocompleteMixin_search(
        value,
        'stratigraphy',
        'lithostratigraphy'
      )
    },

    $_autocompleteMixin_search: debounce(async function (
      value,
      table,
      options = table,
      minLength = 3,
      clearAutocomplete = true
    ) {
      if (value) {
        if (value.length < minLength) {
          if (clearAutocomplete) this.autocomplete[options] = []
        } else if (value.length >= minLength) {
          const query = buildAutocompleteQuery(value, options)
          if (query.length === 0) return

          this.autocomplete.loaders[options] = true
          const autocompleteResponse = await this.$services.sarvSolr.getResourceList(
            table,
            {
              defaultParams: {
                fq: query,
              },
            }
          )
          this.autocomplete.loaders[options] = false
          this.autocomplete[options] = autocompleteResponse.items
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
    case 'chronostratigraphy':
      return `type:1 AND stratigraphy:(*${value}*) OR stratigraphy_en:(*${value}*)&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
    case 'lithostratigraphy':
      return `type:2 AND stratigraphy:(*${value}*) OR stratigraphy_en:(*${value}*)&fl=id,stratigraphy,stratigraphy_en,hierarchy_string`
  }
}
