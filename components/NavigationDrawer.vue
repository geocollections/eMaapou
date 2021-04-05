<template>
  <v-navigation-drawer
    :value="drawer"
    app
    right
    temporary
    style="z-index: 2050"
    @input="$emit('update:navigationDrawer', $event)"
  >
    <v-list dense>
      <v-subheader>{{ $t('landing.routes') }}</v-subheader>
      <v-list-item
        v-for="item in routes"
        :key="item.name"
        exact
        :to="localePath({ name: item.name })"
      >
        <v-list-item-action>
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t(`common.${item.lang}`) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      routes: [
        {
          name: 'about',
          lang: 'about',
          icon: 'mdi-information-outline',
        },
        {
          name: 'search',
          lang: 'search',
          icon: 'mdi-magnify',
        },
        {
          name: 'drillcore',
          lang: 'drillcores',
          icon: 'mdi-screw-machine-flat-top',
        },
        {
          name: 'locality',
          lang: 'localities',
          icon: 'mdi-map-marker-outline',
        },
        {
          name: 'sample',
          lang: 'samples',
          icon: 'mdi-test-tube',
        },
        {
          name: 'analysis',
          lang: 'analyses',
          icon: 'mdi-chart-scatter-plot',
        },
      ],
    }
  },
}
</script>

<style scoped></style>
