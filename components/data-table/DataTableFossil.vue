<template>
  <base-data-table v-bind="$attrs">
    <template #item.taxon="{ item }">
      <base-link-external
        v-if="item.taxon_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon_id}`)"
      >
        {{ `${item.taxon} ${item.author_year ? item.author_year : ""}` }}
      </base-link-external>
    </template>

    <template #item.fossil_group="{ item }">
      <base-link-external
        v-if="item.fossil_group_id"
        @click.native="
          $openWindow(`https://fossiilid.info/${item.fossil_group_id}`)
        "
      >
        {{ item.fossil_group }}
      </base-link-external>
      <div v-else>
        {{ item.fossil_group }}
      </div>
    </template>
    <template #item.parent="{ item }">
      <base-link-external
        v-if="item.parent_id"
        @click.native="$openWindow(`https://fossiilid.info/${item.parent_id}`)"
      >
        {{ item.parent_taxon }}
      </base-link-external>
    </template>
    <template #item.src="{ item }">
      <div v-if="item.src">
        {{ $translate({ et: item.src_txt, en: item.src_txt_en }) }}
      </div>
    </template>
  </base-data-table>
</template>
