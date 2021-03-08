<template>
  <v-btn
    icon
    small
    outlined
    tile
    color="red"
    class="pa-0 reset-search"
    @click="$emit('click')"
  >
    <v-icon>mdi-delete-outline</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'ResetSearchButton',
}
</script>
