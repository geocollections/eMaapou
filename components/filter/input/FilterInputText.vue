<template>
  <v-expansion-panel ref="panel" style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-2 pr-1 font-weight-medium"
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
        class="d-flex py-1 selected-item px-2"
        @click="handleChange(i)"
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
            {{ item }}
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
      <v-text-field
        v-model="internalValue"
        hide-details
        dense
        :placeholder="$t('filters.filter')"
        @keydown.enter="handleAdd"
      >
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
  ref,
} from '@nuxtjs/composition-api'
import { mdiClose, mdiPlus } from '@mdi/js'
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'FilterInputText',
  props: {
    title: {
      type: String,
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
      internalValue: '' as string,
      selectedItems: [] as any[],
      isLoading: false,
    })
    const icons = computed(() => {
      return {
        mdiClose,
        mdiPlus,
      }
    })
    const panel = ref()
    watch(
      () => props.value,
      (newVal) => {
        state.selectedItems = newVal
      },
      { immediate: true }
    )
    const handleInput = (event: any) => {
      emit('input', event)
    }
    const handleAdd = () => {
      if (state.internalValue === '') return
      state.selectedItems = [...state.selectedItems, state.internalValue]
      state.internalValue = ''
      emit('input', state.selectedItems)
    }
    const handleRemove = (i: number) => {
      const cloneItems = cloneDeep(state.selectedItems)
      cloneItems.splice(i, 1)
      state.selectedItems = cloneItems
      emit('input', state.selectedItems)
    }
    const handleChange = (i: number) => {
      const cloneItems = cloneDeep(state.selectedItems)
      state.internalValue = cloneItems.splice(i, 1)[0]
      state.selectedItems = cloneItems
      emit('input', state.selectedItems)
      if (!panel.value.isActive) panel.value.toggle()
    }
    return {
      ...toRefs(state),
      panel,
      icons,
      handleInput,
      handleAdd,
      handleRemove,
      handleChange,
    }
  },
})
</script>

<style scoped lang="scss">
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
}

.selected-item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
