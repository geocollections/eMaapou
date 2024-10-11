<script setup lang="ts">
import {
  mdiInformationOutline,
  mdiMagnify,
  mdiNewspaperVariantOutline,
} from "@mdi/js";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from "~/constants";

defineProps<{ drawer: boolean }>();

const emit = defineEmits<{
  "update:navigationDrawer": [value: boolean];
}>();

const localePath = useLocalePath();

const routes = [
  {
    routeName: "search",
    text: "common.search",
    icon: mdiMagnify,
  },
  {
    routeName: "about",
    text: "common.about",
    icon: mdiInformationOutline,
  },
  {
    routeName: "news",
    text: "common.news",
    icon: mdiNewspaperVariantOutline,
  },
];
</script>

<template>
  <div
    :model-value="drawer"
    app
    clipped
    location="right"
    temporary
    color="white"
    class="elevation-2"
    @update:model-value="emit('update:navigationDrawer', $event)"
  >
    <div class="more-menu py-4 mb-6">
      <ul class="py-1" :aria-label="$t('title')">
        <li
          v-for="route in routes"
          :key="route.routeName"
          class="header-menu-item rounded my-1"
          color="grey-darken-4"
          role="option"
          :to="localePath({ name: route.routeName })"
        >
          <div class="d-flex py-1">
            <div class="mr-1">
              {{ route.icon }}
            </div>
            <span class="align-self-center montserrat">{{
              $t(route.text)
            }}</span>
          </div>
        </li>
      </ul>
      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t("landing.searchRoutes") }}
      </div>

      <div id="divider" class="bg-primary" />

      <ul class="py-1" :aria-label="$t('landing.searchRoutes')">
        <BaseMenuListItem
          v-for="(item, index) in BROWSE_TAXON_LIST"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          role="option"
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
        <div
          id="divider"
          class="my-1"
          aria-hidden="true"
        />
        <BaseMenuListItem
          v-for="(item, index) in BROWSE_LAB_LIST"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          role="option"
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />

        <div
          id="divider"
          class="my-1"
          aria-hidden="true"
        />
        <BaseMenuListItem
          v-for="(item, index) in BROWSE_GEOLOGY_LIST"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          role="option"
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </ul>

      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t("landing.otherServices") }}
      </div>

      <div id="divider" class="bg-primary" />

      <ul class="py-1" :aria-label="$t('landing.otherServices')">
        <li
          v-for="tabId in SERVICES.ids"
          :key="SERVICES[tabId].href"
          tag="a"
          class="header-menu-item rounded my-1"
          color="grey-darken-4"
          target="_blank"
          role="option"
          :href="SERVICES[tabId].href"
        >
          <div class="py-1">
            <span class="montserrat">{{
              $t(SERVICES[tabId].title)
            }}</span>
          </div>
        </li>
      </ul>

      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t("common.lang") }}
      </div>

      <div id="divider" class="bg-primary" />

      <LanguageList class="py-0" />
    </div>
  </div>
</template>

<style scoped>
.more-menu .section-title {
  font-size: 13px;
  font-weight: 500;
  /* letter-spacing: 1.5px; */
  margin-top: 24px;
  text-transform: uppercase;
}
.more-menu hr {
  border: 0;
  border-top: 2px solid #959595;
  margin: 16px 0;
  opacity: 0.2;
}

.lang-icon {
  height: 20px;
  width: 20px !important;
}

.v-list-item::before {
  border-radius: 4px;
}
</style>
