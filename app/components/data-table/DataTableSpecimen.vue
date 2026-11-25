<script setup lang="ts">
import type { PortalTableProps } from "~/components/PortalDataTable.vue";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<PortalTableProps>(), { showSearch: true, showTools: true, dynamicHeaders: true });

const emit = defineEmits<{ "click:row": [payload: { index: number; id: number }] }>();
function recordClick(item: any) {
  const index = props.items.findIndex(row => row.id === item.id);
  emit("click:row", {
    index: Math.max(0, index),
    id: Number(item.id),
  });
}
const source = useCollectionImage();
const localePath = useLocalePath();
const { t } = useI18n();
const { $translate } = useNuxtApp();
function linkPreview(kind: "specimen" | "locality" | "stratigraphy" | "taxon" | "rock", name: string | number) {
  return t(`portal.specimenTable.${kind}`, { name });
}
function translated(item: any, field: string) {
  return $translate({ et: item[field], en: item[`${field}_en`] }) || item.id;
}
function nameLinks(item: any) {
  const links: { kind: "rock" | "taxon"; name: string; to: string }[] = [];
  if (item.rock_id) {
    links.push({
      kind: "rock",
      name: translated(item, "rock"),
      to: `https://kivid.info/${item.rock_id}`,
    });
  }
  if (item.taxon_id)
    links.push({ kind: "taxon", name: item.taxon, to: `https://fossiilid.info/${item.taxon_id}` });
  return links;
}
const showOverlay = ref(false);
const currentOverlaySpecimen = ref<any>();
const initIndex = ref(0);

const specimenImageFunc = useSpecimenImageFunction();
const { images, total, nextImages, reset: resetImages } = useImages(specimenImageFunc);

async function openOverlay(sample: any) {
  resetImages();

  currentOverlaySpecimen.value = sample;
  await nextImages(sample);

  showOverlay.value = true;
}

function handleEnd() {
  if (images.value.length < 1)
    return;
  nextImages(currentOverlaySpecimen.value);
}
</script>

<template>
  <PortalDataTable
    v-bind="{ ...$attrs, ...props }"
    :mobile-cards="modern"
    :item-to="(item) => localePath({ name: 'specimen-id', params: { id: item.id } })"
    @click:row="emit('click:row', { index: $event.index, id: Number($event.id) })"
  >
    <template #item.id="{ item }">
      <UTooltip :text="linkPreview('specimen', item.specimen_full_name || item.id)" :delay-duration="250">
        <ULink
          :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
          :aria-label="linkPreview('specimen', item.specimen_full_name || item.id)"
          class="specimen-record-link"
          @click="recordClick(item)"
        >
          {{ item.id }}
        </ULink>
      </UTooltip>
    </template>
    <template #item.specimen_full_name="{ item }">
      <UTooltip :text="linkPreview('specimen', item.specimen_full_name)" :delay-duration="250">
        <NuxtLink
          :aria-label="linkPreview('specimen', item.specimen_full_name)"
          class="specimen-record-link"
          :to="localePath({ name: 'specimen-id', params: { id: item.id } })"
          @click="recordClick(item)"
        >{{ item.specimen_full_name }}</NuxtLink>
      </UTooltip>
    </template>
    <template #item.locality="{ item }">
      <UTooltip
        v-if="item.locality_id"
        :text="linkPreview('locality', translated(item, 'locality'))"
        :delay-duration="250"
      >
        <NuxtLink
          :aria-label="linkPreview('locality', translated(item, 'locality'))"
          class="portal-record-link"
          :to="
            localePath({
              name: 'locality-id',
              params: { id: item.locality_id },
            })
          "
        >
          {{ $translate({ et: item.locality, en: item.locality_en }) }}
        </NuxtLink>
      </UTooltip>
      <div v-else>
        {{ $translate({ et: item.locality, en: item.locality_en }) }}
      </div>
    </template>
    <template #item.kind="{ item }">
      {{
        $translate({
          et: item.specimen_kind,
          en: item.specimen_kind_en,
        })
      }}
    </template>
    <template #item.stratigraphy="{ item }">
      <UTooltip
        v-if="item.stratigraphy_id"
        :text="linkPreview('stratigraphy', translated(item, 'stratigraphy'))"
        :delay-duration="250"
      >
        <NuxtLink
          :aria-label="linkPreview('stratigraphy', translated(item, 'stratigraphy'))"
          class="portal-record-link"
          :to="
            localePath({
              name: 'stratigraphy-id',
              params: { id: item.stratigraphy_id },
            })
          "
        >
          {{
            $translate({
              et: item.stratigraphy,
              en: item.stratigraphy_en,
            })
          }}
        </NuxtLink>
      </UTooltip>
    </template>
    <template #item.lithostratigraphy="{ item }">
      <UTooltip
        v-if="item.lithostratigraphy_id"
        :text="linkPreview('stratigraphy', translated(item, 'lithostratigraphy'))"
        :delay-duration="250"
      >
        <NuxtLink
          :aria-label="linkPreview('stratigraphy', translated(item, 'lithostratigraphy'))"
          class="portal-record-link"
          :to="
            localePath({
              name: 'stratigraphy-id',
              params: { id: item.lithostratigraphy_id },
            })
          "
        >
          {{
            $translate({
              et: item.lithostratigraphy,
              en: item.lithostratigraphy_en,
            })
          }}
        </NuxtLink>
      </UTooltip>
    </template>
    <template #item.taxon="{ item }">
      <UTooltip
        v-if="item.taxon_id"
        :text="linkPreview('taxon', item.taxon)"
        :delay-duration="250"
      >
        <ULink
          :to="`https://fossiilid.info/${item.taxon_id}`"
          target="_blank"
          :aria-label="linkPreview('taxon', item.taxon)"
          class="portal-record-link"
        >
          {{ item.taxon }}
          <UIcon name="i-lucide-arrow-up-right" class="portal-link-icon" />
        </ULink>
      </UTooltip>
    </template>
    <template #item.image="{ item }">
      <div class="flex items-center">
        <UTooltip
          v-if="item.image"
          :text="t('portal.specimenTable.previewSpecimenPhotographs')"
          :delay-duration="250"
        >
          <UButton
            color="neutral"
            variant="ghost"
            class="portal-table-photo-button header-focus"
            :aria-label="t('portal.specimenTable.previewPhotographsRecordname', { recordName: item.specimen_full_name || item.id })"
            @click="openOverlay(item)"
          >
            <NuxtImg
              :src="source(item.image, 'small')"
              :alt="item.specimen_full_name || String(item.id)"
              width="56"
              height="36"
              loading="lazy"
            />
          </UButton>
        </UTooltip>
        <span v-if="item.image_count > 1" class="portal-specimen-subtitle">
          +{{ item.image_count - 1 }}
        </span>
      </div>
    </template>
    <template #item.name="{ item }">
      <div class="portal-specimen-name-links">
        <UTooltip
          v-for="link in nameLinks(item)"
          :key="link.to"
          :text="linkPreview(link.kind, link.name)"
          :delay-duration="250"
        >
          <ULink
            :to="link.to"
            target="_blank"
            :aria-label="linkPreview(link.kind, link.name)"
            class="portal-record-link"
          >
            {{ link.name }}<UIcon name="i-lucide-arrow-up-right" class="portal-link-icon" />
          </ULink>
        </UTooltip>
      </div>
    </template>
    <template #item.original_status="{ item }">
      {{
        $translate({ et: item.original_status, en: item.original_status_en })
      }}
    </template>
    <template #item.depthCombined="{ item }">
      <span v-if="item.depth != null">{{ Number(item.depth).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}<template v-if="item.depth_interval != null">–{{ Number(item.depth_interval).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}</template></span>
      <span v-else>—</span>
    </template>
    <template #item.depthFrom="{ item }">
      <span v-if="item.depth != null">
        {{
          item.depth.toFixed(2)
        }}
      </span>
    </template>
    <template #item.depthTo="{ item }">
      <span v-if="item.depth_interval != null">
        {{
          item.depth_interval.toFixed(2)
        }}
      </span>
    </template>
  </PortalDataTable>
  <PortalPhotoViewer
    v-model="showOverlay"
    :initial-slide="initIndex"
    :images="images"
    :total="total"
    @end="handleEnd"
  >
    <template #info="{ item }">
      <div v-if="item.info.author">
        <span class="font-bold">{{ $t("photo.author") }}: </span>
        <span>{{ item.info.author }}</span>
      </div>
      <div v-if="item.info.date">
        <span class="font-bold">{{ $t("photo.date") }}: </span>
        <span>
          {{ $formatDate(item.info.date) }}
        </span>
      </div>
    </template>
  </PortalPhotoViewer>
</template>
