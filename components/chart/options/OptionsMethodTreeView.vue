<template>
  <v-menu
    transition="slide-y-transition"
    offset-y
    content-class="white"
    :close-on-content-click="false"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="accent"
        class="montserrat text-none"
        small
        dark
        outlined
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left dark> mdi-chart-line-variant </v-icon>
        {{ $t('common.parameters') }}
      </v-btn>
    </template>
    <v-treeview
      style="max-height: 500px"
      dense
      selectable
      return-object
      :items="methods"
      :value="initialSelection"
      @input="handleInput"
    >
      <template #label="{ item }">
        <div>
          {{ $translate({ et: item.name, en: item.name_en }) }}
          <v-chip small>{{ item.count }}</v-chip>
        </div>
      </template>
    </v-treeview>
  </v-menu>
</template>

<script>
export default {
  name: 'OptionsMethodtreeView',
  props: {
    methods: {
      type: Array,
      required: true,
    },
    initialSelection: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event)
    },
  },
}
</script>
