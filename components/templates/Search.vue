<template>
  <v-row>
    <v-col>
      <slot name="title"></slot>
      <v-row class="px-0 px-sm-3">
        <v-col cols="12" md="3">
          <v-card-title class="pl-2 py-1 montserrat">
            {{ $t('common.showSearch') }}
          </v-card-title>
          <slot name="form"></slot>
        </v-col>
        <v-col cols="12" md="9">
          <slot name="result"></slot>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  // NOTE: Should probably named something more descriptive
  name: 'Search',
}
</script>
