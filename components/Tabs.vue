<template>
  <div>
    <v-tabs
      v-model="activeTab"
      style="border-bottom: lightgrey solid 1px"
      class="tabs"
      light
      background-color="grey lighten-4"
      slider-color="accent darken-1"
      :show-arrows="$vuetify.breakpoint.smAndUp"
      :vertical="$vuetify.breakpoint.xsOnly"
      grow
    >
      <v-tab
        v-for="(item, index) in tabs"
        :key="index"
        :disabled="item.count === 0"
        nuxt
        class="montserrat tab"
        exact-active-class="active-tab"
        exact
        :to="
          localePath({
            name: item.routeName,
            params: $route.params,
          })
        "
        >{{ $t(item.title, { number: item.count }) }}</v-tab
      >
    </v-tabs>
    <v-tabs-items v-model="activeTab" touchless class="rounded">
      <v-tab-item
        v-for="(item, index) in tabs"
        :key="index"
        :disabled="item.count === 0"
        :value="
          localePath({
            name: item.routeName,
            params: $route.params,
          })
        "
        :height="$vuetify.breakpoint.xsOnly ? 38 : 'unset'"
      >
        <!-- Todo: Removing keep-alive fixes empty tab problem when navigating but breaks tab data (weird problem have to look into it) -->
        <!-- Todo: Even if keep-alive is on then navigating between tabs is not updating nuxt-child??? example preparation/9981 -> 9980. -->
        <nuxt-child :key="index" keep-alive v-bind="item.props" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    initActiveTab: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      activeTab: this.initActiveTab,
    }
  },
  created() {
    // if (document.getElementsByClassName('v-slide-group__prev')) {
    //   document
    //     .getElementsByClassName('v-slide-group__prev')[0]
    //     .firstElementChild.classList.remove('theme--light')
    // }
  },
}
</script>

<style lang="scss" scoped>
.tabs {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.tab {
  color: #424242 !important;
}

.active-tab {
  font-weight: bold;
  color: var(--v-accent-darken1) !important;
}

.v-tabs--vertical {
  .v-tabs-bar {
    .v-tab {
      height: 38px;
      font-size: 0.8125rem;
    }
  }
}
</style>
