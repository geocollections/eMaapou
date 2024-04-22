<script setup lang="ts">
import { mdiFileExportOutline } from "@mdi/js";
import { utils, writeFileXLSX } from "xlsx";
import type { ExportSelection } from "~/composables/useExport";

const props = defineProps<{
  tableElement: HTMLElement;
  exportFunc: ExportFunc;
}>();
// function removeSortIndicators(table: HTMLElement) {
//   const tableCopy = table.cloneNode(true);
//   // @ts-expect-error
//   const sortIndicators = tableCopy.querySelectorAll(
//     "thead > tr > th > .v-data-table-header__sort-badge",
//   );
//   sortIndicators.forEach((indicator: any) => {
//     indicator.parentElement.removeChild(indicator);
//   });
//   return tableCopy;
// }
// function createWorkbook(table: HTMLElement) {
//   const tableCopy = removeSortIndicators(table);
//   const wb = utils.table_to_book(tableCopy);
//   return wb;
// }
// function handleExportCsv() {
//   try {
//     const wb = createWorkbook(props.tableElement);
//
//     writeFileXLSX(wb, "export.csv", { bookType: "csv" });
//   }
//   catch (err) {}
// }
// function handleExportExcel() {
//   try {
//     const wb = createWorkbook(props.tableElement);
//
//     writeFileXLSX(wb, "export.xlsx", { bookType: "xlsx" });
//   }
//   catch (err) {}
// }
// function handleClipboard() {
//   const body = document.body;
//   let range;
//   let sel: Selection | null;
//   if (document.createRange && window.getSelection) {
//     range = document.createRange();
//     sel = window.getSelection();
//     sel?.removeAllRanges();
//     try {
//       range.selectNodeContents(props.tableElement);
//       sel?.addRange(range);
//     }
//     catch (e) {
//       range.selectNode(props.tableElement);
//       sel?.addRange(range);
//     }
//     sel?.removeAllRanges();
//   }
//   else if ((body as any).createTextRange) {
//     range = (body as any).createTextRange();
//     range.moveToElementText(props.tableElement);
//     range.select();
//   }
//   document.execCommand("Copy");
// }
const selection = ref<ExportSelection>("page");
const exportType = ref<ExportType>("csv");
const filename = ref("export");

function handleExport() {
  props.exportFunc({ type: exportType.value, filename: filename.value, selection: selection.value });
}
</script>

<template>
  <VMenu
    transition="slide-y-transition"
    offset="10"
    position="bottom"
    width="300"
    :close-on-content-click="false"
    z-index="4"
  >
    <template #activator="menu">
      <VTooltip location="bottom" open-delay="500">
        <template #activator="tooltip">
          <VBtn
            aria-label="export table"
            variant="text"
            class="mr-1"
            v-bind="{ ...menu.props, ...tooltip.props }"
            :icon="mdiFileExportOutline"
          />
        </template>
        <span>{{ $t("table.tooltipExport") }}</span>
      </VTooltip>
    </template>
    <VCard class="pa-2">
      <div class="text-subtitle-2">
        Export type
      </div>
      <VBtnToggle
        v-model="exportType"
        class="mb-2"
        density="compact"
      >
        <VBtn value="csv">
          CSV
        </VBtn>
      </VBtnToggle>
      <VSelect
        v-model="selection"
        :items="[{ title: 'Current page results', value: 'page' }, { title: 'All results', value: 'all' }]"
        label="Selection"
        density="compact"
        variant="outlined"
        hide-details
      />
      <VTextField
        v-model="filename"
        class="py-2"
        density="compact"
        hide-details
        variant="outlined"
        label="Filename"
        :suffix="`.${exportType}`"
      />
      <div class="text-right">
        <VBtn
          flat
          color="blue"
          class="text-none"
          @click="handleExport"
        >
          <VIcon start>
            {{ mdiFileExportOutline }}
          </VIcon>
          Export
        </VBtn>
      </div>

      <!-- <VList> -->
      <!--   <VListItem @click="handleExportCsv"> -->
      <!--     <VListItemTitle>CSV</VListItemTitle> -->
      <!--   </VListItem> -->
      <!-- <VListItem @click="handleExportExcel"> -->
      <!--   <VListItemTitle>XLSX (Excel)</VListItemTitle> -->
      <!-- </VListItem> -->
      <!-- <VListItem @click="handleClipboard"> -->
      <!--   <VListItemTitle> -->
      <!--     {{ $t("common.clipboard") }} -->
      <!--   </VListItemTitle> -->
      <!-- </VListItem> -->
      <!-- </VList> -->
    </VCard>
  </VMenu>
</template>
