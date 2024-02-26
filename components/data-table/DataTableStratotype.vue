<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.stratigraphy="{ item }">
      <NuxtLink
        v-if="item.stratigraphy"
        class="text-link"
        :to="
          localePath({
            name: 'stratigraphy-id',
            params: { id: item.stratigraphy.id },
          })
        "
      >
        {{
          $translate({
            et: item.stratigraphy.stratigraphy,
            en: item.stratigraphy.stratigraphy_en,
          })
        }}
      </NuxtLink>
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
      <BaseLinkExternal
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>
  </BaseDataTable>
</template>
