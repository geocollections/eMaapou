<script setup lang="ts">
import type { OverlayImage } from "~/components/ImageOverlay.vue";

const { t } = useI18n();
const img = useImage();
const localePath = useLocalePath();
const showOverlay = ref(false);
const overlayImage = ref<OverlayImage>();
function openOverlay(image: OverlayImage) {
  overlayImage.value = image;
  showOverlay.value = true;
}
function getAttachmentType(type: number) {
  switch (type) {
    case 1:
      return t("attachment.typeSpecimen");
    case 2:
      return t("attachment.typeImage");
    case 4:
      return t("attachment.typeReference");
    default:
      return t("attachment.typeOther");
  }
}
</script>

<template>
  <div>
    <BaseDataTable v-bind="$attrs">
      <template #item.id="{ item }">
        <NuxtLink
          v-if="item.attachment_id"
          class="text-link"
          :to="
            localePath({
              name: 'file-id',
              params: { id: item.attachment_id },
            })
          "
        >
          {{ item.attachment_id }}
        </NuxtLink>
      </template>
      <template #item.date="{ item }">
        <div v-if="item.date_created">
          {{ $formatDate(item.date_created) }}
        </div>
        <div v-else>
          {{ item.date_created_free }}
        </div>
      </template>

      <template #item.reference="{ item }">
        <BaseLinkExternal
          v-if="item.reference_id"
          @click.native="$openGeology('reference', item.reference_id)"
        >
          {{ item.reference }}
        </BaseLinkExternal>
      </template>

      <template #item.type="{ item }">
        <div>{{ getAttachmentType(item.specimen_image_attachment) }}</div>
      </template>

      <template #item.image="{ item }">
        <ThumbnailImage
          v-if="item.uuid_filename"
          class="my-1"
          :src="
            img(
              `${item.uuid_filename}`,
              { size: 'small' },
              { provider: 'geocollections' },
            )
          "
          @click="
            openOverlay({
              src: item.uuid_filename,
              modifiers: { size: 'large' },
              options: { provider: 'geocollections' },
              id: item.id,
            })
          "
        />
      </template>
    </BaseDataTable>
    <ImageOverlay v-model="showOverlay" :image="overlayImage" />
  </div>
</template>
