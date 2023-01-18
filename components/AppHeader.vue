<template>
  <v-app-bar
    app
    dark
    clipped-right
    clipped-left
    dense
    :elevation="getRouteBaseName() === 'index' ? 0 : 4"
    :absolute="getRouteBaseName() === 'index'"
    :elevate-on-scroll="getRouteBaseName() !== 'index'"
    :color="transparent ? 'transparent' : 'accent darken-1'"
    :class="{
      'app-bar-full': $vuetify.breakpoint.mdAndUp,
      'app-bar-mobile': !$vuetify.breakpoint.mdAndUp,
    }"
    style="z-index: 2060"
    :style="cssProps"
  >
    <!--
          NOTE: Tooltip is implemented with activator prop so that it does not disappear before chaning routes.
          Using v-slot:activator added a transition that made the title disappear when clicked.
          https://github.com/vuetifyjs/vuetify/issues/10578 comment by eduardo76 Nov 9, 2020
         -->
    <nuxt-link class="logo-link" :to="localePath({ path: '/' })">
      <nuxt-img
        :height="32"
        contain
        class="px-0 px-sm-3"
        provider="static"
        :src="logo"
        style="vertical-align: middle"
      />
    </nuxt-link>
    <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp" class="mr-md-2">
      <v-btn
        id="browse_menu_btn"
        aria-label="browse"
        text
        class="montserrat"
        style="text-transform: capitalize"
      >
        {{ $t('common.browse') }}
        <v-icon color="accent lighten-2" right>
          {{ icons.mdiChevronDown }}
        </v-icon>
      </v-btn>
      <v-menu
        activator="#browse_menu_btn"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        bottom
        right
        attach=""
      >
        <v-card max-width="1000">
          <v-card-actions class="d-flex align-baseline">
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                v-for="(item, index) in browseTaxon"
                :key="`browse-lab-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label).toString()"
                nuxt
                :to="localePath({ name: item.routeName })"
              />
            </v-list>
            <v-divider class="mx-3 my-2" vertical />
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                v-for="(item, index) in browseLab"
                :key="`browse-lab-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label).toString()"
                nuxt
                :to="localePath({ name: item.routeName })"
              />
            </v-list>

            <v-divider class="mx-3 my-2" vertical />
            <v-list class="mx-3" width="250">
              <base-menu-list-item
                v-for="(item, index) in browseGeography"
                :key="`browse-geography-item-${index}`"
                class="my-1"
                :icon="item.icon"
                :label="$t(item.label).toString()"
                nuxt
                :to="localePath({ name: item.routeName })"
              />
            </v-list>
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-btn
        nuxt
        aria-label="about page"
        text
        class="montserrat font-weight-medium"
        style="text-transform: capitalize"
        :to="localePath({ name: 'about' })"
      >
        {{ $t('common.about') }}
      </v-btn>

      <v-btn
        nuxt
        aria-label="news page"
        text
        class="montserrat font-weight-medium"
        style="text-transform: capitalize"
        :to="localePath({ name: 'news' })"
      >
        {{ $t('common.news') }}
      </v-btn>
      <v-btn
        id="services_menu_btn"
        aria-label="browse"
        text
        class="montserrat"
        style="text-transform: capitalize"
      >
        {{ $t('common.services') }}
        <v-icon color="accent lighten-2" right>
          {{ icons.mdiChevronDown }}
        </v-icon>
      </v-btn>
      <v-menu
        activator="#services_menu_btn"
        content-class="elevation-2 mt-1"
        transition="slide-y-transition"
        offset-y
        bottom
        right
        attach=""
      >
        <v-card width="550">
          <v-card-actions class="d-block">
            <v-list
              style="max-height: 450px; flex-flow: column wrap"
              class="d-flex"
            >
              <base-menu-list-item
                v-for="(tabId, index) in services.ids"
                :key="`service-${index}`"
                class="my-1"
                target="_blank"
                style="width: 250px"
                :href="services[tabId].href"
                :label="$t(services[tabId].title).toString()"
                label-only
              />
            </v-list>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar-items
      class="align-center ml-auto"
      :style="{
        width: !$vuetify.breakpoint.mdAndUp && showSearch ? '100%' : '100%',
      }"
    >
      <div
        v-if="showSearch"
        class="d-flex elevation-0 rounded mr-0 mr-sm-2"
        style="width: 100%"
        :class="{ 'mobile-search mx-5': !$vuetify.breakpoint.mdAndUp }"
      >
        <input-search
          v-model="query"
          input-class="rounded-l rounded-r-0 montserrat"
          background-color="white"
          dense
          flat
          :max-width="$vuetify.breakpoint.mdAndUp ? 650 : -1"
          :autofocus="false"
          :placeholder="$t('common.search').toString()"
          @enter="
            $router.push(
              localePath({ name: searchRouteName, query: { q: query } })
            )
          "
        />
        <v-hover v-slot="{ hover }">
          <v-btn
            height="38"
            :width="$vuetify.breakpoint.xsOnly ? 32 : 48"
            elevation="0"
            :color="hover ? 'warning' : 'grey lighten-2'"
            class="rounded-l-0"
            @click="
              $router.push(
                localePath({ name: searchRouteName, query: { q: query } })
              )
            "
          >
            <v-icon color="accent">{{ icons.mdiMagnify }}</v-icon>
          </v-btn>
        </v-hover>
      </div>
      <language-switcher v-if="$vuetify.breakpoint.mdAndUp" class="ml-auto" />
      <v-btn
        v-if="!$vuetify.breakpoint.mdAndUp"
        text
        class="montserrat ml-auto"
        aria-label="Open navigation drawer"
        style="text-transform: capitalize"
        @click.stop="$emit('toggle:navigationDrawer')"
      >
        <v-icon color="accent lighten-2" size="font-size: 24px">
          {{ icons.mdiMenu }}
        </v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { mdiChevronDown, mdiMagnify, mdiMenu } from '@mdi/js'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useRoute,
} from '@nuxtjs/composition-api'
import InputSearch from './input/InputSearch.vue'
import BaseMenuListItem from './base/BaseMenuListItem.vue'
import LanguageSwitcher from '~/components/language/LanguageSwitcher.vue'
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from '~/constants'
export default defineComponent({
  name: 'AppHeader',
  components: { LanguageSwitcher, InputSearch, BaseMenuListItem },
  props: {
    drawer: Boolean,
    showSearch: {
      type: Boolean,
      default: true,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: Number,
      default: 1785,
    },
  },
  setup(props) {
    const route = useRoute()
    const state = reactive({
      browseGeography: BROWSE_GEOLOGY_LIST,
      browseLab: BROWSE_LAB_LIST,
      browseTaxon: BROWSE_TAXON_LIST,
      logo: '/logos/emaapou5white.svg',
      logoCompact: '/logos/emaapou_short.svg',
      services: SERVICES,
      query: (route.value.query.q as string) ?? '',
      searchFocused: false,
    })
    const icons = computed(() => {
      return {
        mdiMagnify,
        mdiMenu,
        mdiChevronDown,
      }
    })
    const tabValue = computed(() => {
      // https://github.com/vuetifyjs/vuetify/issues/12265
      const path = route.value.path
      const full = route.value.fullPath
      return path[path.length - 1] !== '/'
        ? `${path}/${full.substring(path.length)}`
        : `${full}/`
    })
    const searchRouteName = computed(() => {
      return route.value.name?.includes('search')
        ? route.value.name?.split('__')[0]
        : 'search'
    })
    const cssProps = computed(() => {
      return {
        '--max-width': `${props.maxWidth}px`,
      }
    })
    return { ...toRefs(state), icons, tabValue, searchRouteName, cssProps }
  },
})
</script>

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
  color: var(--v-accent-darken1) !important;
  font-weight: 600 !important;
}

.app-bar-mobile ::v-deep .v-toolbar__content {
  max-width: var(--max-width);
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

.app-bar-full ::v-deep .v-toolbar__content {
  max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
  // padding-right: 0px;
  // padding-left: 20px;
  // border-bottom: map-get($map: $grey, $key: 'lighten-2') solid 1px !important;
}

.active-card {
  background-color: rgba(9, 98, 124, 0.12) !important;

  & div {
    color: var(--v-accent-lighten1) !important;
  }

  & .v-icon {
    color: var(--v-accent-lighten1) !important;
  }
}
.logo-link {
  height: 48px;
  display: contents;
}
.logo-link::before {
  content: '';
  height: 48px;
  width: 104px;
  position: absolute;
  opacity: 0;
  color: #ffffff;
  background-color: currentColor;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}
.logo-link:hover::before {
  opacity: 0.08;
}
</style>
