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
  <v-container style="margin: initial">
    <v-row>
      <v-col>
        <v-hover v-slot="{ isHovering }">
          <!-- TODO: Add placeholder, for case when box does not have a picture (filename check) -->
          <v-img
            contain
            class="rounded cursor-pointer transition-swing"
            :class="{
              'elevation-8': isHovering,
              'elevation-4': !isHovering,
            }"
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
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                />
              </v-row>
            </template>
          </v-img>
        </v-hover>

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
            <v-hover v-slot="{ isHovering }">
              <v-img
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
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                    />
                  </v-row>
                </template>
              </v-img>
            </v-hover>
          </div>
        </div>
      </v-col>
      <v-col :cols="12" :xl="4">
        <v-card>
          <base-table>
            <table-row-link
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
            <table-row
              :title="$t('drillcoreBox.depthStart')"
              :value="drillcoreBox.depth_start"
            />
            <table-row
              :title="$t('drillcoreBox.depthEnd')"
              :value="drillcoreBox.depth_end"
            />
            <table-row
              :title="$t('drillcoreBox.depthOther')"
              :value="drillcoreBox.depth_other"
            />
            <table-row
              :title="$t('drillcoreBox.diameter')"
              :value="drillcoreBox.diameter"
            />
            <table-row-link
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
            <table-row
              :title="$t('drillcoreBox.stratigraphyTopFree')"
              :value="drillcoreBox.stratigraphy_top_free"
            />
            <table-row-link
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
            <table-row
              :title="$t('drillcoreBox.stratigraphyBaseFree')"
              :value="drillcoreBox.stratigraphy_base_free"
            />

            <table-row
              v-if="drillcoreBox.date_added"
              :title="$t('drillcoreBox.dateAdded')"
              :value="$formatDate(drillcoreBox.date_added)"
            />
            <table-row
              v-if="drillcoreBox.date_changed"
              :title="$t('drillcoreBox.dateChanged')"
              :value="$formatDate(drillcoreBox.date_changed)"
            />
            <table-row
              :title="$t('drillcoreBox.remarks')"
              :value="drillcoreBox.remarks"
            />
          </base-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
