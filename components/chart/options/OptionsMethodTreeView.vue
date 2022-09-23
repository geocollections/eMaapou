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
        v-bind="attrs"
        v-on="on"
      >
        Parameters
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
          {{ item.name }} <v-chip small>{{ item.count }}</v-chip>
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
      console.log(event)
      this.$emit('input', event)
    },
  },
}
</script>
