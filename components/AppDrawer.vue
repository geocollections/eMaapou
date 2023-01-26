<template>
  <v-navigation-drawer
    :value="drawer"
    app
    clipped
    right
    temporary
    color="white"
    class="elevation-2"
    :style="`z-index: 2050; margin-top: ${$vuetify.application.top}px`"
    :class="{ 'use-padding-bottom': $vuetify.breakpoint.smAndDown }"
    @input="$emit('update:navigationDrawer', $event)"
  >
    <v-container class="more-menu py-4 mb-6">
      <v-list class="py-1 px-2">
        <v-list-item
          v-for="route in routes"
          :key="route.routeName"
          nuxt
          class="header-menu-item rounded my-1"
          color="accent darken-1"
          :to="localePath({ name: route.routeName })"
        >
          <v-list-item-title class="d-flex py-1">
            <v-icon class="mr-1">{{ route.icon }}</v-icon>
            <span class="align-self-center montserrat">{{
              $t(route.text)
            }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t('landing.searchRoutes') }}
      </div>

      <v-divider class="primary" />

      <v-list class="py-1 px-2">
        <base-menu-list-item
          v-for="(item, index) in browseTaxon"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label).toString()"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </v-list>
      <v-divider class="mx-3 my-1" />
      <v-list class="py-1 px-2">
        <base-menu-list-item
          v-for="(item, index) in browseLab"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label).toString()"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </v-list>

      <v-divider class="mx-3 my-1" />
      <v-list class="py-1 px-2">
        <base-menu-list-item
          v-for="(item, index) in browseGeography"
          :key="`browse-geography-item-${index}`"
          class="my-1"
          :icon="item.icon"
          :label="$t(item.label).toString()"
          nuxt
          trailing-icon=""
          :to="localePath({ name: item.routeName })"
        />
      </v-list>

      <div class="montserrat font-weight-medium pl-2 mt-2">Services</div>

      <v-divider class="primary" />

      <v-list class="py-1 px-2">
        <v-list-item
          v-for="tabId in services.ids"
          :key="services[tabId].href"
          tag="a"
          class="header-menu-item rounded my-1"
          color="accent darken-1"
          target="_blank"
          :href="services[tabId].href"
        >
          <v-list-item-title class="py-1">
            <span class="montserrat">{{ $t(services[tabId].title) }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <div class="montserrat font-weight-medium pl-2 mt-2">
        {{ $t('common.lang') }}
      </div>

      <v-divider class="primary" />

      <language-list class="py-0" />
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  mdiMagnify,
  mdiInformationOutline,
  mdiNewspaperVariantOutline,
  mdiFileImageOutline,
} from '@mdi/js'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import LanguageList from '~/components/language/LanguageList.vue'
import BaseMenuListItem from '~/components/base/BaseMenuListItem.vue'
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from '~/constants'

export default defineComponent({
  name: 'AppDrawer',
  components: { LanguageList, BaseMenuListItem },
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const icons = computed(() => ({ mdiFileImageOutline }))
    const state = reactive({
      browseGeography: BROWSE_GEOLOGY_LIST,
      browseLab: BROWSE_LAB_LIST,
      browseTaxon: BROWSE_TAXON_LIST,
      services: SERVICES,
      routes: [
        {
          routeName: 'search',
          text: 'common.search',
          icon: mdiMagnify,
        },
        {
          routeName: 'about',
          text: 'common.about',
          icon: mdiInformationOutline,
        },
        {
          routeName: 'news',
          text: 'common.news',
          icon: mdiNewspaperVariantOutline,
        },
      ],
    })
    return { ...toRefs(state), icons }
  },
})
</script>

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
  content: '\A0';
}

.flag-et {
  background-image: url('~assets/et.svg');
}

.flag-en {
  background-image: url('~assets/en.svg');
}

.v-list-item::before {
  border-radius: 4px;
}
</style>
