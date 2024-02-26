<script setup lang="ts">
import type { OverlayImage } from "~/components/ImageOverlay.vue";

const showOverlay = ref(false);
const overlayImage = ref<OverlayImage>();
function openOverlay(image: OverlayImage) {
  overlayImage.value = image;
  showOverlay.value = true;
}
const localePath = useLocalePath();
const img = useImage();
</script>

<template>
  <BaseDataTable v-bind="$attrs">
    <template #item.file="{ item }">
      <ThumbnailAttachment
        v-if="item.attachment"
        :src="
          img(
            `${item.attachment.filename}`,
            { size: 'large' },
            { provider: 'geocollections' },
          )
        "
        :preview-src="
          img(
            `${item.attachment.filename}`,
            { size: 'small' },
            { provider: 'geocollections' },
          )
        "
        :type="item.attachment.attachment_format.value"
        @click:image="
          openOverlay({
            src: item.attachment.uuid_filename,
            modifiers: { size: 'large' },
            options: { provider: 'geocollections' },
            id: item.attachment.id,
          })
        "
      />
    </template>
    <template #item.description="{ item }">
      <NuxtLink
        v-if="item.attachment"
        class="text-link"
        :to="
          localePath({ name: 'file-id', params: { id: item.attachment.id } })
        "
      >
        {{
          $translate({
            et: item.attachment.description,
            en: item.attachment.description_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.attachment && item.attachment.author">
        {{ item.attachment.author.agent }}
      </div>
    </template>
  </BaseDataTable>
  <ImageOverlay v-model="showOverlay" :image="overlayImage" />
</template>
