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

defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
});

const localePath = useLocalePath();

const state = reactive({
  browseGeography: BROWSE_GEOLOGY_LIST,
  browseLab: BROWSE_LAB_LIST,
  browseTaxon: BROWSE_TAXON_LIST,
  services: SERVICES,
  routes: [
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
  ],
});
</script>

<template>
  <VNavigationDrawer
    :model-value="drawer"
    app
    clipped
    location="right"
    temporary
    color="white"
    class="elevation-2"
    style="z-index: 2050; margin-top: 48px"
    :class="{ 'use-padding-bottom': $vuetify.display.smAndDown }"
    @update:model-value="$emit('update:navigationDrawer', $event)"
  >
    <VContainer class="more-menu py-4 mb-6">
      <VList class="py-1 px-2">
        <VListItem
          v-for="route in state.routes"
          :key="route.routeName"
          nuxt
          class="header-menu-item rounded my-1"
          color="accent-darken-1"
          :to="localePath({ name: route.routeName })"
        >
          <VListItemTitle class="d-flex py-1">
            <VIcon class="mr-1">
              {{ route.icon }}
            </VIcon>
            <span class="align-self-center montserrat">{{
              $t(route.text)
            }}</span>
          </VListItemTitle>
        </VListItem>
      </VList>
      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t("landing.searchRoutes") }}
      </div>

      <VDivider class="bg-primary" />

      <VList class="py-1 px-2">
        <BaseMenuListItem
          v-for="(item, index) in state.browseTaxon"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </VList>
      <VDivider class="mx-3 my-1" />
      <VList class="py-1 px-2">
        <BaseMenuListItem
          v-for="(item, index) in state.browseLab"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </VList>

      <VDivider class="mx-3 my-1" />
      <VList class="py-1 px-2">
        <BaseMenuListItem
          v-for="(item, index) in state.browseGeography"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label)"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </VList>

      <div class="montserrat font-weight-medium pl-2 mt-2">
        Services
      </div>

      <VDivider class="bg-primary" />

      <VList class="py-1 px-2">
        <VListItem
          v-for="tabId in state.services.ids"
          :key="state.services[tabId].href"
          tag="a"
          class="header-menu-item rounded my-1"
          color="accent-darken-1"
          target="_blank"
          :href="state.services[tabId].href"
        >
          <VListItemTitle class="py-1">
            <span class="montserrat">{{
              $t(state.services[tabId].title)
            }}</span>
          </VListItemTitle>
        </VListItem>
      </VList>

      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t("common.lang") }}
      </div>

      <VDivider class="bg-primary" />

      <LanguageList class="py-0" />
    </VContainer>
  </VNavigationDrawer>
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

.use-padding-bottom {
  padding-bottom: 56px;
}

.lang-icon {
  height: 20px;
  width: 20px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 100%;
}

.flag:before {
  content: "\A0";
}

.flag-et {
  background-image: url("~assets/et.svg");
}

.flag-en {
  background-image: url("~assets/en.svg");
}

.v-list-item::before {
  border-radius: 4px;
}
</style>
