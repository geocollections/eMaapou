<script setup lang="ts">
import { mdiFileExportOutline } from "@mdi/js";
import type { ExportSelection } from "~/composables/useExport";

const props = defineProps<{
  exportFunc: ExportFunc;
}>();

const { t } = useI18n({ useScope: "local" });

const selection = ref<ExportSelection>("page");
const exportType = ref<ExportType>("csv");
const filename = ref("export");

function handleExport() {
  props.exportFunc({ type: exportType.value, filename: filename.value, selection: selection.value });
}
</script>

<template>
  <div
    transition="slide-y-transition"
    offset="10"
    position="bottom"
    width="300"
    :close-on-content-click="false"
    z-index="4"
  >
    <button
      aria-label="export table"
      variant="text"
      class="mr-1"
      :icon="mdiFileExportOutline"
    />
    <span>{{ $t("table.tooltipExport") }}</span>
    <div class="pa-2">
      <div class="text-subtitle-2">
        {{ t("exportType") }}
      </div>
      <ButtonToggle
        v-model="exportType"
        class="mb-2"
        density="compact"
        mandatory
      >
        <button value="csv">
          CSV
        </button>
        <button value="xlsx">
          XLSX
        </button>
      </ButtonToggle>
      <VSelect
        v-model="selection"
        :items="[{ title: t('currentPage'), value: 'page' }, { title: t('allResults'), value: 'all' }]"
        :label="t('selection')"
        density="compact"
        variant="outlined"
        hide-details
      />
      <input
        v-model="filename"
        class="py-2"
        density="compact"
        hide-details
        variant="outlined"
        :label="t('filename')"
        :suffix="`.${exportType}`"
      >
      <div class="text-right">
        <button
          flat
          color="blue"
          class="text-none"
          @click="handleExport"
        >
          <div start>
            {{ mdiFileExportOutline }}
          </div>
          {{ t("export") }}
        </button>
      </div>

      <!-- <ul> -->
      <!--   <li @click="handleExportCsv"> -->
      <!--     <liTitle>CSV</liTitle> -->
      <!--   </li> -->
      <!-- <li @click="handleExportExcel"> -->
      <!--   <liTitle>XLSX (Excel)</liTitle> -->
      <!-- </li> -->
      <!-- <li @click="handleClipboard"> -->
      <!--   <liTitle> -->
      <!--     {{ $t("common.clipboard") }} -->
      <!--   </liTitle> -->
      <!-- </li> -->
      <!-- </ul> -->
    </div>
  </div>
</template>

<i18n lang="yaml">
et:
  export: "Ekspordi"
  filename: "Failinimi"
  selection: "Valik"
  currentPage: "Praeguse lehe tulemused"
  allResults: "Kõik tulemused"
  exportType: "Ekspordi tüüp"
en:
  export: "Export"
  filename: "Filename"
  selection: "Selection"
  currentPage: "Current page results"
  allResults: "All results"
  exportType: "Export type"
</i18n>
