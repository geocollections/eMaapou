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
        <span class="text-body-2 font-weight-medium pr-1">
          <slot name="selection" :item="item">
            {{ item.id }}
          </slot>
        </span>

        <v-btn class="ml-auto" x-small icon @click="handleRemove(i)">
          <v-icon small>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-expansion-panel-content
      class="pt-1"
      color="white"
      style="border-bottom: 1px solid lightgray !important"
    >
      <v-autocomplete
        v-model="selectedItems"
        item-value="value"
        return-object
        hide-details
        dense
        :loading="isLoading"
        :no-filter="true"
        placeholder="Search"
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
  name: 'InputAutocompleteNew',
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
      type: Function as PropType<(search: string) => Promise<any>>,
      required: true,
    },
    initSelection: {
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
    })
    const icons = computed(() => {
      return {
        mdiClose,
      }
    })
    watch(
      () => props.initSelection,
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
        state.isLoading = false
      }, 300),
      { immediate: false }
    )
    const handleInput = (event: any) => {
      emit('input', event)
    }
    const handleRemove = (i: number) => {
      const cloneItems = cloneDeep(state.selectedItems)
      cloneItems.splice(i, 1)
      state.selectedItems = cloneItems
      emit('input', state.selectedItems)
    }
    return {
      ...toRefs(state),
      icons,
      handleInput,
      handleRemove,
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
</style>
