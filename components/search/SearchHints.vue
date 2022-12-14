<template>
  <v-menu
    :value="value"
    :activator="activator"
    offset-y
    :close-on-content-click="false"
    content-class="mt-2 elevation-3"
    :open-on-focus="true"
    max-width="650"
    @input="$emit('input', $event)"
  >
    <v-card elevation="0">
      <v-card-text class="pa-3">
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex">
              <code class="black--text font-weight-bold"> GIT 155\-57 </code>
              <div class="ml-2">
                escape special characters (<code>+-!(){}[]^"~*?:/</code>) using
                <code>\</code>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold">"Viki"</code>
              <div class="ml-2">exact phrase</div>
            </div>
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold">+Keila</code>
              <div class="ml-2">require term</div>
            </div>
            <div class="d-flex mt-1 align-center">
              <code class="black--text font-weight-bold">-Tartu</code>
              <div class="ml-2">exclude term</div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold"
                >"Eesti" AND "Soome"</code
              >
              <div class="ml-2">both terms exist</div>
            </div>
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold">NOT "Eesti"</code>
              <div class="ml-2">term does not exist</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SearchHints',
  props: {
    activator: {
      type: Object as PropType<Node | undefined>,
      default: undefined,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
