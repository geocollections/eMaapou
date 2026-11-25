<script setup lang="ts">
import type { ExportSelection, ExportType } from "~/composables/useExport";
import { mdiFileExportOutline } from "@mdi/js";

interface ExportButton {
  value: ExportType;
  text: string;
};

const props = withDefaults(defineProps<{
  exportFunc: ExportFunc;
  types?: ExportType[];
}>(), {
  types: () => ["csv", "xlsx"],
});

const { t } = useI18n();

const selection = ref<ExportSelection>("page");
const exportType = ref<ExportType>("csv");
const filename = ref("export");

const typeButtonsMap: Record<ExportType, ExportButton> = {
  csv: {
    value: "csv",
    text: "CSV",
  },
  xlsx: {
    value: "xlsx",
    text: "XLSX",
  },
};

const activeTypeButtons = computed(() => {
  return props.types.map(type => typeButtonsMap[type]);
});

function handleExport() {
  props.exportFunc({ type: exportType.value, filename: filename.value, selection: selection.value });
}
</script>

<template>
  <VBtn
    :aria-label="t('portal.tableExport.exportTable')"
    variant="text"
    class="mr-1"
    :icon="true"
  >
    <VIcon>{{ mdiFileExportOutline }}</VIcon>
    <ClientOnly>
      <VTooltip
        activator="parent"
        location="bottom"
        open-delay="500"
      >
        {{ $t("table.tooltipExport") }}
      </VTooltip>
    </ClientOnly>
    <ClientOnly>
      <VMenu
        activator="parent"
        transition="slide-y-transition"
        offset="10"
        position="bottom"
        width="300"
        :close-on-content-click="false"
        z-index="4"
      >
        <VCard class="pa-2">
          <div class="text-subtitle-2">
            {{ t("portal.tableExport.exportType") }}
          </div>
          <VBtnToggle
            v-model="exportType"
            class="mb-2"
            density="compact"
            mandatory
          >
            <VBtn
              v-for="button in activeTypeButtons"
              :key="button.value"
              :value="button.value"
            >
              {{ button.text }}
            </VBtn>
          </VBtnToggle>
          <VSelect
            v-model="selection"
            :items="[{ title: t('portal.tableExport.currentPage'), value: 'page' }, { title: t('portal.tableExport.allResults'), value: 'all' }]"
            :label="t('portal.tableExport.selection')"
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
            :label="t('portal.tableExport.filename')"
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
              {{ t("portal.tableExport.export") }}
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
    </ClientOnly>
  </VBtn>
</template>
