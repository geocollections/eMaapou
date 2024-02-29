<script setup lang="ts">
const props = defineProps<{ drillcoreBox: any }>();

const img = useImage();
const localePath = useLocalePath();
const route = useRoute();
const { $geoloogiaFetch } = useNuxtApp();

const drillcore = computed(() => props.drillcoreBox.drillcore);
const imageSizes = ["small", "medium", "large", "original"];
const drillcoreBoxImages = computed(() => data.value?.drillcoreBoxImages);
const activeImage = computed(() => data.value?.activeImage);

const { data } = await useAsyncData("images", async () => {
  const attachmentLinks = await $geoloogiaFetch("/attachment_link/", {
    query: {
      drillcore_box: route.params.id,
      nest: 2,
      ordering: "-attachment__is_preferred",
    },
  });

  const drillcoreBoxImages = attachmentLinks.results;
  const activeImage = drillcoreBoxImages[0];

  return {
    activeImage,
    drillcoreBoxImages,
  };
});
</script>

<template>
  <VContainer style="margin: initial">
    <VRow>
      <VCol>
        <!-- TODO: Add placeholder, for case when box does not have a picture (filename check) -->
        <VImg
          contain
          class="rounded border cursor-pointer transition-swing"
          :lazy-src="
            img(
              activeImage.attachment.uuid_filename,
              { size: 'small' },
              { provider: 'geocollections' },
            )
          "
          :src="
            img(
              activeImage.attachment.uuid_filename,
              { size: 'large' },
              { provider: 'geocollections' },
            )
          "
          max-width="2000"
          max-height="1000"
          @click="$openImage(activeImage.attachment.uuid_filename)"
        >
          <template #placeholder>
            <VRow
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <VProgressCircular
                indeterminate
                color="grey-lighten-5"
              />
            </VRow>
          </template>
        </VImg>

        <div class="text-end">
          <span v-for="(size, index) in imageSizes" :key="index">
            <a
              class="text-link"
              @click="$openImage(activeImage.attachment.uuid_filename, size)"
            >
              {{ $t(`common.${size}`) }}
            </a>
            <span v-if="index < imageSizes.length - 1">| </span>
          </span>
        </div>
        <div
          v-if="drillcoreBoxImages && drillcoreBoxImages.length > 1"
          class="d-flex ma-2 align-center"
          style="overflow-x: auto"
        >
          <div
            v-for="(item, index) in drillcoreBoxImages"
            :key="index"
            class="ma-2"
          >
            <VHover v-slot="{ isHovering }">
              <VImg
                :src="
                  img(
                    item.attachment.uuid_filename,
                    { size: 'small' },
                    { provider: 'geocollections' },
                  )
                "
                :lazy-src="
                  img(
                    item.attachment.uuid_filename,
                    { size: 'small' },
                    { provider: 'geocollections' },
                  )
                "
                max-width="200"
                max-height="200"
                :class="{
                  'elevation-4': isHovering,
                  'elevation-2': !isHovering,
                }"
                class="rounded cursor-pointer bg-grey-lighten-2 transition-swing"
                @click="activeImage = drillcoreBoxImages[index]"
              >
                <template #placeholder>
                  <VRow
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <VProgressCircular
                      indeterminate
                      color="grey-lighten-5"
                    />
                  </VRow>
                </template>
              </VImg>
            </VHover>
          </div>
        </div>
      </VCol>
      <VCol :cols="12" :xl="4">
        <BaseTable class="border rounded">
          <TableRowLink
            v-if="drillcore"
            nuxt
            :title="$t('drillcoreBox.drillcore')"
            :value="
              $translate({
                et: drillcore.drillcore,
                en: drillcore.drillcore_en,
              })
            "
            :href="
              localePath({
                name: 'drillcore-id',
                params: { id: drillcore.id },
              })
            "
          />
          <TableRow
            :title="$t('drillcoreBox.depthStart')"
            :value="drillcoreBox.depth_start"
          />
          <TableRow
            :title="$t('drillcoreBox.depthEnd')"
            :value="drillcoreBox.depth_end"
          />
          <TableRow
            :title="$t('drillcoreBox.depthOther')"
            :value="drillcoreBox.depth_other"
          />
          <TableRow
            :title="$t('drillcoreBox.diameter')"
            :value="drillcoreBox.diameter"
          />
          <TableRowLink
            v-if="drillcoreBox.stratigraphy_top"
            :title="$t('drillcoreBox.stratigraphyTop')"
            :value="
              $translate({
                et: drillcoreBox.stratigraphy_top.stratigraphy,
                en: drillcoreBox.stratigraphy_top.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: drillcoreBox.stratigraphy_top.id },
              })
            "
          />
          <TableRow
            :title="$t('drillcoreBox.stratigraphyTopFree')"
            :value="drillcoreBox.stratigraphy_top_free"
          />
          <TableRowLink
            v-if="drillcoreBox.stratigraphy_base"
            :title="$t('drillcoreBox.stratigraphyBase')"
            :value="
              $translate({
                et: drillcoreBox.stratigraphy_base.stratigraphy,
                en: drillcoreBox.stratigraphy_base.stratigraphy_en,
              })
            "
            nuxt
            :href="
              localePath({
                name: 'stratigraphy-id',
                params: { id: drillcoreBox.stratigraphy_base.id },
              })
            "
          />
          <TableRow
            :title="$t('drillcoreBox.stratigraphyBaseFree')"
            :value="drillcoreBox.stratigraphy_base_free"
          />

          <TableRow
            v-if="drillcoreBox.date_added"
            :title="$t('drillcoreBox.dateAdded')"
            :value="$formatDate(drillcoreBox.date_added)"
          />
          <TableRow
            v-if="drillcoreBox.date_changed"
            :title="$t('drillcoreBox.dateChanged')"
            :value="$formatDate(drillcoreBox.date_changed)"
          />
          <TableRow
            :title="$t('drillcoreBox.remarks')"
            :value="drillcoreBox.remarks"
          />
        </BaseTable>
      </VCol>
    </VRow>
  </VContainer>
</template>
