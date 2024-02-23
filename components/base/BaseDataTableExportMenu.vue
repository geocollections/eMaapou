<script setup lang="ts">
import { mdiFileExportOutline } from "@mdi/js";
import { utils, writeFileXLSX } from "xlsx";

const props = defineProps<{
  tableElement: HTMLElement;
}>();
function removeSortIndicators(table: HTMLElement) {
  const tableCopy = table.cloneNode(true);
  // @ts-expect-error
  const sortIndicators = tableCopy.querySelectorAll(
    "thead > tr > th > .v-data-table-header__sort-badge",
  );
  sortIndicators.forEach((indicator: any) => {
    indicator.parentElement.removeChild(indicator);
  });
  return tableCopy;
}
function createWorkbook(table: HTMLElement) {
  const tableCopy = removeSortIndicators(table);
  const wb = utils.table_to_book(tableCopy);
  return wb;
}
function handleExportCsv() {
  try {
    const wb = createWorkbook(props.tableElement);

    writeFileXLSX(wb, "export.csv", { bookType: "csv" });
  }
  catch (err) {}
}
function handleExportExcel() {
  try {
    const wb = createWorkbook(props.tableElement);

    writeFileXLSX(wb, "export.xlsx", { bookType: "xlsx" });
  }
  catch (err) {}
}
function handleClipboard() {
  const body = document.body;
  let range;
  let sel: Selection | null;
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel?.removeAllRanges();
    try {
      range.selectNodeContents(props.tableElement);
      sel?.addRange(range);
    }
    catch (e) {
      range.selectNode(props.tableElement);
      sel?.addRange(range);
    }
    sel?.removeAllRanges();
  }
  else if ((body as any).createTextRange) {
    range = (body as any).createTextRange();
    range.moveToElementText(props.tableElement);
    range.select();
  }
  document.execCommand("Copy");
}
</script>

<template>
  <v-menu
    transition="slide-y-transition"
    offset="10"
    position="bottom"
    z-index="4"
  >
    <template #activator="menu">
      <v-tooltip location="bottom" open-delay="500">
        <template #activator="tooltip">
          <v-btn
            aria-label="export table"
            variant="text"
            class="mr-1"
            v-bind="{ ...menu.props, ...tooltip.props }"
            :icon="mdiFileExportOutline"
          />
        </template>
        <span>{{ $t("table.tooltipExport") }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="handleExportCsv">
        <v-list-item-title>CSV</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleExportExcel">
        <v-list-item-title>XLSX (Excel)</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleClipboard">
        <v-list-item-title>
          {{ $t("common.clipboard") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
