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
              <i18n class="ml-2" path="hints.escaping" tag="div">
                <template #specialCharacters>
                  <code>+-!(){}[]^"~*?:/</code>
                </template>
                <template #escapeCharacter>
                  <code>\</code>
                </template>
              </i18n>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold">"Viki"</code>
              <div class="ml-2">{{ $t('hints.exact') }}</div>
            </div>
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold">+Keila</code>
              <div class="ml-2">{{ $t('hints.require') }}</div>
            </div>
            <div class="d-flex mt-1 align-center">
              <code class="black--text font-weight-bold">-Tartu</code>
              <div class="ml-2">{{ $t('hints.exclude') }}</div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold"
                >"Eesti" AND "Soome"</code
              >
              <div class="ml-2">{{ $t('hints.requireBoth') }}</div>
            </div>
            <div class="d-flex my-1 align-center">
              <code class="black--text font-weight-bold">NOT "Eesti"</code>
              <div class="ml-2">{{ $t('hints.notExclude') }}</div>
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
