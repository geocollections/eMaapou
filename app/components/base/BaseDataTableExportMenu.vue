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
        {{ t("exportType") }}
      </div>
      <VBtnToggle
        v-model="exportType"
        class="mb-2"
        density="compact"
        mandatory
      >
        <VBtn value="csv">
          CSV
        </VBtn>
        <VBtn value="xlsx">
          XLSX
        </VBtn>
      </VBtnToggle>
      <VSelect
        v-model="selection"
        :items="[{ title: t('currentPage'), value: 'page' }, { title: t('allResults'), value: 'all' }]"
        :label="t('selection')"
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
        :label="t('filename')"
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
          {{ t("export") }}
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
