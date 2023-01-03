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
            {{ item }}
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
      <v-text-field
        v-model="search"
        hide-details
        dense
        placeholder="Search"
        @keyup.enter="handleAdd"
      >
        <template #append>
          <v-icon @click="handleAdd">
            {{ icons.mdiPlus }}
          </v-icon>
        </template>
      </v-text-field>
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
import { mdiClose, mdiPlus } from '@mdi/js'
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'InputTextNew',
  props: {
    title: {
      type: String,
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
        mdiPlus,
      }
    })
    watch(
      () => props.initSelection,
      (newVal) => {
        state.selectedItems = newVal
      },
      { immediate: true }
    )
    const handleInput = (event: any) => {
      emit('input', event)
    }
    const handleAdd = () => {
      state.selectedItems = [...state.selectedItems, state.search]
      state.search = ''
      emit('input', state.selectedItems)
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
      handleAdd,
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
