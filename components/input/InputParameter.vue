<template>
  <v-row no-gutters>
    <v-col cols="4" class="pr-1">
      <input-autocomplete
        :items="parameters"
        return-object
        item-text="label"
        :value="parameter"
        item-value="id"
        remove-clearable
        do-not-cache
        @input="handleParameter($event)"
      />
    </v-col>

    <!-- <v-col v-if="entity.isText" cols="6">
      <v-row no-gutters>
        <v-col cols="12" class="pr-1">
          <input-text
            :label="$t('common.textField')"
            :value="entity.text"
            @input="
              updateActiveParam({
                value: $event,
                field: 'text',
                index: index,
              })
            "
          />
        </v-col>
      </v-row>
    </v-col> -->

    <v-col cols="6">
      <v-row no-gutters>
        <v-col cols="6" class="px-1">
          <input-number
            step="0.1"
            :label="$t('common.from')"
            :value="value.value[0]"
            @input="handleValue([parseInput($event), value.value[1]])"
          />
        </v-col>

        <v-col cols="6" class="px-1">
          <input-number
            step="0.1"
            :label="$t('common.to')"
            :value="value.value[1]"
            @input="handleValue([value.value[0], parseInput($event)])"
          />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="1" align-self="end" class="text-center">
      <v-btn
        small
        icon
        color="success"
        :disabled="disableAdd"
        @click="$emit('add:parameter')"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="1" align-self="end" class="text-center">
      <v-btn
        small
        icon
        color="error"
        :disabled="disableRemove"
        @click="$emit('remove:parameter')"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { isEmpty } from 'lodash'
import InputNumber from '~/components/input/InputNumber.vue'
import InputAutocomplete from '~/components/input/InputAutocomplete.vue'
export default {
  name: 'InputParameter',
  components: { InputNumber, InputAutocomplete },
  props: {
    disableRemove: {
      type: Boolean,
      default: false,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
    parameters: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => {
        return { value: [null, null] }
      },
    },
  },
  data() {
    return {
      parameter: {
        id: this.value.fields[0],
        label: this.value.label,
      },
    }
  },
  methods: {
    parseInput(input) {
      if (isEmpty(input)) return null
      else return parseFloat(input)
    },
    handleParameter(newParameter) {
      if (newParameter) {
        this.parameter = newParameter

        this.$emit('input', {
          ...this.value,
          label: newParameter.label,
          fields: [newParameter.id],
        })
      }
    },
    handleValue(value) {
      this.$emit('input', { ...this.value, value })
    },
  },
}
</script>
