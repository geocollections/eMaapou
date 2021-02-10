export default {
  methods: {
    openGeoDetail({ table, id }) {
      if (table && id) {
        window.open(
          `https://geocollections.info/${table}/${id}`,
          '_blank',
          'height=800, width=800'
        )
      }
    },

    openTaxon(taxon) {
      window.open(
        `https://fossiilid.info/${taxon}`,
        '_blank',
        'height=800, width=800'
      )
    },
  },
}
