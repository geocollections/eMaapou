<template>
  <base-data-table v-bind="$attrs">
    <template #item.id="{ item }">
      <base-link-external
        v-if="item.id"
        @click.native="$openWindow(`https://kivid.info/${item.id}`)"
      >
        {{ item.id }}
      </base-link-external>
    </template>

    <template #item.formula="{ item }">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="item.formula_html" v-html="item.formula_html" />
      <div v-else>{{ item.formula }}</div>
    </template>

    <template #item.in_estonia="{ item }">
      <base-boolean :value="!!item.in_estonia" />
    </template>

    <template #item.mindat_id="{ item }">
      <base-link-external
        v-if="item.mindat_id"
        @click.native="
          $openWindow(`https://www.mindat.org/min-${item.mindat_id}.html`)
        "
      >
        {{ item.mindat_id }}
      </base-link-external>
    </template>
  </base-data-table>
</template>
