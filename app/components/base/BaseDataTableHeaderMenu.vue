<script setup lang="ts">
import { mdiEye, mdiEyeOff, mdiRefresh, mdiTableCog } from "@mdi/js";

const props = defineProps<
  {
    headers: Header[];
    visibleHeaders: Header[];
    sortBy: SortItem[];
  }
>();

const emit = defineEmits<{
  change: [header: Header];
  reset: [];
}>();

const filter = ref("");
const onlyVisible = ref(false);

const filteredHeaders = computed(() => {
  if (onlyVisible.value) {
    return props.visibleHeaders.filter(header =>
      header.value.toLowerCase().includes(filter.value.toLowerCase()),
    );
  }
  return props.headers.filter(header =>
    header.value.toLowerCase().includes(filter.value.toLowerCase()),
  );
});
</script>

<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke BaseDataTableHeaderMenu when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <VBtn
    variant="text"
    :icon="true"
  >
    <VIcon>{{ mdiTableCog }}</VIcon>
    <ClientOnly>
      <VTooltip
        activator="parent"
        location="bottom"
        open-delay="500"
      >
        {{ $t("table.tooltipConfig") }}
      </VTooltip>
    </ClientOnly>
    <ClientOnly>
      <VMenu
        activator="parent"
        transition="slide-y-transition"
        :offset="10"
        position="bottom"
        z-index="4"
        :close-on-content-click="false"
      >
        <VCard>
          <VList flat>
            <VListItemTitle class="px-2 montserrat align-center">
              {{ $t("common.headers") }}
              <VBtn
                icon
                variant="text"
                @click="emit('reset')"
              >
                <VIcon>{{ mdiRefresh }}</VIcon>
                <VTooltip
                  activator="parent"
                  location="bottom"
                  open-delay="500"
                >
                  {{ $t("table.tooltipResetHeaders") }}
                </VTooltip>
              </VBtn>

              <VBtn
                icon
                variant="text"
                @click="onlyVisible = !onlyVisible"
              >
                <VIcon>{{ !onlyVisible ? mdiEye : mdiEyeOff }}</VIcon>
                <VTooltip
                  activator="parent"
                  open-delay="500"
                  location="bottom"
                >
                  <span v-if="!onlyVisible">
                    {{ $t("table.tooltipShowActiveHeaders") }}
                  </span>
                  <span v-else>{{ $t("table.tooltipShowAllHeaders") }}</span>
                </VTooltip>
              </VBtn>
              <VTextField
                v-model="filter"
                class="py-2"
                density="compact"
                variant="underlined"
                hide-details
                :label="$t('common.filter')"
              />
            </VListItemTitle>
            <VVirtualScroll
              :items="filteredHeaders"
              :height="500"
              :item-height="35"
              :width="300"
            >
              <template #default="{ item }">
                <VListItem
                  density="compact"
                  variant="text"
                  slim
                  :disabled="sortBy.some((sortItem) => sortItem.key === item.value)"
                  @click.prevent="emit('change', item)"
                >
                  <template #prepend>
                    <VListItemAction start class="mr-2">
                      <VCheckboxBtn
                        density="compact"
                        :disabled="sortBy.some((sortItem) => sortItem.key === item.value)"
                        :model-value="item.show"
                        color="accent"
                      />
                    </VListItemAction>
                  </template>
                  <VListItemTitle>{{ item.title }}</VListItemTitle>
                  <VTooltip
                    activator="parent"
                    location="left"
                    :disabled="!sortBy.some((sortItem) => sortItem.key === item.value)"
                  >
                    {{ $t("common.headerSelectDisabled") }}
                  </VTooltip>
                </VListItem>
              </template>
            </VVirtualScroll>
          </VList>
        </VCard>
      </VMenu>
    </ClientOnly>
  </VBtn>
</template>
