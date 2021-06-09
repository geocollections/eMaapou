<template>
  <v-btn type="submit" color="accent darken-1" dark class="px-3 montserrat">
    {{ $t('common.searchCommand') }}
    <v-icon right>mdi-magnify</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
