<template>
  <base-data-table v-bind="$attrs">
    <template #item.identifier="{ item }">
      <base-link-external
        v-if="item.identifier"
        @click.native="
          $openWindow(`http://doi.geocollections.info/${item.identifier}`)
        "
        >{{ item.identifier }}</base-link-external
      >
    </template>

    <template #item.datacite_created="{ item }">
      <div v-if="item.datacite_created">
        <div>
          {{ $formatDate(item.datacite_created) }}
        </div>
        <div
          v-if="
            item.datacite_updated &&
            item.datacite_created !== item.datacite_updated
          "
        >
          ({{ $formatDate(item.datacite_updated) }})
        </div>
      </div>
    </template>
  </base-data-table>
</template>
