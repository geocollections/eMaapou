<template>
  <v-card v-if="items && items.length > 0" flat>
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

    <v-card flat>
      <div class="px-4">
        <v-card-text v-if="items && items.length > 1" class="px-0 pt-0">
          <div class="d-flex align-center" style="overflow-x: auto">
            <div v-for="(item, index) in items" :key="index" class="my-2 mx-2">
              <v-hover v-slot="{ hover }">
                <v-img
                  :src="
                    $img(
                      `${item.uuid_filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  :lazy-src="
                    $img(
                      `${item.uuid_filename}`,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  max-width="100"
                  min-width="72"
                  aspect-ratio="1"
                  :class="{
                    'elevation-4': hover,
                    'elevation-2': !hover,
                    'active-thumbnail': activeIndex === index,
                  }"
                  class="rounded transition-swing cursor-pointer"
                  @click="handleThumbnailClick(index)"
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-hover>
            </div>
          </div>
          <v-carousel
            v-model="activeIndex"
            style="max-width: 1000px"
            :height="carouselHeight"
            hide-delimiters
            hide-delimiter-background
            class="mt-2 rounded mx-auto gallery__v-carousel"
          >
            <v-carousel-item
              v-for="(item, index) in items"
              :key="index"
              nuxt
              :to="localePath({ name: 'photo-id', params: { id: item.id } })"
              :src="
                $img(
                  `${item.uuid_filename}`,
                  { size: 'medium' },
                  { provider: 'geocollections' }
                )
              "
            />
          </v-carousel>

          <div
            class="
              d-flex
              justify-center
              flex-column
              justify-sm-space-between
              flex-sm-row
            "
            style="max-width: 1000px; margin-left: auto; margin-right: auto"
          >
            <div class="text-center text-sm-left">
              <div
                v-if="
                  items[activeIndex].agent || items[activeIndex].author_free
                "
              >
                <b>{{ $t('photo.author') }}: </b
                >{{
                  items[activeIndex].agent || items[activeIndex].author_free
                }}
              </div>
              <div
                v-if="
                  items[activeIndex].date_created ||
                  items[activeIndex].date_created_free
                "
              >
                <b>{{ $t('photo.date') }}: </b>
                <span v-if="items[activeIndex].date_created">{{
                  items[activeIndex].date_created.split('T')[0]
                }}</span>
                <span v-else>{{ items[activeIndex].date_created_free }}</span>
              </div>
            </div>

            <div class="text-center">
              <span v-for="(size, index) in imageSizes" :key="index">
                <a
                  class="text-link"
                  @click="$openImage(items[activeIndex].uuid_filename, size)"
                >
                  {{ $t(`common.${size}`) }}
                  <v-icon
                    v-if="size === 'original'"
                    small
                    color="primary darken-2"
                    >mdi-file-download-outline</v-icon
                  >
                </a>
                <span v-if="index < imageSizes.length - 1">| </span>
              </span>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import PaginationControls from '~/components/tables/controls/PaginationControls.vue'

export default {
  name: 'GalleryViewWrapper',
  components: { PaginationControls },
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
      activeIndex: 0,
      imageSizes: ['small', 'medium', 'large', 'original'],
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
    }
  },
  computed: {
    carouselHeight() {
      if (this.$vuetify.breakpoint.xsOnly) return '35vh'
      else if (this.$vuetify.breakpoint.smOnly) return '40vh'
      else return '600px'
    },
    pagination() {
      return { pageCount: Math.ceil(this.count / this.options.itemsPerPage) }
    },
  },
  watch: {
    items() {
      this.activeIndex = 0
    },
  },
  created() {
    this.$emit('update', { options: { ...this.options } })
  },
  beforeMount() {
    window.addEventListener('keyup', this.handleKeyup)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleThumbnailClick(newIndex) {
      this.activeIndex = newIndex
    },

    handleKeyup(e) {
      if (this.items?.length > 0) {
        if (e.keyCode === 37) {
          // ArrowLeft
          if (this.activeIndex === 0) this.activeIndex = this.items.length - 1
          else this.activeIndex -= 1
        } else if (e.keyCode === 39) {
          // ArrowRight
          if (this.activeIndex === this.items.length - 1) this.activeIndex = 0
          else this.activeIndex += 1
        }
      }
    },
    updateOptions(event) {
      this.$emit('update', { options: event })
    },
  },
}
</script>

<style scoped lang="scss">
.active-thumbnail {
  /* elevation-4 */
  /*box-shadow: 0 2px 4px -1px rgba(1, 87, 155, 0.8),*/
  /*  0 4px 5px 0 rgba(1, 87, 155, 0.56), 0 1px 10px 0 rgba(1, 87, 155, 0.44) !important;*/

  box-shadow: 0 2px 4px -1px rgba(48, 145, 181, 0.8),
    0 2px 5px 0 rgba(48, 145, 181, 0.56), 0 1px 5px 0 rgba(48, 145, 181, 0.44) !important;

  /* elevation-2 */
  /*box-shadow: 0 3px 1px -2px rgba(62, 163, 202, 0.4),*/
  /*  0 2px 2px 0 rgba(62, 163, 202, 0.28), 0 1px 5px 0 rgba(62, 163, 202, 0.22) !important;*/
}

/* Overriding default 'cover' setting in order to correctly show portrait images */
.gallery__v-carousel >>> .v-carousel__item > .v-image__image--cover {
  background-size: contain;
}
</style>
