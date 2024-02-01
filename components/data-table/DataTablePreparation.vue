<template>
  <base-data-table v-bind="$attrs">
    <template #item.preparation_number="{ item, index }">
      <nuxt-link
        class="text-link"
        :to="localePath({ name: 'preparation-id', params: { id: item.id } })"
        @click="emit('click:row', index)"
      >
        {{ item.preparation_number }}
      </nuxt-link>
    </template>
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality_en"
        class="text-link"
        :to="
          localePath({
            name: 'locality-id',
            params: { id: item.locality_id },
          })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </nuxt-link>
    </template>
    <template #item.depth="{ item }">
      <span>{{ item.depth }}</span>
    </template>
    <template #item.stratigraphy="{ item }">
      <span v-if="item.stratigraphy_id || item.lithostratigraphy_id">
        <nuxt-link
          v-if="item.stratigraphy_id"
          class="text-link"
          :to="
            localePath({
              name: 'stratigraphy-id',
              params: { id: item.stratigraphy_id },
            })
          "
        >
          {{
            $translate({
              et: item.stratigraphy,
              en: item.stratigraphy_en,
            })
          }}
        </nuxt-link>

        <span v-if="item.lithostratigraphy_id"> | </span>
        <nuxt-link
          v-if="item.lithostratigraphy_id"
          class="text-link"
          :to="
            localePath({
              name: 'stratigraphy-id',
              params: { id: item.lithostratigraphy_id },
            })
          "
        >
          {{
            $translate({
              et: item.lithostratigraphy,
              en: item.lithostratigraphy_en,
            })
          }}
        </nuxt-link>
      </span>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
const { $translate } = useNuxtApp();
</script>
