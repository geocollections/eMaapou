<script setup lang="ts">
import round from "lodash/round";
import type { Header } from "~/constants";

const props = withDefaults(
  defineProps<{
    hideDepth?: boolean;
    hideLocality?: boolean;
    hideSample?: boolean;
  }>(),
  {
    hideDepth: false,
    hideLocality: false,
    hideSample: false,
  },
);

const emit = defineEmits<{
  "click:row": [payload: { index: number; id: string }];
}>();

const localePath = useLocalePath();
const attrs = useAttrs();
const filteredHeaders = computed(() => {
  return (attrs.headers as Header[]).filter((item: Header) => {
    if (typeof item.value === "string" && item.value.includes("depth"))
      return !props.hideDepth;
    else if (item.value === "locality")
      return !props.hideLocality;
    else if (item.value === "sample_number")
      return !props.hideSample;
    else return item;
  });
});
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable
    v-bind="$attrs"
    :headers="filteredHeaders"
    :item-to="(item) => localePath({ name: 'analysis-id', params: { id: item.id } })"
    @click:row="emit('click:row', $event)"
  >
    <template #item.id="{ item }">
      {{ item.id }}
    </template>
    <template #item.sample_name="{ item }">
      <NuxtLink
        v-if="item.sample_id"
        class="text-link"
        :to="localePath({ name: 'sample-id', params: { id: item.sample_id } })"
      >
        {{ item.sample_name }}
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
        {{ $translate({ et: item.name, en: item.name_en }) }}
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
    <template #item.thickness="{ item }">
      {{
        !item.depth_interval || !item.depth
          ? null
          : round(item.depth_interval - item.depth, 3)
      }}
    </template>
    <template #item.method="{ item }">
      {{
        $translate({
          et: item.analysis_method,
          en: item.analysis_method_en,
        })
      }}
    </template>
    <template #item.method_details="{ item }">
      {{
        $translate({
          et: item.method_details,
          en: item.method_details_en,
        })
      }}
    </template>
    <template #item.date="{ item }">
      <div v-if="item.date">
        {{ item.date ? $formatDate(item.date) : null }}
      </div>
      <div v-else>
        {{ item.date_free }}
      </div>
    </template>
  </BaseDataTable>
</template>
