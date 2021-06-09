<template>
  <v-row>
    <v-col>
      <slot name="title"></slot>
      <v-row>
        <v-col cols="12" md="3">
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
