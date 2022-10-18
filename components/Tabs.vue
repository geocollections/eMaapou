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
        @click="handleTabChange"
        >{{ $t(item.title, { number: item.count }) }}</v-tab
      >
    </v-tabs>
    <nuxt-child keep-alive v-bind="activeTabProps" />
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
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeTab: this.$router.resolve(this.initActiveTab),
      tabsDict: this.tabs.reduce((prev, tab) => {
        return {
          ...prev,
          [tab.routeName]: tab,
        }
      }, {}),
      activeTabProps: this.tabs.reduce((prev, tab) => {
        return {
          ...prev,
          [tab.routeName]: tab,
        }
      }, {})[this.getRouteBaseName(this.initActiveTab)].props,
    }
  },
  methods: {
    handleTabChange() {
      this.activeTabProps = this.tabsDict[this.getRouteBaseName()].props
    },
  },
  // computed: {
  //   tabsDict() {
  //     return this.tabs.reduce((prev, tab) => {
  //       return {
  //         ...prev,
  //         [tab.routeName]: tab,
  //       }
  //     }, {})
  //   },
  //   // activeTabProps() {
  //   //   return this.tabsDict[this.getRouteBaseName()].props
  //   // },
  // },
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
