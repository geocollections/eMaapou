<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Object as PropType<Error | null>,
    default: null,
  },
});
</script>

<template>
  <VMain>
    <VContainer
      class="pt-1 pb-10"
      style="min-height: 100vh"
      :fluid="$vuetify.display.lgAndDown"
    >
      <VRow no-gutters>
        <VCol>
          <ClientOnly>
            <!-- <history-viewer v-if="$vuetify.display.smAndUp" /> -->
          </ClientOnly>
        </VCol>
      </VRow>
      <VRow no-gutters class="fill-height">
        <VFadeTransition hide-on-leave>
          <!-- <VCol -->
          <!--   v-if="error" -->
          <!--   key="detail-error" -->
          <!--   class="pt-15" -->
          <!-- > -->
          <!--   <div> -->
          <!--     <DetailError :error="error" /> -->
          <!--   </div> -->
          <!-- </VCol> -->
          <!-- <v-col v-else-if="loading" key="detail-loading" class="pt-15"> -->
          <!--   <div -->
          <!--     :style="`height: 100%; width: 100%`" -->
          <!--     class="d-flex align-center justify-center" -->
          <!--   > -->
          <!--     <v-progress-circular -->
          <!--       indeterminate -->
          <!--       color="accent" -->
          <!--       :size="150" -->
          <!--       :width="8" -->
          <!--     > -->
          <!--       <div class="montserrat">{{ $t("common.loading") }}</div> -->
          <!--     </v-progress-circular> -->
          <!--   </div> -->
          <!-- </v-col> -->
          <VCol
            key="detail"
            class="pt-5"
          >
            <slot name="title" />
            <div class="px-0 px-sm-3">
              <slot name="top" />
              <slot>
                <VCard>
                  <VRow no-gutters justify="center">
                    <VCol v-if="$slots['column-left']" cols>
                      <slot name="column-left" />
                    </VCol>
                    <VCol
                      v-if="$slots['column-right']"
                      cols="12"
                      md="6"
                    >
                      <slot name="column-right" />
                    </VCol>
                  </VRow>
                </VCard>
              </slot>
              <slot name="bottom" />
            </div>
          </VCol>
        </VFadeTransition>
      </VRow>
      <FabScrollTop />
    </VContainer>
    <AppFooter />
  </VMain>
</template>
