<template>
  <base-data-table v-bind="$attrs">
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.id"
        @click.native="$openGeology('reference', item.id)"
      >
        {{ item.reference }}
      </base-link-external>
    </template>

    <template #item.journal="{ item }">
      <div v-if="item.journal__journal_name">
        {{ item.journal__journal_name }}
      </div>
      <div v-else-if="item.book">{{ item.book }}</div>
    </template>

    <template #item.doi="{ item }">
      <base-link-external
        v-if="item.doi"
        @click.native="$openWindow(`https://doi.org/${item.doi}`)"
      >
        {{ item.doi }}
      </base-link-external>
    </template>
    <template #item.pdf="{ item }">
      <v-chip
        v-if="item.pdf"
        color="red "
        :ripple="false"
        outlined
        small
        target="_blank"
        rel="noopener"
        class="d-print-none ml-1 my-1 link"
        @click.stop="openPDF(item.pdf)"
      >
        <v-icon class="pr-1">{{ mdiFilePdfBox }}</v-icon>
        <b>PDF</b>
      </v-chip>
    </template>
  </base-data-table>
</template>

<script setup lang="ts">
import { mdiFilePdfBox } from "@mdi/js";

const openPDF = (link: string) => {
  window.open(link, "_blank", "height=800, width=800");
};
</script>
