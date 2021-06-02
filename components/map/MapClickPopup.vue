<template>
  <l-popup :options="{ minWidth: 175 }">
    <div v-if="response" style="max-height: 200px; overflow: auto">
      <v-simple-table
        dense
        :fixed-header="response.features.length > 3"
        :height="response.features.length > 3 ? 200 : 'unset'"
      >
        <template #default>
          <thead>
            <tr>
              <th>{{ $t('map.name') }}</th>
              <th>{{ $t('map.relatedRecords') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in response.features" :key="index">
              <td>
                <div v-if="buildRouteObject(item)">
                  <nuxt-link
                    class="text-link"
                    :to="localePath(buildRouteObject(item))"
                  >
                    {{
                      $translate({
                        et: item.properties.locality || item.properties.name,
                        en:
                          item.properties.locality_en ||
                          item.properties.name_en,
                      })
                    }}
                  </nuxt-link>
                </div>
                <div v-else>
                  {{
                    $translate({
                      et: item.properties.locality || item.properties.name,
                      en:
                        item.properties.locality_en || item.properties.name_en,
                    })
                  }}
                </div>
              </td>
              <td>{{ item.properties.total_related_records }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div v-else class="text-center">{{ $t('map.noResults') }}</div>
  </l-popup>
</template>

<script>
export default {
  name: 'MapClickPopup',
  props: {
    response: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
    buildRouteObject(item) {
      // { name: 'locality-id', params: { id: item.id } }
      // Todo: Backend should return 'table' and 'object_id'
      const url = item.properties.url
      if (url.includes('/')) {
        const splitUrl = url.split('/')
        if (splitUrl.length >= 2) {
          const object = splitUrl[splitUrl.length - 2]
          const id = splitUrl[splitUrl.length - 1]
          if (object && id) return { name: `${object}-id`, params: { id } }
        }
      }
      return false
    },
  },
}
</script>
