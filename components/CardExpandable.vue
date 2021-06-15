<template>
  <v-card :class="{ active: active }">
    <!-- NOTE: Font size should be set with class 'text-body-1', but it overrides font-family -->
    <v-card-title
      class="pl-2 py-1 montserrat card-title--clickable"
      style="font-size: 1rem; cursor: pointer"
      @click="$emit('click', !showBody)"
    >
      <slot name="title" :showBody="showBody">
        {{ title }}
      </slot>
      <v-spacer />
      <v-btn icon @click.stop="$emit('click', !showBody)">
        <v-icon>{{ showBody ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <slot name="body" :showBody="showBody">
        <div v-show="showBody" class="px-3 pb-3 pt-1">
          <slot></slot>
        </div>
      </slot>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: 'CardExpandable',
  props: {
    showBody: {
      type: Boolean,
      default: false,
      require: true,
    },
    title: {
      type: String,
      default: 'Title',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
.card-title--clickable {
  transition: opacity 200ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
.active {
  border: 2px solid var(--v-accent-lighten2);
}
</style>
