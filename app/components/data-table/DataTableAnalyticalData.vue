<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => localePath({ name: 'analysis-id', params: { id: item.id } })"
  >
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
    <template #item.analysis_method="{ item }">
      {{
        $translate({ et: item.analysis_method, en: item.analysis_method_en })
      }}
    </template>
    <template #item.sample_number="{ item }">
      <NuxtLink
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_number || item.sample_id }}
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
        v-if="item.lithostratigraphy_id"
        class="text-link font-italic"
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
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference_id"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference }}
      </BaseLinkExternal>
      <div v-else>
        {{ item.reference_str }}
      </div>
    </template>
    <template #item.dataset_id="{ item }">
      <NuxtLink
        v-if="item.dataset_id"
        class="text-link"
        :to="
          localePath({ name: 'dataset-id', params: { id: item.dataset_id } })
        "
      >
        {{ item.dataset_name }}
      </NuxtLink>
    </template>
    <template #item.analysis_id="{ item }">
      {{ item.analysis_id }}
    </template>
  </BaseDataTable>
</template>
