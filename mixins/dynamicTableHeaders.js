export default {
  computed: {
    tableName() {
      let table = this.getRouteBaseName()
      if (table === 'photo') table = 'attachment'
      if (table === 'taxon') table = 'taxon_search'
      return table
    },
    stateModuleName() {
      let table = this.getRouteBaseName()
      if (table === 'analytical_data') table = 'analyticalData'
      return table
    },
  },
  async fetch() {
    const allFieldNames = await this.$services.sarvSolr.getAllFieldNames(
      this.tableName,
      {
        q: '*:*',
        wt: 'csv',
        rows: 0,
        facet: 'on',
      }
    )
    if (allFieldNames?.fields) {
      await this.$store.dispatch(`tableHeaders/setTableHeaders`, {
        module: this.stateModuleName,
        rawFields: allFieldNames.fields.trim(),
        fields: allFieldNames.fields.trim().split(','),
      })
    }
  },
}
