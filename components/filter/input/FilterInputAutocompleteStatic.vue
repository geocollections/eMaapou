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
            {{ item.id }}
          </slot>
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
        :placeholder="$t('filters.search')"
        :filter="filterFunc"
        multiple
        persistent-placeholder
        :items="items"
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
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'FilterInputAutocompleteStatic',
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<any[]>,
      required: true,
    },
    value: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    filterField: {
      type: String,
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
      }
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
    const filterFunc = (item: any, queryText: string, _itemText: string) => {
      return item[props.filterField]
        .toLocaleLowerCase()
        .includes(queryText.toLocaleLowerCase())
    }
    return {
      ...toRefs(state),
      handleInput,
      icons,
      handleRemove,
      filterFunc,
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
