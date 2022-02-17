<template>
  <v-btn
    outlined
    color="grey"
    class="
      reset-search
      mr-2
      px-3
      montserrat
      rounded
      text-body-1 text-capitalize
    "
    :icon="$vuetify.breakpoint.mdOnly"
    @click="$emit('click')"
  >
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
    <v-icon v-else left>mdi-eraser</v-icon>
    <span class="hidden-md-only montserrat">
      {{ $t('common.resetSearch') }}
    </span>
  </v-btn>
</template>
<script>
export default {
  name: 'SearchResetButton',
}
</script>

<style scoped>
.reset-search {
  transition: all 200ms ease-in-out;
}
</style>
