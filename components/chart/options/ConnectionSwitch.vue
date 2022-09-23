<template>
  <v-checkbox
    class="ma-0"
    v-bind="$attrs"
    label="Connected"
    hide-details
    color="accent"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'ConnectionSwitch',
}
</script>

<style scoped></style>
