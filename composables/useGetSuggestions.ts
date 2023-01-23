import { useContext } from "@nuxtjs/composition-api"

export const useGetSuggestions = () => {
  const { $axios, i18n } = useContext()

  return async (
      table: string,
      pivotStr: string,
      sort: { et: string; en: string },
      limit: number = 100
    ) => {
      const sortStr = i18n.locale === 'et' ? sort.et : sort.en
      return (
        await $axios.$get(
          `https://api.geoloogia.info/solr/${table}?q=%2A&start=0&rows=0&facet=true&facet.pivot=${pivotStr}&facet.limit=${limit}&facet.sort=${sortStr}`
        )
      ).facet_counts.facet_pivot[pivotStr].map((item: any) => {
        return {
          id: item.value,
          text: item.pivot[0].value,
          text_en: item.pivot[0].pivot?.[0].value ?? item.pivot[0].value,
        }
      })
    }
}
