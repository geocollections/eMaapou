<template>
  <search>
    <template #title>
      <base-header
        :title="$t('photo.pageTitle')"
        :icon="icons.mdiFileImageOutline"
      />
    </template>

    <template #form>
      <search-form-photo
        :markers="mapMarkers"
        @update="handleFormUpdate"
        @reset="handleFormReset"
      />
    </template>

    <template #result>
      <div class="py-1 pl-2 text-h6">
        {{ count ? $tc('common.count', count) : '&nbsp;' }}
      </div>
      <v-card class="mt-0">
        <v-radio-group
          v-model="currentView"
          row
          dense
          hide-details
          class="mt-0 px-4 pt-3 pb-2"
          mandatory
        >
          <v-radio
            v-for="entity in listOfViews"
            :key="entity"
            class="montserrat"
            :label="$t(`common.${entity}`)"
            :value="entity"
            color="header"
          ></v-radio>
        </v-radio-group>

        <data-table-photo
          v-if="currentView === 'table'"
          flat
          :show-search="false"
          :items="items"
          :count="count"
          :options="options"
          dynamic-headers
          stateful-headers
          :is-loading="$fetchState.pending"
          @update="handleDataTableUpdate"
        />

        <image-view
          v-if="currentView === 'image'"
          :items="items"
          :count="count"
          :options="options"
          @update="handleDataTableUpdate"
        />

        <gallery-view
          v-if="currentView === 'gallery'"
          :items="items"
          :count="count"
          :options="options"
          @update="handleDataTableUpdate"
        />
      </v-card>
    </template>
  </search>
</template>

<script lang="ts">
import { mdiFileImageOutline } from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import isEqual from 'lodash/isEqual'
import BaseHeader from '~/components/base/BaseHeader.vue'
import Search from '~/templates/Search.vue'
import SearchFormPhoto from '~/components/search/forms/SearchFormPhoto.vue'
import DataTablePhoto from '~/components/data-table/DataTablePhoto.vue'
import ImageView from '~/components/ImageView.vue'
import GalleryView from '~/components/GalleryView.vue'
import getQueryParams from '~/utils/getQueryParams'
import parseQueryParams from '~/utils/parseQueryParams'
const qParamKey = 'photoQ'
export default Vue.extend({
  components: {
    GalleryView,
    ImageView,
    DataTablePhoto,
    SearchFormPhoto,
    Search,
    BaseHeader,
  },
  async fetch() {
    await this.searchImages(this.options)
  },
  head(): MetaInfo {
    return {
      title: this.$t('photo.pageTitle') as string,
      meta: [
        {
          property: 'og:title',
          hid: 'og:title',
          content: this.$t('photo.pageTitle') as string,
        },
        {
          property: 'og:url',
          hid: 'og:url',
          content: this.$route.path,
        },
      ],
    }
  },
  computed: {
    ...mapState('settings', ['listOfViews']),
    ...mapFields('search/image', {
      currentView: 'currentView',
      options: 'options',
      query: 'query',
      items: 'items',
      count: 'count',
      locality: 'filters.byIds.locality.value',
      people: 'filters.byIds.people.value',
      tags: 'filters.byIds.tags.value',
      country: 'filters.byIds.country.value',
      dateLookUpType: 'filters.byIds.date.lookUpType',
      date: 'filters.byIds.date.value',
      dateFree: 'filters.byIds.dateFree.value',
      imageNumber: 'filters.byIds.imageNumber.value',
      author: 'filters.byIds.author.value',
      imageSize: 'filters.byIds.imageSize.value',
    }),
    ...mapFields('search', {
      geoJSON: 'globalFilters.byIds.geoJSON.value',
      institutions: 'globalFilters.byIds.institutions.value',
    }),
    icons(): any {
      return {
        mdiFileImageOutline,
      }
    },
    mapMarkers(): any {
      if (this.items?.length > 0) {
        return this.items.reduce((filtered: any[], item: any) => {
          if (
            (item.latitude && item.longitude) ||
            (item.image_latitude && item.image_latitude)
          ) {
            const newItem = {
              latitude: item.image_latitude ?? item.latitude,
              longitude: item.image_longitude ?? item.longitude,
              text:
                (this.$translate({
                  et: item.locality,
                  en: item.locality_en,
                }) ||
                  item.image_object) ??
                `ID: ${item.id}`,
              routeName: item.locality_id ? 'locality' : 'photo',
              id: item.locality_id ?? item.id,
            }

            const isItemInArray = !!filtered.find(
              (existingItem) =>
                existingItem.latitude === newItem.latitude &&
                existingItem.longitude === newItem.longitude
            )
            if (!isItemInArray) filtered.push(newItem)
          }
          return filtered
        }, [])
      }
      return []
    },
    queryParams(): { [K: string]: any } {
      return getQueryParams({
        q: { key: qParamKey, value: this.$accessor.search.image.query },
        filters: this.$accessor.search.image.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        tableOptions: this.options,
      })
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        await this.$accessor.search.image.resetFilters()
        this.setStateFromQueryParams()
        this.$fetch()
      },
    },
  },
  created() {
    // Add global filters and table options to query params, if they are missing
    const query = getQueryParams({
      globalFilters: this.$accessor.search.globalFilters.byIds,
      // @ts-ignore
      tableOptions: this.options,
    })
    if (!isEqual({ ...query, ...this.$route.query }, this.$route.query))
      this.$router.replace({ query: { ...query, ...this.$route.query } })

    this.setStateFromQueryParams()
  },
  methods: {
    ...mapActions('search/image', ['searchImages']),
    setStateFromQueryParams() {
      const parsedValues = parseQueryParams({
        route: this.$route,
        filters: this.$accessor.search.image.filters.byIds,
        globalFilters: this.$accessor.search.globalFilters.byIds,
        qKey: qParamKey,
      })
      this.query = parsedValues.query
      if (parsedValues.filters) {
        Object.keys(parsedValues.filters).forEach((key) => {
          // @ts-ignore
          this[key] = parsedValues.filters?.[key]
        })
      }
      if (parsedValues.globalFilters) {
        Object.keys(parsedValues.globalFilters).forEach((key) => {
          // @ts-ignore
          this[key] = parsedValues.globalFilters?.[key]
        })
      }
      this.options = {
        ...this.options,
        ...parsedValues.options,
      }
    },
    async handleFormReset() {
      this.options.page = 1

      if (!isEqual({}, this.$route.query)) {
        // NOTE: https://github.com/nuxt/nuxt.js/issues/6951#issuecomment-904655674
        await new Promise((resolve, reject) =>
          this.$router.push({ query: {} }, resolve, reject)
        )
      }
      await this.$accessor.search.image.resetFilters()
      this.$fetch()
    },
    async handleFormUpdate() {
      this.options.page = 1

      if (!isEqual(this.queryParams, this.$route.query)) {
        await new Promise((resolve, reject) =>
          this.$router.push({ query: this.queryParams }, resolve, reject)
        )
      }
      this.$fetch()
    },
    async handleDataTableUpdate(tableState: any) {
      this.options = tableState.options
      if (!isEqual(this.queryParams, this.$route.query)) {
        await new Promise((resolve, reject) =>
          this.$router.push({ query: this.queryParams }, resolve, reject)
        )
      }
      this.$fetch()
    },
  },
})
</script>
