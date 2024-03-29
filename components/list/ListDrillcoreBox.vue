<template>
  <div>
    <v-row class="py-2" no-gutters>
      <v-col
        v-if="showSearch"
        align-self="center"
        cols="12"
        sm="4"
        class="px-3"
      >
        <v-text-field
          v-model="search"
          class="pt-0 mt-0"
          color="primary darken-2"
          :append-icon="icons.mdiMagnify"
          :label="$t('common.search')"
          single-line
          hide-details
          clearable
          @input="handleSearch"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex justify-end" align-self="center">
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
          @update:options="handleChange"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        v-for="box in items"
        :key="box.id"
        cols="12"
        class="pa-0 drillcore-box"
      >
        <v-divider />
        <v-hover v-slot="{ hover }">
          <v-card
            flat
            tile
            :ripple="false"
            @click="
              $openNuxtWindow(
                localeLocation({
                  name: 'drillcore-box-id',
                  params: { id: box.drillcore_box.id },
                })
              )
            "
          >
            <v-card-text class="drillcore-box__card">
              <v-row v-if="box.drillcore_box" align="start">
                <v-col cols="12" sm="8" align-self="center">
                  <client-only>
                    <v-img
                      class="mx-auto rounded transition-swing"
                      :class="{
                        'elevation-2': hover,
                        'elevation-0': !hover,
                      }"
                      max-width="1000"
                      max-height="800"
                      eager
                      :lazy-src="
                        $img(
                          box.attachment.filename,
                          { size: 'small' },
                          { provider: 'geocollections' }
                        )
                      "
                      :src="
                        $img(
                          box.attachment.filename,
                          { size: 'medium' },
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
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </client-only>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card-title class="px-0 pt-0 montserrat">
                    {{
                      $t('drillcoreBox.nr', {
                        number: box.drillcore_box.number,
                      })
                    }}
                  </v-card-title>
                  <base-table
                    v-if="boxHasInfo(box)"
                    class="transition-swing"
                    :class="{
                      'elevation-2': hover,
                      'elevation-0': !hover,
                    }"
                    :style="{
                      'background-color': hover ? 'white' : 'transparent',
                    }"
                  >
                    <table-row
                      :title="$t('drillcoreBox.depthStart')"
                      :value="box.drillcore_box.depth_start"
                    />
                    <table-row
                      :title="$t('drillcoreBox.depthEnd')"
                      :value="box.drillcore_box.depth_end"
                    />
                    <table-row-link
                      v-if="box.drillcore_box.stratigraphy_top"
                      :title="$t('drillcoreBox.stratigraphyTop')"
                      :value="
                        $translate({
                          et: box.drillcore_box.stratigraphy_top.stratigraphy,
                          en: box.drillcore_box.stratigraphy_top
                            .stratigraphy_en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'stratigraphy-id',
                          params: {
                            id: box.drillcore_box.stratigraphy_top.id,
                          },
                        })
                      "
                    />
                    <table-row-link
                      v-if="box.drillcore_box.stratigraphy_base"
                      :title="$t('drillcoreBox.stratigraphyBase')"
                      :value="
                        $translate({
                          et: box.drillcore_box.stratigraphy_base.stratigraphy,
                          en: box.drillcore_box.stratigraphy_base
                            .stratigraphy_en,
                        })
                      "
                      nuxt
                      :href="
                        localePath({
                          name: 'stratigraphy-id',
                          params: {
                            id: box.drillcore_box.stratigraphy_base.id,
                          },
                        })
                      "
                    />
                    <table-row
                      :title="$t('drillcoreBox.depthOther')"
                      :value="box.drillcore_box.depth_other"
                    />
                    <table-row
                      :title="$t('drillcoreBox.remarks')"
                      :value="box.drillcore_box.remarks"
                    />
                  </base-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mdiMagnify } from '@mdi/js'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import BaseDataTablePagination from '~/components/base/BaseDataTablePagination.vue'
export default {
  name: 'ListDrillcoreBox',
  components: { BaseDataTablePagination, TableRow, TableRowLink, BaseTable },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
    count: {
      type: Number,
      default: 0,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: '',
      isLoading: false,
      footerProps: {
        showFirstLastPage: true,
        'items-per-page-options': [10, 25, 50, 100, 250, 500, 1000],
        'items-per-page-text': this.$t('table.itemsPerPage'),
      },
    }
  },
  computed: {
    pagination() {
      return { pageCount: Math.ceil(this.count / this.options.itemsPerPage) }
    },
    icons() {
      return {
        mdiMagnify,
      }
    },
  },
  watch: {
    items() {
      this.isLoading = false
    },
  },
  methods: {
    boxHasInfo(box) {
      return (
        box.drillcore_box?.depth_start ||
        box.drillcore_box?.depth_end ||
        box.drillcore_box?.stratigraphy_top ||
        box.drillcore_box?.stratigraphy_base ||
        box.drillcore_box?.depth_other ||
        box.drillcore_box?.remarks
      )
    },
    handleChange: debounce(function (options) {
      this.$emit('update', { options, search: this.search })
    }, 250),
    handleSearch: debounce(function () {
      const options = { ...this.options, page: 1 }
      this.isLoading = true
      this.$emit('update', {
        options,
        search: this.search,
      })
    }, 400),
  },
}
</script>

<style scoped>
.drillcore-box:nth-of-type(odd) > .v-card > .drillcore-box__card {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
