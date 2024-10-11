<script setup lang="ts">
import { mdiChartLineVariant } from "@mdi/js";

const props = defineProps<{
  parameters: any[];
  initialSelection: any[];
}>();

const emit = defineEmits<{
  input: [value: any[]];
}>();

const search = ref("");
const searchDebounced = refDebounced(search, 200);

const flatParameters = computed(() => props.parameters.flatMap((p) => {
  return p.children.flatMap((c: any) => {
    return { ...c, method: p.name, method_en: p.name };
  });
}));

const { $translate } = useNuxtApp();

const filteredParameters = computed(() => {
  return flatParameters.value?.filter((p) => {
    const name = $translate({ et: p.name, en: p.name_en ?? p.name });
    const method = $translate({ et: p.method, en: p.method_en });
    const lowercaseSearch = searchDebounced.value.toLowerCase();
    return name.toLowerCase().includes(lowercaseSearch)
      || method.toLowerCase().includes(lowercaseSearch);
  });
});

function handleInput(event: any) {
  if (isParameterSelected(event))
    emit("input", props.initialSelection.filter(p => p.id !== event.id));

  else
    emit("input", [...props.initialSelection, event]);
}

function isParameterSelected(parameter: any) {
  return props.initialSelection.some(p => p.id === parameter.id);
}
</script>

<template>
  <VMenu
    transition="slide-y-transition"
    :offset="10"
    content-class="white"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menu }">
      <button
        color="accent"
        class="montserrat text-none"
        size="small"
        variant="outlined"
        v-bind="menu"
      >
        <div start>
          {{ mdiChartLineVariant }}
        </div>
        {{ $t("common.parameters") }}
      </button>
    </template>
    <div flat style="min-width: 400px">
      <div class="text-body-1 pb-0 px-2">
        <div class="montserrat">
          {{ $t("common.parameters") }}
        </div>
      </div>
      <div class="px-2">
        <VTextField
          v-model="search"
          :label="$t('common.filter')"
          class="py-2"
          density="compact"
          variant="outlined"
          hide-details
        />
        <VVirtualScroll
          :items="filteredParameters"
          height="500px"
          item-height="40px"
        >
          <template #default="{ item }">
            <li
              @click="handleInput(item)"
            >
              <template #prepend>
                <div start>
                  <VCheckboxBtn :model-value="isParameterSelected(item)" />
                </div>
              </template>
              <div>
                <span class="text-medium-emphasis font-italic">
                  ({{ $translate({ et: item.method, en: item.method }) }})
                </span>
                {{ $translate({ et: item.name, en: item.name_en ?? item.name }) }}
                <VChip small>
                  {{ item.count }}
                </VChip>
              </div>
            </li>
          </template>
        </VVirtualScroll>
        <!-- TODO: Reimplement treeview when vuetify 3 adds it -->
        <!-- <v-treeview -->
        <!--   style="max-height: 500px" -->
        <!--   dense -->
        <!--   selectable -->
        <!--   :search="search" -->
        <!--   return-object -->
        <!--   :items="parameters" -->
        <!--   :value="initialSelection" -->
        <!--   @input="handleInput" -->
        <!-- > -->
        <!--   <template #label="{ item }"> -->
        <!--     <div> -->
        <!--       {{ $translate({ et: item.name, en: item.name_en }) }} -->
        <!--       <v-chip small>{{ item.count }}</v-chip> -->
        <!--     </div> -->
        <!--   </template> -->
        <!-- </v-treeview> -->
      </div>
    </div>
  </VMenu>
</template>
