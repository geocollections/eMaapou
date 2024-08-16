<script setup lang="ts">
import { mdiChevronDown, mdiMenu } from "@mdi/js";
import { useDisplay } from "vuetify";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from "~/constants";

const emit = defineEmits<{
  "toggle:navigationDrawer": [];
}>();

const localePath = useLocalePath();
const display = useDisplay();
</script>

<template>
  <VAppBar
    :height="48"
    :elevation="2"
    :class="{
      'app-bar-full': display.mdAndUp.value,
      'app-bar-mobile pl-2': !display.mdAndUp.value,
    }"
    color="grey-darken-2"
  >
    <!--
          NOTE: Tooltip is implemented with activator prop so that it does not disappear before chaning routes.
          Using v-slot:activator added a transition that made the title disappear when clicked.
          https://github.com/vuetifyjs/vuetify/issues/10578 comment by eduardo76 Nov 9, 2020
         -->
    <AppBarLogo />
    <VToolbarItems class="w-100 mr-md-2">
      <VBtn
        v-if="display.mdAndUp.value"
        id="browse_menu_btn"
        aria-label="browse"
        variant="text"
        class="montserrat"
        color="white"
        style="text-transform: capitalize"
      >
        {{ $t("common.browse") }}
        <VIcon color="accent" end>
          {{ mdiChevronDown }}
        </VIcon>
      </VBtn>
      <VMenu
        v-if="display.mdAndUp.value"
        activator="#browse_menu_btn"
        content-class="mt-1"
        transition="slide-y-transition"
        location="bottom"
        offset="10"
      >
        <VCard max-width="1000">
          <VCardActions class="d-flex align-baseline">
            <VList class="mx-3" width="250">
              <BaseMenuListItem
                v-for="(item, index) in BROWSE_TAXON_LIST"
                :key="`browse-lab-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label)"
                :to="localePath({ name: item.routeName })"
              />
            </VList>
            <VDivider
              class="mx-3 my-2"
              vertical
              style="height: inherit"
            />
            <VList class="mx-3" width="250">
              <BaseMenuListItem
                v-for="(item, index) in BROWSE_LAB_LIST"
                :key="`browse-lab-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label)"
                :to="localePath({ name: item.routeName })"
              />
            </VList>

            <VDivider
              class="mx-3 my-2"
              vertical
              style="height: inherit"
            />
            <VList class="mx-3" width="250">
              <BaseMenuListItem
                v-for="(item, index) in BROWSE_GEOLOGY_LIST"
                :key="`browse-geography-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label)"
                :to="localePath({ name: item.routeName })"
              />
            </VList>
          </VCardActions>
        </VCard>
      </VMenu>
      <div
        class="d-flex align-center elevation-0 ml-2 mr-0 mr-sm-2"
        style="width: 100%"
        :class="{ 'mobile-search mx-5': !display.mdAndUp.value }"
      >
        <QuickSearchInput />
      </div>
    </VToolbarItems>
    <VToolbarItems
      class="ml-auto"
    >
      <VBtn
        v-if="display.mdAndUp.value"
        aria-label="about page"
        variant="text"
        class="montserrat font-weight-medium"
        style="text-transform: capitalize"
        color="white"
        :to="localePath({ name: 'about' })"
      >
        {{ $t("common.about") }}
      </VBtn>

      <VBtn
        v-if="display.mdAndUp.value"
        id="services_menu_btn"
        aria-label="browse"
        variant="text"
        color="white"
        class="montserrat"
        style="text-transform: capitalize"
      >
        {{ $t("common.services") }}
        <VIcon
          :icon="mdiChevronDown"
          color="accent"
          end
        />
      </VBtn>
      <VMenu
        v-if="display.mdAndUp.value"
        activator="#services_menu_btn"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        location="bottom"
        offset="10"
      >
        <VCard width="550">
          <VCardActions class="d-block">
            <VList
              style="max-height: 450px; flex-flow: column wrap"
              class="d-flex"
            >
              <BaseMenuListItem
                v-for="(tabId, index) in SERVICES.ids"
                :key="`service-${index}`"
                class="my-1"
                target="_blank"
                style="width: 250px"
                :href="SERVICES[tabId].href"
                :label="$t(SERVICES[tabId].title)"
                label-only
              />
            </VList>
          </VCardActions>
        </VCard>
      </VMenu>
      <LanguageSwitcher
        v-if="display.mdAndUp.value"
        color="white"
        class="ml-auto"
      />
      <VBtn
        v-if="!display.mdAndUp.value"
        variant="text"
        class="montserrat ml-auto"
        aria-label="Open navigation drawer"
        style="text-transform: capitalize"
        @click.stop="emit('toggle:navigationDrawer')"
      >
        <VIcon color="accent">
          {{ mdiMenu }}
        </VIcon>
      </VBtn>
    </VToolbarItems>
  </VAppBar>
</template>

<style scoped lang="scss">
.tab {
  color: #424242 !important;
}

.mobile-search {
  width: 100%;
}
.app-bar-search {
  max-width: 600px;
}

.active-tab {
  color: rgb(var(--v-theme-accent-darken1)) !important;
  font-weight: 600 !important;
}

.app-bar-mobile :deep(.v-toolbar__content) {
  // max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
  padding-right: 0px;
  // padding-left: 20px;
}

.app-bar-transparent {
  &:hover {
    background-color: #333333 !important;
  }
}

.app-bar-full :deep(.v-toolbar__content) {
  // max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
  // padding-right: 0px;
  // padding-left: 20px;
  // border-bottom: map-get($map: $grey, $key: 'lighten-2') solid 1px !important;
}

.active-card {
  background-color: rgba(9, 98, 124, 0.12) !important;

  & div {
    color: rgb(var(--v-theme-accent-lighten1)) !important;
  }

  & .v-icon {
    color: rgb(var(--v-theme-accent-lighten1)) !important;
  }
}
</style>
