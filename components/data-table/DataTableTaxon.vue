<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.taxon="{ item }">
      <BaseLinkExternal
        v-if="item.id"
        @click.native="$openWindow(`https://fossiilid.info/${item.id}`)"
      >
        {{ `${item.taxon} ${item.author_year ? item.author_year : ""}` }}
      </BaseLinkExternal>
    </template>

    <template #item.fossil_group="{ item }">
      <BaseLinkExternal
        v-if="item.fossil_group_id"
        @click.native="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
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
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
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
        v-if="item.fad_id"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.fad_id } })
        "
      >
        {{ $translate({ et: item.fad, en: item.fad_en }) }}
      </NuxtLink>
    </template>
    <template #item.lad="{ item }">
      <NuxtLink
        v-if="item.lad_id"
        class="text-link"
        :to="
          localePath({ name: 'stratigraphy-id', params: { id: item.lad_id } })
        "
      >
        {{ $translate({ et: item.lad, en: item.lad_en }) }}
      </NuxtLink>
    </template>
  </BaseDataTable>
</template>
