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
    <v-card>
      <v-list flat class="">
        <v-list-item-title class="px-2 montserrat align-center">
          {{ $t('common.headers') }}
          <v-btn icon @click="$emit('reset')">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

          <v-btn icon @click="onlyVisible = !onlyVisible">
            <v-icon v-if="!onlyVisible">mdi-eye</v-icon>
            <v-icon v-else>mdi-eye-off</v-icon>
          </v-btn>
          <v-text-field
            v-model="filter"
            class="py-2"
            dense
            hide-details
            :label="$t('common.filter')"
          />
        </v-list-item-title>
        <v-list-item-group :value="visibleHeaders" multiple>
          <v-virtual-scroll
            :items="
              (onlyVisible ? visibleHeaders : headers) | filterHeaders(filter)
            "
            height="500"
            item-height="35"
            width="300"
            :bench="20"
            multiple
          >
            <template #default="{ item }">
              <v-tooltip left :disabled="!sortBy.includes(item.value)">
                <template #activator="{ on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    dense
                    :disabled="sortBy.includes(item.value)"
                    :value="item"
                    v-on="on"
                    @click="$emit('change', item)"
                  >
                    <v-list-item-action class="my-2 mr-2">
                      <v-checkbox
                        dense
                        :disabled="sortBy.includes(item.value)"
                        :input-value="item.show"
                        color="accent lighten-2"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text" />
                    </v-list-item-content>
                  </v-list-item>
                </template>
                {{ $t('common.headerSelectDisabled') }}
              </v-tooltip>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'HeaderControls',
  filters: {
    filterHeaders(headers, filter) {
      return headers.filter((header) =>
        header.text.toLowerCase().includes(filter.toLowerCase())
      )
    },
  },
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
  data() {
    return {
      onlyVisible: false,
      filter: '',
    }
  },
}
</script>
