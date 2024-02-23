<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <base-data-table v-bind="$attrs">
    <template #item.locality="{ item }">
      <nuxt-link
        v-if="item.locality"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality.id } })
        "
      >
        {{
          $translate({
            et: item.locality.locality,
            en: item.locality.locality_en,
          })
        }}
      </nuxt-link>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.stratotype_type">
        {{
          $translate({
            et: item.stratotype_type.value,
            en: item.stratotype_type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
  </base-data-table>
</template>
