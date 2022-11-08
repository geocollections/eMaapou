<template>
  <div>
    <v-tabs
      ref="tabs"
      v-model="activeTab"
      class="tabs"
      slider-size="0"
      :show-arrows="$vuetify.breakpoint.smAndUp"
      :vertical="$vuetify.breakpoint.xsOnly"
      grow
    >
      <v-tab
        v-for="(item, index) in tabs"
        :key="index"
        :disabled="item.count === 0"
        nuxt
        class="montserrat tab text-none"
        exact-active-class="active-tab font-weight-medium"
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

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Location } from 'vue-router'
import { Tab } from '~/constants'
export default defineComponent({
  name: 'Tabs',
  props: {
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true,
    },
    initActiveTab: {
      type: Object as PropType<Location>,
      required: true,
    },
  },
  data() {
    const tabsDict = this.tabs.reduce((prev, tab) => {
      return {
        ...prev,
        [tab.routeName]: tab,
      }
    }, {} as { [K: string]: Tab })
    const props =
      this.getRouteBaseName(this.$route) &&
      (this.getRouteBaseName(this.$route) as string) in tabsDict
        ? tabsDict[this.getRouteBaseName(this.$route) as string].props
        : this.tabs[0].props
    return {
      activeTab: null as any,
      tabsDict,
      activeTabProps: props,
    }
  },
  watch: {
    initActiveTab: {
      handler(newVal) {
        this.activeTabProps =
          this.tabsDict[this.getRouteBaseName(newVal) as string].props
        this.activeTab = this.$router.resolve(newVal)
        // @ts-ignore
        this.$refs.tabs?.onResize()
      },
    },
  },
  methods: {
    handleTabChange() {
      this.activeTabProps =
        this.tabsDict[this.getRouteBaseName() as string].props
    },
  },
})
</script>

<style lang="scss" scoped>
.tabs {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  // &::after {
  //   content: '';
  //   width: 100%;
  //   height: 1px;
  //   background: black;
  //   display: inline-block;
  //   position: absolute;
  //   background-color: var(--v-accent-darken1);
  //   opacity: 0.2;
  // }
  border-bottom: lightgray solid 1px;
}

.tab {
  color: #424242 !important;
  &::before {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}

.active-tab {
  // font-weight: bold;
  color: var(--v-accent-darken1) !important;
  &::before {
    opacity: 0.2 !important;
    background-color: var(--v-accent-darken1) !important;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
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
