<template>
  <v-expansion-panel style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ title }}
    </v-expansion-panel-header>
    <div
      v-if="selectedItems.length > 0"
      class="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="d-flex py-1 selected-item px-2"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.stop="handleRemove(i)"
          />
        </span>
        <span
          class="align-self-center text-body-2 font-weight-medium pl-2"
          style="word-break: break-word"
        >
          <slot name="selection" :item="item">
            {{ item.id }}
          </slot>
        </span>
      </div>
    </div>
    <v-expansion-panel-content
      class="pt-1"
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <v-autocomplete
        :value="[]"
        item-value="value"
        return-object
        hide-details
        dense
        :loading="isLoading"
        :no-filter="true"
        :placeholder="$t('filters.search')"
        :search-input.sync="search"
        multiple
        persistent-placeholder
        :items="suggestItems"
        @input="handleInput"
      >
        <template #item="{ item }">
          <span class="text-body-2">
            <slot name="suggestion" :item="item">
              {{ item.id }}
            </slot>
          </span>
        </template>
        <template #selection> </template>
        <template #append-item>
          <div v-intersect="loadMore" />
        </template>
      </v-autocomplete>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  PropType,
  watch,
} from '@nuxtjs/composition-api'
import { mdiClose } from '@mdi/js'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'FilterInputAutocomplete',
  props: {
    title: {
      type: String,
      required: true,
    },
    queryField: {
      type: String,
      required: true,
    },
    queryFunction: {
      type: Function as PropType<
        (
          search: string,
          options?: { rows: number; start: number }
        ) => Promise<any>
      >,
      required: true,
    },
    value: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      suggestItems: [] as any[],
      search: null as string | null,
      selectedItems: [] as any[],
      isLoading: false,
      totalSuggestions: 0,
      page: 1,
    })
    const rowsPerPage = 10
    const icons = computed(() => {
      return {
        mdiClose,
      }
    })
    watch(
      () => props.value,
      (newVal) => {
        state.selectedItems = newVal
      }
    )
    watch(
      () => state.search,
      debounce(async () => {
        if (state.isLoading) return
        if (state.search === null || state.search.length < 1) return
        state.isLoading = true
        let search = '*'
        if (!isEmpty(state.search))
          search = state.search
            .trim()
            .split(' ')
            .map((term) => `${props.queryField}:*${term}*`)
            .join(' AND ')

        const response = await props.queryFunction(search)
        // const response = await $axios.$get(
        //   `https://api.geoloogia.info/solr/locality?q=${search}&rows=10&fl=locality,id`
        // )
        state.suggestItems = response.response.docs
        state.totalSuggestions = response.response.numFound
        state.page = 1
        state.isLoading = false
      }, 300),
      { immediate: false }
    )
    const handleInput = (event: any[]) => {
      emit('input', [...state.selectedItems, event[event.length - 1]])
    }
    const handleRemove = (i: number) => {
      const cloneItems = cloneDeep(state.selectedItems)
      cloneItems.splice(i, 1)
      state.selectedItems = cloneItems
      emit('input', state.selectedItems)
    }
    const loadMore = async () => {
      if (state.totalSuggestions < state.page * rowsPerPage) return
      if (state.search === null || state.search.length < 1) return
      let search = '*'
      if (!isEmpty(state.search))
        search = state.search
          .trim()
          .split(' ')
          .map((term) => `${props.queryField}:*${term}*`)
          .join(' AND ')
      const newSuggestions = (
        await props.queryFunction(search, {
          rows: rowsPerPage,
          start: rowsPerPage * state.page,
        })
      ).response.docs
      state.page += 1
      state.suggestItems = [...state.suggestItems, ...newSuggestions]
    }
    return {
      ...toRefs(state),
      handleInput,
      icons,
      handleRemove,
      loadMore,
    }
  },
})
</script>

<style scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
}

.selected-item:hover {
  background-color: #eeeeee;
}

.v-select__selection {
  display: none;
}
::v-deep .v-select.v-input--is-dirty ::placeholder {
  color: back !important;
}
.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
