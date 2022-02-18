<template>
  <v-hover v-slot="{ hover }">
    <v-list-item class="rounded" color="accent darken-1" v-bind="$attrs">
      <v-list-item-title class="d-flex py-1">
        <div v-if="!labelOnly">
          <v-icon v-if="icon" left>{{ icon }}</v-icon>
          <v-icon v-else style="height: 24px; width: 24px" left />
        </div>

        <span class="align-self-center montserrat">{{ label }}</span>
        <v-icon v-show="hover && !labelOnly" class="ml-auto">
          {{ trailingIcon }}
        </v-icon>
      </v-list-item-title>
    </v-list-item>
  </v-hover>
</template>

<script>
export default {
  name: 'BaseMenuListItem',
  props: {
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    labelOnly: {
      type: Boolean,
      default: false,
    },
    trailingIcon: {
      type: String,
      default: 'mdi-arrow-right',
    },
  },
}
</script>

<style lang="scss" scoped>
.v-list-item::before {
  border-radius: 4px;
}
</style>
