<template>
  <v-row>
    <v-col>
      <h1 class="text-center py-3 page-title">
        {{ $t('drillcoreBox.nr', { number: drillcoreBox.number }) }}
      </h1>
      <div class="d-flex justify-space-between">
        <nuxt-link
          class="text-link"
          :to="`/drillcore_box/${parseInt($route.params.id) - 1}`"
        >
          {{ $t('common.previous') }}
        </nuxt-link>

        <nuxt-link
          class="text-link"
          :to="`/drillcore_box/${parseInt($route.params.id) + 1}`"
        >
          {{ $t('common.next') }}
        </nuxt-link>
      </div>
      <v-card>
        <v-card-title>{{ $t('common.general') }}</v-card-title>
        <v-card-text>
          <v-simple-table class="custom-table">
            <template #default>
              <tbody>
                <tr>
                  <td>{{ $t('drillcoreBox.id') }}</td>
                  <td>{{ drillcoreBox.id }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.depthStart') }}</td>
                  <td>{{ drillcoreBox.depth_start }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.depthEnd') }}</td>
                  <td>{{ drillcoreBox.depth_end }}</td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.stratigraphyTop') }}</td>
                  <td>
                    <a
                      class="text-link"
                      :href="`https://geocollections.info/stratigraphy/${drillcoreBox.stratigraphy_top_id}`"
                    >
                      {{
                        $translate({
                          et: drillcoreBox.stratigraphy_top__stratigraphy,
                          en: drillcoreBox.stratigraphy_top__stratigraphy_en,
                        })
                      }}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.stratigraphyBase') }}</td>
                  <td>
                    <a
                      class="text-link"
                      :href="`https://geocollections.info/stratigraphy/${drillcoreBox.stratigraphy_base_id}`"
                    >
                      {{
                        $translate({
                          et: drillcoreBox.stratigraphy_base__stratigraphy,
                          en: drillcoreBox.stratigraphy_base__stratigraphy_en,
                        })
                      }}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('drillcoreBox.drillcore') }}</td>
                  <td>
                    <nuxt-link
                      class="text-link"
                      :to="`/drillcore/${drillcoreBox.drillcore__id}`"
                      >{{
                        $translate({
                          et: drillcoreBox.drillcore__drillcore,
                          en: drillcoreBox.drillcore__drillcore_en,
                        })
                      }}</nuxt-link
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="mt-2">
        <v-card-title>{{ $t('common.pictures') }}</v-card-title>
        <v-card-text>
          <v-img
            contain
            class="ma-4"
            max-height="400"
            :lazy-src="`https://files.geocollections.info/small/${drillcoreBox.drillcorebox_image__attachment__uuid_filename}`"
            :src="`https://files.geocollections.info/medium/${drillcoreBox.drillcorebox_image__attachment__uuid_filename}`"
          />
          <div class="text-center">
            <a
              class="text-link"
              :href="`https://files.geocollections.info/small/${drillcoreBox.drillcorebox_image__attachment__uuid_filename}`"
              >small</a
            >
            |
            <a
              class="text-link"
              :href="`https://files.geocollections.info/medium/${drillcoreBox.drillcorebox_image__attachment__uuid_filename}`"
              >medium</a
            >
            |
            <a
              class="text-link"
              :href="`https://files.geocollections.info/large/${drillcoreBox.drillcorebox_image__attachment__uuid_filename}`"
              >large</a
            >
            |
            <a
              class="text-link"
              :href="`https://files.geocollections.info/${drillcoreBox.drillcorebox_image__attachment__uuid_filename}`"
              >original</a
            >
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const drillcoreBoxResponse = await $axios.$get(
      `https://api.geocollections.info/drillcore_box/${params.id}`
    )

    const drillcoreBox = drillcoreBoxResponse.results[0]
    return { drillcoreBox }
  },
  head() {
    return {
      title: `${this.$t('drillcoreBox.nr', {
        number: this.drillcoreBox.number,
      })} | ${this.$translate({
        et: this.drillcoreBox.drillcore__drillcore,
        en: this.drillcoreBox.drillcore__drillcore_en,
      })}`,
    }
  },
}
</script>
