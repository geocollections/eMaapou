<template>
  <div>
    <v-tabs
      v-model="activeTab"
      class="tabs"
      background-color="grey lighten-3"
      color="deep-orange darken-2"
      show-arrows
      active-class="active"
    >
      <v-tab
        v-for="(item, index) in tabs"
        :key="index"
        :disabled="item.count === 0"
        nuxt
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
}
</script>

<style lang="scss" scoped>
.tabs {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.active {
  font-weight: bold;
}
</style>
