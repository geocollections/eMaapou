<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.locality="{ item }">
      <NuxtLink
        v-if="item.locality"
        class="text-link"
        :to="
          localePath({ name: 'locality-id', params: { id: item.locality.id } })
        "
      >
        {{
          $translate({
            et: item.locality.name,
            en: item.locality.name_en,
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
  </BaseDataTable>
</template>
