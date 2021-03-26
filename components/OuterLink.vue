<template>
  <a class="text-link">
    <slot name="value">
      {{ value
      }}<span style="white-space: nowrap"
        >&#xfeff;
        <v-icon color="deep-orange darken-2" small>mdi-open-in-new</v-icon>
      </span>
    </slot>
  </a>
</template>

<script>
export default {
  name: 'OuterLink',
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped></style>
