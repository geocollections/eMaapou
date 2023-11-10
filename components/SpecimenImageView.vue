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
      <v-col class="d-flex justify-end">
        <base-data-table-pagination
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
    <v-card flat>
      <v-row v-if="count > 0" no-gutters class="px-2">
        <v-col
          v-for="(image, index) in items"
          :key="index"
          class="pt-0 px-2 pb-4"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <nuxt-link
            class="text-link"
            :to="
              localePath({
                name: 'specimen-id',
                params: { id: image.specimen_id },
              })
            "
          >
            {{ image.specimen_full_name }}
          </nuxt-link>
          <v-tooltip bottom color="header" z-index="51000" max-width="250">
            <template #activator="{ on }">
              <v-card
                flat
                class="d-flex image-hover"
                color="transparent"
                hover
                nuxt
                :to="localePath({ name: 'file-id', params: { id: image.id } })"
                :class="{ 'elevation-2 image-hover-elevation': !!cropImages }"
                v-on="on"
              >
                <v-img
                  v-if="image.image"
                  max-height="400"
                  min-width="72"
                  :contain="!cropImages"
                  aspect-ratio="1"
                  :lazy-src="
                    $img(
                      `${image.image}`,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
                  :src="
                    $img(
                      `${image.image}`,
                      { size: 'small' },
                      { provider: 'geocollections' }
                    )
                  "
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
                      />
                    </v-row>
                  </template>
                </v-img>

                <v-row v-else align="center">
                  <v-col class="text-center">
                    <div class="py-3">
                      <v-icon style="font-size: 6rem" class="grey--text">
                        {{ mdiFileImageOutline }}
                      </v-icon>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </template>

            <span>
              <b>{{ $t('photo.id') }}: </b> {{ image.id }}<br />
              <span v-if="image.date_created || image.date_created_free">
                <b>{{ $t('photo.date') }}: </b>
                <span v-if="image.date_created">{{
                  image.date_created.split('T')[0]
                }}</span>
                <span v-else>{{ image.date_created_free }}</span>
                <br />
              </span>
              <span v-if="image.agent || image.author_free">
                <b>{{ $t('photo.author') }}: </b
                >{{ image.agent || image.author_free }}
                <br />
              </span>
              <span v-if="image.image_number">
                <b>{{ $t('photo.number') }}: </b>
                {{ image.image_number }}
                <br />
              </span>
            </span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { mdiFileImageOutline } from '@mdi/js'
import BaseDataTablePagination from '~/components/base/BaseDataTablePagination.vue'
export default {
  name: 'SpecimenImageView',
  components: { BaseDataTablePagination },
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
    icons() {
      return {
        mdiFileImageOutline,
      }
    },
  },
  methods: {
    updateOptions(event) {
      this.$emit('update', { options: event })
    },
  },
}
</script>
