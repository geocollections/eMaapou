<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable
    v-bind="$attrs"
    :item-to="(item) => `https://fossiilid.info/${item.id}`"
    external-to
  >
    <template #item.taxon="{ item }">
      {{ `${item.taxon} ${item.author_year ? item.author_year : ""}` }}
    </template>

    <template #item.fossil_group="{ item }">
      <BaseLinkExternal
        v-if="item.fossil_group_id"
        :href="`https://fossiilid.info/${item.fossil_group_id}`"
      >
        {{ item.fossil_group }}
      </BaseLinkExternal>
      <div v-else>
        {{ item.fossil_group }}
      </div>
    </template>

    <template #item.parent_taxon="{ item }">
      <BaseLinkExternal
        v-if="item.parent_id"
        :href="`https://fossiilid.info/${item.parent_id}`"
      >
        {{ item.parent_taxon }}
      </BaseLinkExternal>
      <div v-else>
        {{ item.parent_taxon }}
      </div>
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
    </template>

    <template #item.fad="{ item }">
      <NuxtLink
        v-if="item.stratigraphy_base"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.stratigraphy_base } })
        "
      >
        {{ $translate({ et: item.fad_stratigraphy, en: item.fad_stratigraphy_en }) }}
      </NuxtLink>
    </template>
    <template #item.lad="{ item }">
      <NuxtLink
        v-if="item.stratigraphy_top"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.stratigraphy_top } })
        "
      >
        {{ $translate({ et: item.lad_stratigraphy, en: item.lad_stratigraphy_en }) }}
      </NuxtLink>
    </template>
    <template #item.in_estonia="{ item }">
      <BaseBoolean :model-value="item.in_estonia" />
    </template>
    <template #item.is_fossil="{ item }">
      <BaseBoolean :model-value="item.is_fossil" />
    </template>
    <template #item.is_valid="{ item }">
      <BaseBoolean :model-value="item.is_valid" />
    </template>
  </BaseDataTable>
</template>
