<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";

const query = ref("");

const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

const searchRouteName = computed(() => {
  return route.name?.includes("search") ? route.name?.split("__")[0] : "search";
});

function handleClick() {
  if (query.value.length < 1)
    return;

  router.push(localePath({ name: searchRouteName.value, query: { q: query.value } }));
}
</script>

<template>
  <div class="d-flex w-100">
    <VTextField
      v-model="query"
      class="montserrat quick-search"
      single-line
      hide-details
      density="compact"
      rounded="0"
      flat
      variant="solo"
      :style="{ maxWidth: $vuetify.display.mdAndUp ? '450px' : 'inherit' }"
      :autofocus="false"
      :placeholder="$t('common.search')"
    />
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VBtn
        v-bind="hoverProps"
        height="40"
        :width="$vuetify.display.xs ? 32 : 48"
        elevation="0"
        :color="isHovering ? 'blue' : 'grey-lighten-2'"
        class="rounded-0 rounded-e"
        variant="flat"
        @click="handleClick"
      >
        <VIcon>
          {{ mdiMagnify }}
        </VIcon>
      </VBtn>
    </VHover>
  </div>
</template>

<style scoped lang="scss">
.quick-search {
  :deep(.v-field) {
    border-top-left-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
  }
}
</style>
