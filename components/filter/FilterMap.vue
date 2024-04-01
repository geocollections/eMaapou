<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  useCustomMarkers: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Object as PropType<any>,
    default: () => null,
  },
});
const emit = defineEmits(["update:model-value", "input"]);
const { $translate } = useNuxtApp();
const route = useRoute();
const show = ref(false);

function handleOpen() {
  show.value = !show.value;
}
function handleRemove() {
  emit("update:model-value", null);
}
const mapMarkers = computed(() => {
  // if (props.useCustomMarkers) return props.items
  //
  // const routeName = route.name?.split('___')[0]
  // return props.items.reduce((filtered, item) => {
  //   if (item.latitude && item.longitude) {
  //     const newItem = {
  //       latitude: item.latitude,
  //       longitude: item.longitude,
  //       text:
  //         $translate({ et: item.locality, en: item.locality_en }) ??
  //         ($translate({
  //           et: item.site_name,
  //           en: item.site_name_en,
  //         }) ||
  //           item.name ||
  //           `ID: ${item.id}`),
  //       routeName:
  //         routeName === 'site'
  //           ? 'site'
  //           : item.site_id
  //           ? 'site'
  //           : 'locality',
  //       id: (item.locality_id || item.site_id) ?? item.id,
  //     } as MapMarker
  //
  //     const isItemInArray = !!filtered.find(
  //       (existingItem: any) =>
  //         existingItem.latitude === item.latitude &&
  //         existingItem.longitude === item.longitude
  //     )
  //     if (!isItemInArray) filtered.push(newItem)
  //   }
  //   return filtered

  // }, [])
  return [];
});
const valueString = computed(() => {
  return `${props.modelValue?.geometry.type} ${props.modelValue?.geometry.coordinates}`;
});
</script>

<template>
  <VExpansionPanel
    bg-color="transparent"
    elevation="0"
    :rounded="0"
    style="background-color: transparent"
    @group:selected="handleOpen"
  >
    <VExpansionPanelTitle
      class="py-1 pl-4 pr-1 font-weight-medium"
      style="min-height: 40px"
    >
      {{ $t("filters.map") }}
    </VExpansionPanelTitle>
    <div
      v-if="modelValue !== null"
      class="bg-white"
    >
      <div class="d-flex selected-item py-1 px-2">
        <span>
          <input
            type="checkbox"
            class="checkbox"
            checked
            @click.prevent.stop="handleRemove"
          >
        </span>
        <span
          class="align-self-center pl-2 text-body-2 font-weight-medium text-truncate"
        >
          {{ valueString }}
        </span>
      </div>
    </div>
    <VExpansionPanelText>
      <div class="pa-0">
        <MapSearchNew
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
        />
      </div>
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>
:deep(.v-expansion-panel-text__wrapper) {
  padding: 0px;
}

.checkbox {
  accent-color: var(--v-accent-base);
}
</style>
