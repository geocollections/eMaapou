<script setup lang="ts">
const tableAttrs = useBaseDataTableAttrs();
</script>

<template>
  <BaseDataTable v-bind="tableAttrs">
    <template #item.id="{ item }">
      <BaseLinkExternal
        v-if="item.id"
        @click="$openWindow(`https://kivid.info/${item.id}`)"
      >
        {{ item.id }}
      </BaseLinkExternal>
    </template>

    <template #item.formula="{ item }">
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else>
        {{ item.formula }}
      </div>
    </template>

    <template #item.in_estonia="{ item }">
      <BaseBoolean :model-value="!!item.in_estonia" />
    </template>

    <template #item.mindat_id="{ item }">
      <BaseLinkExternal
        v-if="item.mindat_id"
        @click="
          $openWindow(`https://www.mindat.org/min-${item.mindat_id}.html`)
        "
      >
        {{ item.mindat_id }}
      </BaseLinkExternal>
    </template>
  </BaseDataTable>
</template>
