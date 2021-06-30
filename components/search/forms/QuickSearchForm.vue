<template>
  <v-form
    class="d-sm-flex text-right text-sm-center"
    @submit.prevent="$emit('submit')"
  >
    <global-search :icon-button="onlyIcon" show-button />
    <v-btn
      height="48px"
      class="ml-3 mt-2 mt-sm-0"
      type="submit"
      color="warning"
      dark
    >
      <v-icon>mdi-magnify</v-icon>
      <div class="pl-2 montserrat">
        {{ $t('common.searchCommand') }}
      </div>
    </v-btn>
  </v-form>
</template>
<script>
import GlobalSearch from '~/components/search/GlobalSearch.vue'

export default {
  name: 'QuickSearchForm',
  components: { GlobalSearch },
  props: {
    onlyIcon: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
