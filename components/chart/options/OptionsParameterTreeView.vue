<template>
  <v-menu
    transition="slide-y-transition"
    :offset="10"
    content-class="white"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        color="accent"
        class="montserrat text-none"
        size="small"
        variant="outlined"
        v-bind="props"
      >
        <v-icon start> {{ icons.mdiChartLineVariant }} </v-icon>
        {{ $t("common.parameters") }}
      </v-btn>
    </template>
    <v-card flat style="min-width: 400px">
      <v-card-title class="text-body-1 pb-0 px-2">
        <div class="montserrat">
          {{ $t("common.parameters") }}
        </div>
      </v-card-title>
      <v-card-text class="px-2">
        <v-text-field
          v-model="search"
          :label="$t('common.filter')"
          class="py-2"
          density="compact"
          variant="underlined"
          hide-details
        />
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
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mdiChartLineVariant } from "@mdi/js";
export default {
  name: "OptionsParameterTreeView",
  props: {
    parameters: {
      type: Array,
      required: true,
    },
    initialSelection: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    icons() {
      return {
        mdiChartLineVariant,
      };
    },
  },
  methods: {
    handleInput(event) {
      this.$emit("input", event);
    },
  },
};
</script>
