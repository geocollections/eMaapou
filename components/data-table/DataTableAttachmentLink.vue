<script setup lang="ts">
const localePath = useLocalePath();
const { $translate } = useNuxtApp();

const tableRouteNames = {
  specimen: "specimen-id",
  stratigraphy: "stratigraphy-id",
  locality: "locality-id",
  preparation: "preparation-id",
  sample: "sample-id",
  site: "site-id",
  drillcore: "drillcore-id",
  drillcore_box: "drillcore-box-id",
  analysis: "analysis-id",
};
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.name="{ item }">
      <NuxtLink
        class="text-link"
        :to="
          localePath({ name: tableRouteNames[item.table as keyof typeof tableRouteNames], params: { id: item.table_id } })
        "
      >
        <template v-if="item.is_i18n">
          {{
            $translate({
              et: item.name,
              en: item.name_en,
            })
          }}
        </template>
        <template v-else>
          {{ item.name }}
        </template>
      </NuxtLink>
    </template>
  </BaseDataTable>
</template>
