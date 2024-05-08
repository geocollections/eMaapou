<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.taxon="{ item }">
      <BaseLinkExternal
        v-if="item.taxon_id"
        @click="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ `${item.taxon} ${item.author_year ? item.author_year : ""}` }}
      </BaseLinkExternal>
    </template>

    <template #item.fossil_group="{ item }">
      <BaseLinkExternal
        v-if="item.fossil_group_id"
        @click="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
      >
        {{ item.fossil_group }}
      </BaseLinkExternal>
      <div v-else>
        {{ item.fossil_group }}
      </div>
    </template>
    <template #item.parent="{ item }">
      <BaseLinkExternal
        v-if="item.parent_id"
        @click="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      >
        {{ item.parent_taxon }}
      </BaseLinkExternal>
    </template>
    <template #item.src="{ item }">
      <div v-if="item.src">
        {{ $translate({ et: item.src_txt, en: item.src_txt_en }) }}
      </div>
    </template>
  </BaseDataTable>
</template>
