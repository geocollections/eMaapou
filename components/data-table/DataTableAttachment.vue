<script setup lang="ts">
import type { Image } from "../ImageBar.vue";

type AttachmentImage = Image<undefined>;
const showOverlay = ref(false);
const images = ref<AttachmentImage[]>([]);
function openOverlay(image: AttachmentImage) {
  showOverlay.value = true;
  images.value = [image];
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
            filename: item.attachment.uuid_filename,
            id: item.attachment.id,
            info: undefined,
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
  <ImageOverlayNew
    v-model="showOverlay"
    :initial-slide="0"
    :images="images"
    :total="1"
  />
</template>
