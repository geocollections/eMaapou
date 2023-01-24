<template>
  <v-expansion-panel ref="panel" style="background-color: transparent">
    <v-expansion-panel-header
      class="py-1 pl-4 pr-1 font-weight-medium"
      style="min-height: 40px; border-bottom: 1px solid lightgray !important"
    >
      {{ title }}
    </v-expansion-panel-header>
    <div
      v-if="internalValue.length > 0"
      class="white"
      style="
        border-bottom: 1px solid lightgray !important;
        border-right: 1px solid lightgray !important;
      "
    >
      <div
        v-for="(item, i) in internalValue"
        :key="i"
        class="d-flex py-1 selected-item pl-4 pr-2"
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
          {{ getDateStr(item) }}
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
      <v-date-picker
        :value="currentDatePickerValue"
        color="accent"
        full-width
        range
        no-title
        first-day-of-week="1"
        show-adjacent-months
        :max="maxDate"
        :locale="$i18n.locale === 'et' ? 'et-EE' : 'en-US'"
        @input="handleDatePickerInput"
      />
      <v-row
        style="border-top: 1px solid lightgray !important"
        no-gutters
        class="py-2 px-4"
      >
        <v-col cols="6">
          <v-btn
            small
            text
            block
            class="text-center"
            color="accent"
            :disabled="internalValue.length < 1"
            @click="handleClear"
          >
            Clear
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            small
            text
            block
            class="text-center"
            color="accent"
            :disabled="!isAddActive"
            @click="handleAdd"
          >
            Add
          </v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  useContext,
  ref,
  toRefs,
  watch,
} from '@nuxtjs/composition-api'
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'FilterInputDate',
  props: {
    value: {
      type: Array as PropType<string[][]>,
      default: () => {
        return [null, null]
      },
    },
    title: {
      type: String,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { i18n } = useContext()
    const panel = ref()
    const state = reactive({
      currentDatePickerValue: undefined as undefined | string[],
      internalValue: [] as string[][],
    })

    watch(
      () => props.value,
      (newVal) => {
        state.internalValue = newVal
      },
      { immediate: true }
    )

    const handleRemove = (i: number) => {
      const cloneItems = cloneDeep(state.internalValue)
      cloneItems.splice(i, 1)
      state.internalValue = cloneItems
      emit('input', state.internalValue)
    }
    const handleAdd = () => {
      state.internalValue = [
        ...state.internalValue,
        state.currentDatePickerValue,
      ]
      emit('input', state.internalValue)
      state.currentDatePickerValue = undefined
    }
    const handleClear = () => {
      state.internalValue = []
      emit('input', state.internalValue)
    }
    const handleDatePickerInput = (e: string[]) => {
      state.currentDatePickerValue = e.sort()
    }
    const handleChange = (i: number) => {
      const cloneItems = cloneDeep(state.internalValue)
      state.currentDatePickerValue = cloneItems.splice(i, 1)[0]
      state.internalValue = cloneItems
      emit('input', state.internalValue)
      if (!panel.value.isActive) panel.value.toggle()
    }
    const isAddActive = computed(() => {
      return state.currentDatePickerValue !== undefined
    })
    const getDateStr = (dateArray: string[]) => {
      const dateFormat = new Intl.DateTimeFormat(i18n.locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
      const startDate = new Date(dateArray[0])
      if (dateArray.length > 1) {
        const endDate = new Date(dateArray[1])
        return dateFormat.formatRange(startDate, endDate)
      }
      return dateFormat.format(startDate)
    }
    const maxDate = computed(() => {
      return new Date().toISOString().substr(0, 10)
    })
    return {
      ...toRefs(state),
      handleRemove,
      handleChange,
      handleClear,
      handleAdd,
      handleDatePickerInput,
      isAddActive,
      panel,
      getDateStr,
      maxDate,
    }
  },
})
</script>

<style scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
}
.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
