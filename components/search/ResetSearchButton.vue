<template>
  <v-btn
    outlined
    tile
    color="grey"
    class="reset-search mr-2 px-3 montserrat"
    :icon="$vuetify.breakpoint.mdOnly"
    @click="$emit('click')"
  >
    <span class="hidden-md-only">
      {{ $t('common.resetSearch') }}
    </span>
    <v-tooltip v-if="$vuetify.breakpoint.mdOnly" bottom>
      <template #activator="{ on }">
        <v-icon :right="!$vuetify.breakpoint.mdOnly" v-on="on"
          >mdi-eraser</v-icon
        >
      </template>

      <span>
        {{ $t('common.resetSearchLong') }}
      </span>
    </v-tooltip>
    <v-icon v-else right>mdi-eraser</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'ResetSearchButton',
}
</script>

<style scoped>
.reset-search {
  transition: all 200ms ease-in-out;
}
</style>
