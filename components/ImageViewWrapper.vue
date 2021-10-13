<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col cols="12" sm="auto" class="px-3 my-1 my-sm-4" align-self="center">
        <v-switch
          v-model="cropImages"
          dense
          class="mt-0 montserrat"
          hide-details
          color="header"
          :label="$t('common.containImages')"
        />
      </v-col>
      <v-col>
        <pagination-controls
          :options="options"
          :pagination="pagination"
          :items-per-page-options="footerProps['items-per-page-options']"
          :items-per-page-text="footerProps['items-per-page-text']"
          :page-select-text="
            $t('common.pageSelect', {
              current: options.page,
              count: pagination.pageCount,
            })
          "
          :go-to-text="$t('common.goTo')"
          :go-to-button-text="$t('common.goToBtn')"
          select-page-id="header-select-btn"
          @update:options="updateOptions"
        />
      </v-col>
    </v-row>

    <image-view :count="count" :items="items" :contain-images="!cropImages" />
  </v-card>
</template>

<script>
import ImageView from '~/components/ImageView.vue'
import PaginationControls from '~/components/tables/controls/PaginationControls.vue'
export default {
  name: 'ImageViewWrapper',
  components: { ImageView, PaginationControls },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        page: 1,
        itemsPerPage: 25,
      }),
    },
  },
  data() {
    return {
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
      cropImages: true,
    }
  },
  computed: {
    pagination() {
      return { pageCount: Math.ceil(this.count / this.options.itemsPerPage) }
    },
  },
  created() {
    this.$emit('update', { options: { ...this.options } })
  },
  methods: {
    updateOptions(event) {
      this.$emit('update', { options: event })
    },
  },
}
</script>

<style scoped></style>
