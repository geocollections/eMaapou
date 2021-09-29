<template>
  <v-btn id="headers-select" icon>
    <v-icon>mdi-table-cog</v-icon>
    <v-menu
      activator="#headers-select"
      offset-y
      :close-on-content-click="false"
    >
      <v-card max-height="500">
        <v-list flat class="">
          <v-list-item-title class="pl-2 montserrat align-center">
            {{ $t('common.headers') }}
            <v-btn icon @click="$emit('reset')">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-list-item-title>
          <v-list-item-group
            :value="visibleHeaders"
            multiple
            @change="$emit('change', $event)"
          >
            <template v-for="(header, i) in headers">
              <div :id="`header-${i}-checkbox`" :key="`header-${i}`">
                <v-list-item
                  dense
                  :disabled="sortBy.includes(header.value)"
                  :value="header"
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
                      <v-list-item-title
                        v-text="header.text"
                      ></v-list-item-title>
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
  </v-btn>
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
