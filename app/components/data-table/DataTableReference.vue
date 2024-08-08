<script setup lang="ts">
import { mdiFilePdfBox } from "@mdi/js";

function openPDF(link: string) {
  window.open(link, "_blank", "height=800, width=800");
}
</script>

<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.id"
        @click="$openGeokirjandus('reference', item.id)"
      >
        {{ item.reference }}
      </BaseLinkExternal>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
      <div v-else-if="item.book">
        {{ item.book }}
      </div>
    </template>

    <template #item.doi="{ item }">
      <BaseLinkExternal
        v-if="item.doi"
        @click="$openWindow(`https://doi.org/${item.doi}`)"
      >
        {{ item.doi }}
      </BaseLinkExternal>
    </template>
    <template #item.pdf="{ item }">
      <VChip
        v-if="item.pdf"
        color="red "
        :ripple="false"
        variant="outlined"
        size="small"
        target="_blank"
        rel="noopener"
        class="d-print-none ml-1 my-1 link"
        @click.stop="openPDF(item.pdf)"
      >
        <VIcon class="pr-1">
          {{ mdiFilePdfBox }}
        </VIcon>
        <b>PDF</b>
      </VChip>
    </template>
  </BaseDataTable>
</template>
