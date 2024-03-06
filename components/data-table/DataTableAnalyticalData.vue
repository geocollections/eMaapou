<script setup lang="ts">
const emit = defineEmits(["click:row"]);

const localePath = useLocalePath();

function formatDepthRange({
  depthFrom,
  depthTo,
}: {
  depthFrom?: number;
  depthTo?: number;
}) {
  if (!depthFrom)
    return depthTo?.toFixed(2);

  if (!depthTo)
    return depthFrom.toFixed(2);

  if (depthFrom === depthTo)
    return depthFrom.toFixed(2);

  return `${depthFrom.toFixed(2)} – ${depthTo.toFixed(2)}`;
}
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.depth="{ item }">
      <span
        style="font-family: monospace"
      >
        {{
          formatDepthRange({
            depthFrom: item.depth,
            depthTo: item.depth_interval,
          })
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
        @click.native="$openGeology('reference', item.reference_id)"
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
        {{ item.dataset_id }}
      </NuxtLink>
    </template>
    <template #item.analysis_id="{ item, index }">
      <NuxtLink
        v-if="item.analysis_id"
        class="text-link"
        :to="
          localePath({ name: 'analysis-id', params: { id: item.analysis_id } })
        "
        @click="emit('click:row', { index, id: item.id })"
      >
        {{ item.analysis_id }}
      </NuxtLink>
    </template>
  </BaseDataTable>
</template>
