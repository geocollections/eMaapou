<script setup lang="ts">
import { mdiHome, mdiMagnify, mdiRefresh } from "@mdi/js";
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

const router = useRouter();

const query = ref("");

function handleSearch() {
  router.push({
    name: "search",
    query: { q: query.value },
  });
}
</script>

<template>
  <NuxtLayout>
    <VMain>
      <VContainer :fluid="$vuetify.display.lgAndDown">
        <VRow justify="center">
          <VCol
            sm="8"
            md="6"
            class="text-center"
          >
            <div class="pt-15">
              <h1 class="text-h4 mb-5">
                {{ error.message }}
              </h1>

              <VBtn
                variant="text"
                size="large"
                elevation="0"
                class="text-capitalize montserrat"
                @click="router.go(0)"
              >
                <VIcon start>
                  {{ mdiRefresh }}
                </VIcon>
                Refresh
              </VBtn>
              <VBtn
                size="large"
                variant="text"
                elevation="0"
                nuxt
                to="/"
                class="montserrat text-capitalize"
              >
                <VIcon start>
                  {{ mdiHome }}
                </VIcon>
                {{ $t("common.backToLanding") }}
              </VBtn>
              <VForm class="d-flex text-right my-4" @submit.prevent="handleSearch">
                <InputSearch
                  v-model="query"
                  :rounded="5"
                  input-class="rounded elevation-1"
                  height="56"
                  :placeholder="$t('landing.searchPlaceholder')"
                />
                <VBtn
                  height="49px"
                  width="84px"
                  class="text-body-1 ml-2 ml-sm-3 mt-0 mt-sm-0"
                  type="submit"
                  color="warning"
                  dark
                >
                  <VIcon>{{ mdiMagnify }}</VIcon>
                </VBtn>
              </VForm>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </NuxtLayout>
</template>
