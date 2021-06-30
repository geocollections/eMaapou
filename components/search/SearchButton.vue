<template>
  <v-btn type="submit" color="warning" dark class="px-3 montserrat">
    {{ $t('common.searchCommand') }}
    <v-icon right>mdi-magnify</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
