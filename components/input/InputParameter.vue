<script>
import { mdiMinus, mdiPlus } from "@mdi/js";
import isEmpty from "lodash/isEmpty";
import InputNumber from "~/components/input/InputNumber.vue";
import InputAutocomplete from "~/components/input/InputAutocomplete.vue";

export default {
  name: "InputParameter",
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
        return { value: [null, null] };
      },
    },
  },
  data() {
    return {
      parameter: {
        value: this.value.fields[0],
        text: this.value.label,
      },
    };
  },
  computed: {
    icons() {
      return {
        mdiPlus,
        mdiMinus,
      };
    },
  },
  methods: {
    parseInput(input) {
      if (isEmpty(input))
        return null;
      else return Number.parseFloat(input);
    },
    handleParameter(newParameter) {
      if (newParameter) {
        this.parameter = newParameter;

        this.$emit("input", {
          ...this.value,
          label: newParameter.text,
          fields: [newParameter.value],
        });
      }
    },
    handleValue(value) {
      this.$emit("input", { ...this.value, value });
    },
  },
};
</script>

<template>
  <v-row no-gutters>
    <v-col cols="4" class="pr-1">
      <InputAutocomplete
        :value="parameter"
        :items="parameters"
        return-object
        :clearable="false"
        @input="handleParameter"
      />
    </v-col>
    <v-col cols="6">
      <v-row no-gutters>
        <v-col cols="6" class="px-1">
          <InputNumber
            step="0.1"
            :label="$t('common.from')"
            :value="value.value[0]"
            @input="handleValue([parseInput($event), value.value[1]])"
          />
        </v-col>

        <v-col cols="6" class="px-1">
          <InputNumber
            step="0.1"
            :label="$t('common.to')"
            :value="value.value[1]"
            @input="handleValue([value.value[0], parseInput($event)])"
          />
        </v-col>
      </v-row>
    </v-col>

    <v-col
      cols="1"
      align-self="end"
      class="text-center"
    >
      <v-btn
        size="small"
        icon
        color="success"
        :disabled="disableAdd"
        @click="$emit('add:parameter')"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </v-col>

    <v-col
      cols="1"
      align-self="end"
      class="text-center"
    >
      <v-btn
        size="small"
        icon
        color="error"
        :disabled="disableRemove"
        @click="$emit('remove:parameter')"
      >
        <v-icon>{{ icons.mdiMinus }}</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>
