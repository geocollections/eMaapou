<template>
  <div class="d-flex justify-center py-2">
    <v-icon v-if="icon" large left>{{ icon }}</v-icon>
    <div class="d-flex flex-column">
      <h1 style="font-size: 1.75rem">
        {{ $t(title) }}
      </h1>
      <h4 v-if="subtitle" style="opacity: 0.7">
        {{ subtitle }}
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    icon: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped></style>
