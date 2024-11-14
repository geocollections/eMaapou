<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
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
            et: item.stratigraphy.name,
            en: item.stratigraphy.name_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.type">
        {{
          $translate({
            et: item.type.value,
            en: item.type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
    </template>
    <template #item.depthFrom="{ item }">
      <span v-if="item.depth_top">
        {{
          item.depth_top.toFixed(2)
        }}
      </span>
    </template>
    <template #item.depthTo="{ item }">
      <span v-if="item.depth_base">
        {{
          item.depth_base.toFixed(2)
        }}
      </span>
    </template>
  </BaseDataTable>
</template>
