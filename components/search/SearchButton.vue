<template>
  <v-btn type="submit" class="my-2" color="primary" dark>
    <v-icon class="pr-2">mdi-magnify</v-icon>
    {{ $t('common.searchCommand') }}
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
