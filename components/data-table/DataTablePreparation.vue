<script setup lang="ts">
const emit = defineEmits(["click:row"]);
const localePath = useLocalePath();
const { $translate } = useNuxtApp();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.preparation_number="{ item, index }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'preparation-id', params: { id: item.id } })"
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.preparation_number }}
      </NuxtLink>
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
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
      </NuxtLink>
    </template>
    <template #item.depthFrom="{ item }">
      <span v-if="item.depth">
        {{
          item.depth.toFixed(2)
        }}
      </span>
    </template>
    <template #item.depthTo="{ item }">
      <span v-if="item.depth_interval">
        {{
          item.depth_interval.toFixed(2)
        }}
      </span>
    </template>
    <template #item.stratigraphy="{ item }">
      <span v-if="item.stratigraphy_id || item.lithostratigraphy_id">
        <NuxtLink
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
        </NuxtLink>

        <span v-if="item.lithostratigraphy_id"> | </span>
        <NuxtLink
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
        </NuxtLink>
      </span>
    </template>
    <template #item.mass="{ item }">
      <span v-if="item.mass">
        {{
          item.mass.toFixed(1)
        }}
      </span>
    </template>
  </BaseDataTable>
</template>
