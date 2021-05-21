<template>
  <v-card v-if="items && items.length > 0" flat>
    <pagination
      v-if="count > 10"
      :paginate-by="options.itemsPerPage"
      :page="options.page"
      :count="count"
      @update:paginateBy="updatePaginateBy($event)"
      @update:page="updatePage($event)"
    />

    <v-card flat>
      <div class="px-4">
        <v-carousel
          v-model="activeIndex"
          style="max-width: 1000px"
          :height="carouselHeight"
          hide-delimiters
          hide-delimiter-background
          class="rounded mx-auto gallery__v-carousel"
        >
          <v-carousel-item
            v-for="(item, index) in items"
            :key="index"
            nuxt
            :to="localePath({ name: 'photo-id', params: { id: item.id } })"
            :src="`https://files.geocollections.info/medium/${item.uuid_filename}`"
          />
        </v-carousel>

        <div
          class="mt-2 mx-2 d-flex justify-center flex-column justify-sm-space-between flex-sm-row mx-auto"
          style="max-width: 1000px"
        >
          <div class="text-center text-sm-left">
            <div
              v-if="items[activeIndex].agent || items[activeIndex].author_free"
            >
              <b>{{ $t('photo.author') }}: </b
              >{{ items[activeIndex].agent || items[activeIndex].author_free }}
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
              </a>
              <span v-if="index < imageSizes.length - 1">| </span>
            </span>
          </div>
        </div>

        <v-card-text v-if="items && items.length > 1" class="px-0 pt-0">
          <div class="d-flex align-center" style="overflow-x: auto">
            <div v-for="(item, index) in items" :key="index" class="my-2 mr-4">
              <v-hover v-slot="{ hover }">
                <v-img
                  :src="`https://files.geocollections.info/small/${item.uuid_filename}`"
                  :lazy-src="`https://files.geocollections.info/small/${item.uuid_filename}`"
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
        </v-card-text>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import Pagination from '~/components/Pagination'
export default {
  name: 'GalleryViewWrapper',
  components: { Pagination },
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
    }
  },
  computed: {
    carouselHeight() {
      if (this.$vuetify.breakpoint.xsOnly) return '35vh'
      else if (this.$vuetify.breakpoint.smOnly) return '40vh'
      else return '600px'
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
    updatePaginateBy(paginateBy) {
      this.$emit('update', {
        options: {
          ...this.options,
          itemsPerPage: paginateBy,
          page: 1,
        },
      })
    },

    updatePage(page) {
      this.$emit('update', { options: { ...this.options, page } })
    },

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
