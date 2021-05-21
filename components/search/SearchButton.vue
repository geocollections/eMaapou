<template>
  <v-btn type="submit" color="header" dark class="px-3">
    {{ $t('common.searchCommand') }}
    <v-icon right>mdi-magnify</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
