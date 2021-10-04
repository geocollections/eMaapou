<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke HeaderControls when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <v-menu
    transition="slide-y-transition"
    offset-y
    :close-on-content-click="false"
  >
    <template #activator="menu">
      <v-tooltip bottom open-delay="500">
        <template #activator="tooltip">
          <v-btn
            icon
            v-bind="{ ...menu.attrs, ...tooltip.attrs }"
            v-on="{ ...menu.on, ...tooltip.on }"
          >
            <v-icon>mdi-table-cog</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('table.tooltipConfig') }}</span>
      </v-tooltip>
    </template>
    <v-card max-height="500">
      <v-list flat class="">
        <v-list-item-title class="pl-2 montserrat align-center">
          {{ $t('common.headers') }}
          <v-btn icon @click="$emit('reset')">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-list-item-title>
        <v-list-item-group :value="visibleHeaders" multiple>
          <template v-for="(header, i) in headers">
            <div :id="`header-${i}-checkbox`" :key="`header-${i}`">
              <v-list-item
                dense
                :disabled="sortBy.includes(header.value)"
                :value="header"
                @click="$emit('change', header)"
              >
                <template #default="{ active }">
                  <v-list-item-action class="my-2 mr-1">
                    <v-checkbox
                      dense
                      :disabled="sortBy.includes(header.value)"
                      :input-value="active"
                      color="accent lighten-2"
                    >
                    </v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="header.text"></v-list-item-title>
                  </v-list-item-content>
                  <v-tooltip
                    right
                    :open-delay="200"
                    :disabled="!sortBy.includes(header.value)"
                    :activator="`#header-${i}-checkbox`"
                  >
                    {{ $t('common.headerSelectDisabled') }}
                  </v-tooltip>
                </template>
              </v-list-item>
            </div>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'HeaderControls',
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    visibleHeaders: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
