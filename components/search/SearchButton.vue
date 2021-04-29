<template>
  <v-btn type="submit" large color="primary darken-2" dark>
    <v-icon class="pr-2">mdi-magnify</v-icon>
    {{ $t('common.searchCommand') }}
  </v-btn>
</template>
<script>
export default {
  name: 'SearchButton',
}
</script>
