<template>
  <v-expansion-panel style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-4 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ title }}
    </v-expansion-panel-header>
    <div
      v-if="selectedItems.length > 0"
      class="white"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
    >
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="d-flex py-1 selected-item pl-4 pr-2"
      >
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove(i)"
          />
        </span>
        <span
          class="align-self-center text-body-2 font-weight-medium pl-2"
          style="word-break: break-word"
        >
          <slot name="selection" :item="item">
            <div>
              {{ $translate({ et: item.text, en: item.text_en }) }}
            </div>
          </slot>
        </span>
        <span
          class="text-body-2 font-weight-medium text--disabled align-self-center ml-auto"
        >
          {{ item.count }}
        </span>
      </div>
    </div>
    <v-expansion-panel-content
      class="pt-1"
      color="white"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
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
        multiple
        :search-input.sync="search"
        persistent-placeholder
        :items="parsedSuggestionItems"
        @input="handleInput"
        @focus="handleClick"
      >
        <template #item="{ item }">
          <span class="text-body-2 font-weight-medium pr-2">
            <slot name="suggestion" :item="item">
              <div>
                {{ $translate({ et: item.text, en: item.text_en }) }}
              </div>
            </slot>
          </span>
          <span class="text-body-2 text--disabled font-weight-medium ml-auto">
            {{ item.count }}
          </span>
        </template>

        <template #append-item>
          <div v-intersect="loadMore" />
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
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
export default defineComponent({
  name: 'FilterInputAutocompleteNew',
  props: {
    title: {
      type: String,
      required: true,
    },
    queryField: {
      type: String,
      default: '',
    },
    value: {
      type: Array as PropType<any[]>,
      default: () => [],
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
  },
  setup(props, { emit }) {
    const state = reactive({
      suggestItems: [] as any[],
      search: null as string | null,
      selectedItems: [] as any[],
      isLoading: false,
      totalSuggestions: 0,
      page: 1,
      canLoadMore: true,
    })
    const icons = computed(() => {
      return {
        mdiClose,
      }
    })
    watch(
      () => props.value,
      (newVal) => {
        state.selectedItems = newVal
      },
      { immediate: true }
    )

    watch(
      () => state.search,
      debounce(async () => {
        if (state.isLoading) return
        state.isLoading = true
        let search = '*'
        if (!isEmpty(state.search))
          search = (state.search as string)
            .trim()
            .split(' ')
            .map((term) =>
              props.queryField.length > 0
                ? `${props.queryField}:*${term}*`
                : `*${term}*`
            )
            .join(' AND ')
        state.suggestItems = await props.queryFunction(search)
        state.canLoadMore = state.suggestItems.length >= rowsPerPage
        state.page = 1
        state.isLoading = false
      }, 300)
    )
    const handleFocus = async () => {
      if (state.isLoading) return
      state.isLoading = true
      state.search = null
      const search = '*'
      state.suggestItems = await props.queryFunction(search)
      state.canLoadMore = state.suggestItems.length >= rowsPerPage
      state.page = 1
      state.isLoading = false
    }
    const handleInput = (event: any[]) => {
      emit('input', [...state.selectedItems, event[event.length - 1]])
    }
    const handleRemove = (i: number) => {
      const cloneItems = cloneDeep(state.selectedItems)
      cloneItems.splice(i, 1)
      state.selectedItems = cloneItems
      emit('input', state.selectedItems)
    }
    const rowsPerPage = 10
    const loadMore = async () => {
      if (!state.canLoadMore) return
      let search = '*'
      if (!isEmpty(state.search))
        search = (state.search as string)
          .trim()
          .split(' ')
          .map((term) =>
            props.queryField.length > 0
              ? `${props.queryField}:*${term}*`
              : `*${term}*`
          )
          .join(' AND ')
      const newSuggestions = await props.queryFunction(search, {
        rows: rowsPerPage,
        start: rowsPerPage * state.page,
      })

      state.canLoadMore = newSuggestions.length >= rowsPerPage
      state.page += 1
      state.suggestItems = [...state.suggestItems, ...newSuggestions]
    }
    const parsedSuggestionItems = computed(() => {
      // Disable already selected items in the suggestions
      return state.suggestItems.map((suggestion) => {
        const disabled = state.selectedItems.some(
          (item) => item.id === suggestion.id
        )
        return {
          ...suggestion,
          disabled,
        }
      })
    })
    return {
      ...toRefs(state),
      handleInput,
      icons,
      handleRemove,
      parsedSuggestionItems,
      loadMore,
      handleClick: handleFocus,
    }
  },
})
</script>

<style scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 16px;
  padding-left: 16px;
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
