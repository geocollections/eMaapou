<template>
  <div>
    <v-tabs
      v-model="activeTab"
      background-color="grey lighten-3"
      color="deep-orange darken-2"
      show-arrows
    >
      <v-tab
        v-for="(item, index) in items"
        :key="index"
        nuxt
        exact
        :to="
          localePath({
            name: item.routeName,
            params: { id: $route.params.id },
          })
        "
        >{{ $t(item.title) }}</v-tab
      >
    </v-tabs>
    <v-tabs-items v-model="activeTab" @change="handleSwipeBetweenTabs">
      <v-tab-item
        v-for="(item, index) in items"
        :key="index"
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
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: null,
    }
  },
  methods: {
    handleSwipeBetweenTabs(pathAsString) {
      this.$router.push(pathAsString)
    },
  },
}
</script>
