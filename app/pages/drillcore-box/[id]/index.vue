<script setup lang="ts">
import type { DrillcoreBox } from "../[id].vue";

const props = defineProps<{ drillcoreBox: DrillcoreBox }>();

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

  return {
    drillcoreBoxImages,
  };
}, {
  default: () => ({
    drillcoreBoxImages: [],
  }),
});

const activeImage = ref(data.value?.drillcoreBoxImages[0] ?? undefined);
const drillcoreBoxImages = computed(() => data.value?.drillcoreBoxImages);

function handleImageSwap(idx: number) {
  if (data.value === undefined)
    return;

  activeImage.value = data.value.drillcoreBoxImages[idx];
}

function isActiveImage(image: { uuid_filename: string }) {
  return image.uuid_filename === activeImage.value?.uuid_filename;
}
</script>

<template>
  <div class="portal-content-margin portal-content">
    <div class="portal-row">
      <div
        v-if="activeImage"

        class="portal-column-two-thirds portal-column"
      >
        <NuxtImg
          :src="activeImage.uuid_filename"
          provider="geocollections"
          :modifiers="{ size: 'large' }"
          fit="contain"
          class="portal-full-width"
        />
        <div class="text-end">
          <span v-for="(size, index) in imageSizes" :key="`image-size-${index}`">
            <a
              class="portal-record-link"
              @click="$openImage(activeImage.uuid_filename, size)"
            >
              {{ $t(`common.${size}`) }}
            </a>
            <span v-if="index < imageSizes.length - 1">| </span>
          </span>
        </div>
        <div
          v-if="drillcoreBoxImages.length > 1"

          class="portal-thumbnail-row portal-horizontal-scroll"
        >
          <NuxtImg
            v-for="(item, index) in drillcoreBoxImages"
            :key="`image-${index}`"
            :src="item.uuid_filename"
            provider="geocollections"
            :modifiers="{ size: 'small' }"
            height="175"
            class="portal-clickable-thumbnail portal-image-thumbnail"
            :class="{ 'portal-selected-image': isActiveImage(item) }"
            @click="
              handleImageSwap(index)
            "
          />
        </div>
      </div>
      <div

        class="portal-record-sidebar portal-column"
      >
        <table class="portal-bordered-table">
          <tbody>
            <TableRow
              v-if="drillcore"
              :title="$t('drillcoreBox.drillcore')"
              :value="drillcore"
            >
              <template #value="{ value }">
                <BaseLink
                  :to="
                    localePath({
                      name: 'drillcore-id',
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
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
