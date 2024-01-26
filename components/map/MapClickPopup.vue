<template>
  <l-popup :options="{ minWidth: 175 }">
    <div style="max-height: 200px; overflow: auto">
      <v-table
        density="compact"
        :fixed-header="featuresLength > 3"
        :height="featuresLength > 3 ? 200 : 'unset'"
      >
        <template #default>
          <thead>
            <tr>
              <th>{{ $t("map.name") }}</th>
              <!--              <th>{{ $t('map.relatedRecords') }}</th>-->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in features" :key="index">
              <td>
                <nuxt-link
                  class="text-link"
                  :to="
                    localePath({
                      name: `${item.properties.table}-id`,
                      params: { id: item.properties.object_id },
                    })
                  "
                >
                  {{
                    $translate({
                      et: item.properties.locality || item.properties.name,
                      en:
                        item.properties.locality_en || item.properties.name_en,
                    })
                  }}
                </nuxt-link>
              </td>
              <!--              <td>{{ item.properties.total_related_records }}</td>-->
            </tr>
          </tbody>
        </template>
      </v-table>
    </div>
  </l-popup>
</template>

<script setup lang="ts">
import { LPopup } from "@vue-leaflet/vue-leaflet";
const props = defineProps({
  response: {
    type: Object,
    required: false,
    default: () => {},
  },
});

const features = computed(() => {
  return props.response?.features ?? [];
});
const featuresLength = computed(() => {
  return props.response?.features?.length ?? 0;
});
const localePath = useLocalePath();
</script>
