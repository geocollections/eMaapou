<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";

const query = ref("");

const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

const searchRouteName = computed(() => {
  return route.name?.toString().includes("search") ? route.name?.toString().split("__")[0] : "search";
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
      bg-color="grey-darken-1"
      variant="solo"
      :autofocus="false"
      :placeholder="$t('common.search')"
      @keydown.enter="handleClick"
    />
    <button
      height="40"
      elevation="0"
      class="
      rounded-0
      rounded-e"
      variant="flat"

      :aria-label="$t('common.search')"
    >
      <VIcon>
        {{ mdiMagnify }}
      </VIcon>
    </button>
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
