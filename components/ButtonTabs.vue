<template>
  <div>
    <v-chip-group column active-class="active deep-orange--text text--darken-2">
      <v-chip
        v-for="(item, index) in tabs"
        :key="index"
        class="mx-2 mb-3"
        :disabled="item.count === 0"
        nuxt
        rounded
        exact
        :to="
          localePath({
            name: item.routeName,
            params: { id: $route.params.id },
          })
        "
        @click="activeTab = localePath({ name: item.routeName })"
      >
        {{ $t(item.title, { number: item.count }) }}
      </v-chip>
    </v-chip-group>
    <v-card>
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
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ButtonTabs',
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
