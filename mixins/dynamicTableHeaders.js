export default {
  computed: {
    tableName() {
      let table = this.getRouteBaseName()
      if (table === 'photo') table = 'attachment'
      return table
    },
    stateModuleName() {
      const table = this.getRouteBaseName()
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
        fields: allFieldNames?.fields.trim().split(','),
      })
    }
  },
}
