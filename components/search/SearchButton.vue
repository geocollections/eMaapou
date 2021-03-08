<template>
  <v-btn class="my-2" color="primary" dark @click="$emit('click')">
    <v-icon class="pr-2">mdi-magnify</v-icon>
    {{ $t('common.searchCommand') }}
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
