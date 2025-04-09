<script setup lang="ts">
import type { Image } from "../ImageBar.vue";

type AttachmentImage = Image<undefined>;

const { t } = useI18n();
const img = useImage();
const localePath = useLocalePath();
const showOverlay = ref(false);
const images = ref<AttachmentImage[]>([]);
function openOverlay(image: AttachmentImage) {
  showOverlay.value = true;
  images.value = [image];
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
    <!-- @vue-ignore -->
    <BaseDataTable
      v-bind="$attrs"
      :item-to="(item) => localePath({ name: 'file-id', params: { id: item.id } })"
    >
      <template #item.id="{ item }">
        {{ item.attachment_id }}
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
          @click="$openGeokirjandus('reference', item.reference_id)"
        >
          {{ item.reference }}
        </BaseLinkExternal>
      </template>

      <template #item.type="{ item }">
        <div>{{ getAttachmentType(item.specimen_image_attachment) }}</div>
      </template>

      <template #item.image="{ item }">
        <ThumbnailImage
          v-if="item.format_value.startsWith('image') && item.uuid_filename"
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
              filename: item.uuid_filename,
              id: item.id,
              info: undefined,
            })
          "
        />
      </template>
    </BaseDataTable>
    <ImageOverlay
      v-model="showOverlay"
      :initial-slide="0"
      :images="images"
      :total="1"
    />
  </div>
</template>
