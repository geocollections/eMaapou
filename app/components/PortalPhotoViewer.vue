<script setup lang="ts">
import type { Image } from "~/components/ImageBar.vue";

const props = withDefaults(defineProps<{ modelValue: boolean; images: Image<any>[]; initialSlide?: number; total?: number }>(), { initialSlide: 0 });
const emit = defineEmits<{ "update:modelValue": [value: boolean]; "end": [] }>();
const source = useCollectionImage();
const { locale } = useI18n();
const index = ref(props.initialSlide);
const current = computed(() => props.images[index.value]!);
const pendingNext = ref(false);
watch(() => props.initialSlide, value => index.value = value);
watch(() => props.images.length, (length, before) => {
  if (pendingNext.value && length > before)
    index.value++;
  pendingNext.value = false;
  index.value = Math.max(0, Math.min(index.value, length - 1));
});
function next() {
  if (index.value < props.images.length - 1) {
    index.value++;
  }
  else if (props.images.length < (props.total ?? props.images.length)) {
    pendingNext.value = true;
    emit("end");
  }
}
onKeyStroke(["ArrowLeft", "ArrowRight"], (event) => {
  if (!props.modelValue)
    return;
  event.preventDefault();
  if (event.key === "ArrowLeft")
    index.value = Math.max(0, index.value - 1);
  else next();
});
</script>

<template>
  <UModal
    :open="modelValue"
    :title="locale === 'et' ? 'Foto eelvaade' : 'Image preview'"
    :ui="{ content: 'portal-photo-dialog', body: 'portal-photo-body', footer: 'portal-photo-footer' }"
    @update:open="emit('update:modelValue', $event)"
  >
    <template #body>
      <img
        v-if="current"
        :src="source(current.filename, 'large')"
        :alt="String(current.info?.title ?? current.id)"
        class="portal-photo-image"
      ><slot
        name="info"
        :item="current"
        :index="index"
      />
    </template>
    <template #footer>
      <div class="portal-photo-navigation">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-chevron-left"
          :disabled="index === 0"
          :aria-label="locale === 'et' ? 'Eelmine pilt' : 'Previous image'"
          @click="index--"
        /><span>{{ index + 1 }} / {{ total ?? images.length }}</span><UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-chevron-right"
          :disabled="index >= images.length - 1 && images.length >= (total ?? images.length)"
          :aria-label="locale === 'et' ? 'Järgmine pilt' : 'Next image'"
          @click="next"
        />
      </div>
      <slot
        name="actions"
        :item="current"
        :index="index"
      >
        <UButton
          v-if="current"
          color="neutral"
          variant="outline"
          icon="i-lucide-download"
          :href="source(current.filename, 'large')"
          target="_blank"
        >
          {{ locale === 'et' ? 'Laadi foto alla' : 'Download image' }}
        </UButton>
      </slot>
    </template>
  </UModal>
</template>
