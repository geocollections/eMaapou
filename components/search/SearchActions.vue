<template>
  <v-card flat tile color="transparent">
    <v-card-title class="pl-2 py-1 montserrat">
      <div>
        {{ $t('common.showSearch') }}
      </div>
    </v-card-title>
    <global-search />
    <div class="mt-2 d-flex justify-end align-center">
      <reset-search-button @click="$emit('click')" />
      <search-button />
    </div>
  </v-card>
</template>

<script>
import GlobalSearch from '~/components/search/GlobalSearch.vue'
import ResetSearchButton from '~/components/search/ResetSearchButton.vue'
import SearchButton from '~/components/search/SearchButton.vue'

export default {
  name: 'SearchActions',
  components: {
    GlobalSearch,
    ResetSearchButton,
    SearchButton,
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
}
</script>
