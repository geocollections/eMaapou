<script setup lang="ts">
import type { ExportFunc, ExportType } from "~/composables/useExport";

const props = defineProps<{ showColumns?: boolean; headers: Header[]; sortBy: SortItem[]; exportFunc?: ExportFunc; exportTypes?: ExportType[] }>();
const emit = defineEmits<{ change: [header: Header]; reset: [] }>();
const { t } = useI18n();
const menu = ref<"columns" | "export" | null>(null);
function setMenu(value: "columns" | "export", open: boolean) {
  if (open)
    menu.value = value;
  else if (menu.value === value)
    menu.value = null;
}
const search = ref("");
const format = ref<ExportType>("csv");
const selection = ref<"page" | "all">("page");
const busy = ref(false);
const message = ref("");
const copy = computed(() => ({
  columns: t("portal.tableTools.columns"),
  export: t("portal.tableTools.export"),
  find: t("portal.tableTools.find"),
  reset: t("portal.tableTools.reset"),
  scope: t("portal.tableTools.scope"),
  page: t("portal.tableTools.page"),
  all: t("portal.tableTools.all"),
  format: t("portal.tableTools.format"),
  download: t("portal.tableTools.download"),
  downloading: t("portal.tableTools.downloading"),
  failed: t("portal.tableTools.failed"),
  locked: t("portal.tableTools.locked"),
  done: t("portal.tableTools.done"),
}));
const columns = computed(() => props.headers.filter(h => h.title.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())));
function locked(header: Header) {
  return props.sortBy.some(sort => sort.key === header.value || header.children?.some(child => sort.key === child.value));
}
async function download() {
  if (!props.exportFunc || busy.value)
    return;
  busy.value = true;
  message.value = "";
  try {
    await props.exportFunc({ type: format.value, selection: selection.value, filename: "emaapou-specimens" });
    message.value = copy.value.done;
  }
  catch { message.value = copy.value.failed; }
  finally { busy.value = false; }
}
</script>

<template>
  <div class="portal-table-tools">
    <UPopover
      v-if="showColumns !== false"
      :open="menu === 'columns'"
      :content="{ align: 'end', sideOffset: 8, collisionPadding: 12 }"
      :ui="{ content: 'portal-table-popover' }"
      @update:open="setMenu('columns', $event)"
    >
      <UButton
        color="neutral"
        variant="outline"
        class="portal-table-tool header-focus"
        icon="i-lucide-columns-3"
      >
        {{ copy.columns }}
      </UButton>
      <template #content>
        <section class="portal-table-popover__body" :aria-label="copy.columns">
          <h3>{{ copy.columns }}</h3>
          <label class="portal-table-field">{{ copy.find }}<UInput
            v-model="search"
            type="search"
            color="neutral"
            class="w-full"
            :ui="{ base: 'portal-field-control' }"
          /></label>
          <div class="portal-table-column-list">
            <UCheckbox
              v-for="column in columns"
              :key="column.value"
              :model-value="column.show"
              :disabled="locked(column)"
              :label="column.title"
              :description="locked(column) ? copy.locked : undefined"
              @update:model-value="emit('change', column)"
            />
          </div>
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            class="portal-table-reset"
            @click="emit('reset')"
          >
            {{ copy.reset }}
          </UButton>
        </section>
      </template>
    </UPopover>
    <UPopover
      v-if="exportFunc"
      :open="menu === 'export'"
      :content="{ align: 'end', sideOffset: 8, collisionPadding: 12 }"
      :ui="{ content: 'portal-table-popover' }"
      @update:open="setMenu('export', $event)"
    >
      <UButton
        color="neutral"
        variant="outline"
        class="portal-table-tool"
        icon="i-lucide-download"
      >
        {{ copy.export }}
      </UButton>
      <template #content>
        <form class="portal-table-popover__body" @submit.prevent="download">
          <h3>{{ copy.export }}</h3>
          <UFormField :label="copy.format">
            <USelect
              v-model="format"
              :items="(exportTypes ?? ['csv', 'xlsx']).map(value => ({ label: value.toUpperCase(), value }))"
              :aria-label="copy.format"
              color="neutral"
              class="w-full"
              :ui="{ base: 'portal-field-control', content: 'z-[1500]' }"
            />
          </UFormField>
          <UFormField :label="copy.scope">
            <URadioGroup v-model="selection" :items="[{ label: copy.page, value: 'page' }, { label: copy.all, value: 'all' }]" />
          </UFormField>
          <UButton
            type="submit"
            class="portal-table-download"
            :disabled="busy"
          >
            {{ busy ? copy.downloading : copy.download }}
          </UButton>
          <p v-if="message" role="status">
            {{ message }}
          </p>
        </form>
      </template>
    </UPopover>
  </div>
</template>
