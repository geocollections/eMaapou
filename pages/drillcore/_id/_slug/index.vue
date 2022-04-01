<template>
  <div class="px-3">
    <v-row>
      <v-col>
        <!-- HACK: Should make infinite loader wrapper -->
        <v-text-field
          v-model="search"
          class="ma-4"
          append-icon="mdi-magnify"
          :label="$t('common.search')"
          single-line
          hide-details
          clearable
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(box, i) in boxes" :key="box.id" cols="12" class="pa-0">
        <v-divider v-if="i !== 0" />
        <v-hover v-slot="{ hover }">
          <v-card
            flat
            tile
            :ripple="false"
            @click="
              $openNuxtWindow('drillcore-box-id', { id: box.drillcore_box.id })
            "
          >
            <v-card-text class="drillcore-box__card">
              <v-row v-if="box.drillcore_box" align="start">
                <v-col cols="12" sm="8" align-self="center">
                  <!-- TODO: #74 Add placeholder, for case when box does not have a picture -->
                  <client-only>
                    <v-img
                      class="mx-auto rounded transition-swing"
                      :class="{
                        'elevation-5': hover,
                        'elevation-2': !hover,
                      }"
                      contain
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
                  <base-table v-if="boxHasInfo(box)">
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
      <v-col>
        <client-only>
          <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
            <template #spinner>
              <v-progress-circular color="primary darken-2" indeterminate />
            </template>
            <template #no-more>{{ $t('infinite.noMore') }}</template>
            <template #error="{ trigger }">
              <div>
                {{ $t('infinite.error') }}
              </div>
              <br />
              <v-btn outlined color="primary darken-2" @click="trigger">
                {{ $t('infinite.retry') }}
              </v-btn>
            </template>
          </infinite-loading>
        </client-only>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import isNull from 'lodash/isNull'
import debounce from 'lodash/debounce'
import TableRow from '~/components/table/TableRow.vue'
import TableRowLink from '~/components/table/TableRowLink.vue'
import { HEADERS_ATTACHMENT } from '~/constants'
import BaseTable from '~/components/base/BaseTable.vue'

export default {
  components: { TableRow, TableRowLink, BaseTable },
  data() {
    return {
      page: 1,
      boxes: [],
      search: '',
      paginateBy: 5,
    }
  },
  methods: {
    isNull,
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
    infiniteHandler($state) {
      this.$services.sarvREST
        .getResourceList('attachment_link', {
          defaultParams: {
            ordering: 'drillcore_box__depth_start,drillcore_box',
            drillcore_box__drillcore: this.$route.params.id,
            attachment__is_preferred: true,
            nest: 2,
          },
          options: {
            page: this.page,
            itemsPerPage: this.paginateBy,
          },
          search: this.search,
          fields: this.$getAPIFieldValues(HEADERS_ATTACHMENT),
        })
        .then((res) => {
          if (!res.next) {
            this.boxes.push(...res.items)
            $state.loaded()
            $state.complete()
          } else {
            this.page += 1
            this.boxes.push(...res.items)
            $state.loaded()
          }
        })
        .catch(() => {
          $state.error()
        })
    },
    handleSearch: debounce(function () {
      this.boxes = []
      if (this.page !== 1) this.page = 1

      this.$refs.infiniteLoading.status = 1
      this.$refs.infiniteLoading.$emit(
        'infinite',
        this.$refs.infiniteLoading.stateChanger
      )
    }, 500),
  },
}
</script>
