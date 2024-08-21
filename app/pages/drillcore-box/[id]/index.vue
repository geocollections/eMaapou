<script setup lang="ts">
import type { DrillcoreBox } from "../[id].vue";

const props = defineProps<{ drillcoreBox: DrillcoreBox }>();

const img = useImage();
const localePath = useLocalePath();
const route = useRoute();
const { $apiFetch } = useNuxtApp();

const drillcore = computed(() => props.drillcoreBox.drillcore);
const imageSizes = ["small", "medium", "large", "original"];

const { data } = await useAsyncData("images", async () => {
  const attachmentLinks = await $apiFetch<GeoloogiaListResponse<{ uuid_filename: string }>>(`/drillcore-boxes/${route.params.id}/attachments/`, {
    query: {
      fields: "uuid_filename",
      ordering: "-is_preferred",
    },
  });

  const drillcoreBoxImages = attachmentLinks.results;
  const activeImage = drillcoreBoxImages[0];

  return {
    activeImage,
    drillcoreBoxImages,
  };
});

const drillcoreBoxImages = computed(() => data.value?.drillcoreBoxImages);
const activeImage = computed(() => data.value?.activeImage);
</script>

<template>
  <VContainer style="margin: initial">
    <VRow>
      <VCol>
        <VImg
          v-if="activeImage"
          contain
          class="rounded border cursor-pointer transition-swing"
          :lazy-src="
            img(
              activeImage.uuid_filename,
              { size: 'small' },
              { provider: 'geocollections' },
            )
          "
          :src="
            img(
              activeImage.uuid_filename,
              { size: 'large' },
              { provider: 'geocollections' },
            )
          "
          max-width="2000"
          max-height="1000"
          @click="$openImage(activeImage.uuid_filename)"
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

        <div v-if="activeImage" class="text-end">
          <span v-for="(size, index) in imageSizes" :key="index">
            <a
              class="text-link"
              @click="$openImage(activeImage.uuid_filename, size)"
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
            <VHover v-slot="{ isHovering, props: hoverProps }">
              <VImg
                v-bind="hoverProps"
                :src="
                  img(
                    item.uuid_filename,
                    { size: 'small' },
                    { provider: 'geocollections' },
                  )
                "
                :lazy-src="
                  img(
                    item.uuid_filename,
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
          <TableRow
            v-if="drillcore"
            :title="$t('drillcoreBox.drillcore')"
            :value="drillcore"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'locality-id',
                    params: { id: value.id },
                  })
                "
              >
                {{
                  $translate({
                    et: value.name,
                    en: value.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>
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
            :value="drillcoreBox.depth_text"
          />
          <TableRow
            :title="$t('drillcoreBox.diameter')"
            :value="drillcoreBox.diameter"
          />
          <TableRow
            v-if="drillcoreBox.stratigraphy_top"
            :title="$t('drillcoreBox.stratigraphyTop')"
            :value="drillcoreBox.stratigraphy_top"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: value.id },
                  })
                "
              >
                {{
                  $translate({
                    et: value.name,
                    en: value.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            :title="$t('drillcoreBox.stratigraphyTopFree')"
            :value="drillcoreBox.stratigraphy_top_text"
          />
          <TableRow
            v-if="drillcoreBox.stratigraphy_base"
            :title="$t('drillcoreBox.stratigraphyTop')"
            :value="drillcoreBox.stratigraphy_base"
          >
            <template #value="{ value }">
              <BaseLink
                :to="
                  localePath({
                    name: 'stratigraphy-id',
                    params: { id: value.id },
                  })
                "
              >
                {{
                  $translate({
                    et: value.name,
                    en: value.name_en,
                  })
                }}
              </BaseLink>
            </template>
          </TableRow>
          <TableRow
            :title="$t('drillcoreBox.stratigraphyBaseFree')"
            :value="drillcoreBox.stratigraphy_base_text"
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
