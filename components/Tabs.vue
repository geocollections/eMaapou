<template>
  <div>
    <v-tabs
      v-model="activeTab"
      class="tabs"
      light
      background-color="primary lighten-3"
      slider-color="tertiary"
      :show-arrows="$vuetify.breakpoint.smAndUp"
      :vertical="$vuetify.breakpoint.xsOnly"
      grow
    >
      <v-tab
        v-for="(item, index) in tabs"
        :key="index"
        :disabled="item.count === 0"
        nuxt
        active-class="active-tab"
        exact
        :to="
          localePath({
            name: item.routeName,
            params: { id: $route.params.id },
          })
        "
        >{{ $t(item.title, { number: item.count }) }}</v-tab
      >
    </v-tabs>
    <v-tabs-items v-model="activeTab" touchless>
      <v-tab-item
        v-for="(item, index) in tabs"
        :key="index"
        :disabled="item.count === 0"
        :value="
          localePath({
            name: item.routeName,
            params: { id: $route.params.id },
          })
        "
        :height="$vuetify.breakpoint.xsOnly ? 38 : 'unset'"
      >
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

.active-tab {
  font-weight: bold;
  color: var(--v-tertiary-base) !important;
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
