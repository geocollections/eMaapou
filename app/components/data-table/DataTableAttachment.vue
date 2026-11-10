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
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.file="{ item }">
      <ThumbnailAttachment
        :src="
          img(
            `${item.uuid_filename}`,
            { size: 'large' },
            { provider: 'geocollections' },
          )
        "
        :preview-src="
          img(
            `${item.uuid_filename}`,
            { size: 'small' },
            { provider: 'geocollections' },
          )
        "
        :type="item.mime_type.content_type"
        @click:image="
          openOverlay({
            filename: item.uuid_filename,
            id: item.id,
            info: undefined,
          })
        "
      />
    </template>
    <template #item.description="{ item }">
      <NuxtLink
        class="text-link"
        :to="
          localePath({ name: 'file-id', params: { id: item.id } })
        "
      >
        {{
          $translate({
            et: item.description,
            en: item.description_en,
          })
        }}
      </NuxtLink>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.author">
        {{ item.author.name }}
      </div>
    </template>
  </BaseDataTable>
  <ImageOverlay
    v-model="showOverlay"
    :initial-slide="0"
    :images="images"
    :total="1"
  />
</template>
