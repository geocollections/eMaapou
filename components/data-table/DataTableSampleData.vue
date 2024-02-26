<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.sample="{ item }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number }}
      </NuxtLink>
    </template>
    <template #item.number="{ item }">
      <NuxtLink
        v-if="item.number"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.id } })"
      >
        {{ item.number }}
      </NuxtLink>
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
        v-if="item.locality_id"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality_id } })
        "
      >
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </NuxtLink>
      <NuxtLink
        v-else-if="item.site_id"
        class="text-link"
        :to="localePath({ name: 'site-id', params: { id: item.site_id } })"
      >
        {{ item.site }}
      </NuxtLink>
    </template>
    <template #item.stratigraphy="{ item }">
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
    </template>
    <template #item.lithostratigraphy="{ item }">
      <NuxtLink
        v-if="item.lithostratigraphy"
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
    </template>
    <template #item.date_collected="{ item }">
      {{ item.date_collected ? $formatDate(item.date_collected) : null }}
    </template>
  </BaseDataTable>
</template>
