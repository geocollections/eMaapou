<template>
  <v-btn
    type="submit"
    color="warning"
    dark
    class="px-3 text-body-1 text-capitalize"
  >
    <v-icon left>mdi-magnify</v-icon>
    <div class="montserrat">
      {{ $t('common.searchCommand') }}
    </div>
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
