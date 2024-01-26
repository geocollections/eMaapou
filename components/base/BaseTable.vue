<template>
  <v-table density="compact">
    <template #default>
      <tbody>
        <slot></slot>
      </tbody>
    </template>
  </v-table>
</template>

<script>
export default {
  name: "BaseTable",
};
</script>

<style lang="scss" scoped>
@import "vuetify/settings";

.v-data-table {
  border: 0px solid rgb(var(--v-theme-grey-lighten2));
  :deep(tr) {
    td {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
      &:first-child {
        width: 200px;
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .v-data-table {
    :deep(tr) {
      td {
        &:first-child {
          width: auto;
        }
      }
    }
  }
}
</style>
