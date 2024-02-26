<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <NuxtLayout>
    <VMain>
      <VContainer :fluid="$vuetify.display.lgAndDown">
        <VRow no-gutters>
          <VCol>
            <div class="pt-15">
              <DetailError :error="error" />
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </NuxtLayout>
</template>
