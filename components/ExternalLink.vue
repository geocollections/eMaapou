<template>
  <a class="text-link">
    <slot> </slot>
    <span style="white-space: nowrap; display: inline-block">
      <slot name="icon">
        <v-icon class="open-new-icon" x-small>mdi-open-in-new</v-icon>
      </slot>
    </span>
  </a>
</template>

<script>
export default {
  name: 'ExternalLink',
}
</script>

<style scoped>
.open-new-icon {
  vertical-align: text-top !important;
}

.open-new-icon:hover {
  text-decoration: none !important;
}
</style>
