<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.analysis="{ item }">
      <NuxtLink
        class="text-link"
        :to="localePath({ name: 'analysis-id', params: { id: item.id } })"
      >
        {{ item.id }}
      </NuxtLink>
    </template>
    <template #item.sample="{ item }">
      <NuxtLink
        v-if="item.sample_id"
        class="text-link"
        :to="
          localePath({
            name: 'sample-id',
            params: { id: item.sample_id },
          })
        "
      >
        {{ item.sample_id }}
      </NuxtLink>
    </template>
    <template #item.locality="{ item }">
      <NuxtLink
        v-if="item.locality_id"
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
        {{ $translate({ et: item.stratigraphy, en: item.stratigraphy_en }) }}
      </NuxtLink>
    </template>

    <template #item.analysis_method="{ item }">
      {{
        $translate({ et: item.analysis_method, en: item.analysis_method_en })
      }}
    </template>
    <template #item.lab="{ item }">
      {{ $translate({ et: item.lab, en: item.lab_en }) }}
    </template>
  </BaseDataTable>
</template>
