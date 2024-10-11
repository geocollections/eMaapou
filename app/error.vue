<script setup lang="ts">
import type { NuxtError } from "#app";
import { mdiHome, mdiMagnify, mdiRefresh } from "@mdi/js";

const props = defineProps<{
  error: NuxtError;
}>();

const router = useRouter();

const query = ref("");

useHead({
  title: props.error.message,
});

function handleSearch() {
  router.push({
    name: "search",
    query: { q: query.value },
  });
}
</script>

<template>
  <NuxtLayout>
    <main>
      <div :fluid="true">
        <div justify="center">
          <div
            sm="8"
            md="6"
            class="text-center"
          >
            <div class="pt-15">
              <h1 class="text-h4 mb-5">
                {{ error.message }}
              </h1>

              <button
                variant="text"
                size="large"
                elevation="0"
                class="text-capitalize montserrat"
                @click="router.go(0)"
              >
                <div start>
                  {{ mdiRefresh }}
                </div>
                Refresh
              </button>
              <button
                size="large"
                variant="text"
                elevation="0"
                nuxt
                to="/"
                class="montserrat text-capitalize"
              >
                <div start>
                  {{ mdiHome }}
                </div>
                {{ $t("common.backToLanding") }}
              </button>
              <VForm class="d-flex text-right my-4" @submit.prevent="handleSearch">
                <InputSearch
                  v-model="query"
                  :rounded="5"
                  input-class="rounded elevation-1"
                  height="56"
                  :placeholder="$t('landing.searchPlaceholder')"
                />
                <button
                  height="49px"
                  width="84px"
                  class="text-body-1 ml-2 ml-sm-3 mt-0 mt-sm-0"
                  type="submit"
                  color="warning"
                  dark
                >
                  <div>{{ mdiMagnify }}</div>
                </button>
              </VForm>
            </div>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>
