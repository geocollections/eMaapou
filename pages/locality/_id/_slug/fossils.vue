<template>
  <div>
    <data-table-fossil
      :items="fossils"
      :count="count"
      :options="options"
      :is-loading="$fetchState.pending"
      @update="handleUpdate"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { HEADERS_FOSSIL, FOSSILS } from '~/constants'
import DataTableFossil from '~/components/data-table/DataTableFossil.vue'
export default defineComponent({
  name: 'LocalityFossils',
  components: { DataTableFossil },
  setup() {
    const { $services, $getAPIFieldValues } = useContext()
    const route = useRoute()
    const state = reactive({
      fossils: [],
      count: 0,
      options: FOSSILS.options,
      search: '',
    })

    const { fetch } = useFetch(async () => {
      const fossilsResponse = await $services.sarvSolr.getResourceList(
        'taxon_search',
        {
          search: state.search,
          options: state.options,
          defaultParams: {
            fq: `locality_id:${route.value.params.id} AND rank:[14 TO 18]`,
            sort: 'taxon ASC',
          },
          fields: $getAPIFieldValues(HEADERS_FOSSIL),
        }
      )
      state.fossils = fossilsResponse.items
      state.count = fossilsResponse.count
    })
    const handleUpdate = (tableState: any) => {
      state.options = tableState.options
      state.search = tableState.search
      fetch()
    }
    return {
      ...toRefs(state),
      handleUpdate,
    }
  },
})
</script>
