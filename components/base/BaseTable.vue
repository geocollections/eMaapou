<template>
  <v-simple-table dense>
    <template #default>
      <tbody>
        <slot></slot>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'BaseTable',
}
</script>

<style lang="scss" scoped>
.v-data-table ::v-deep {
  border: 0px solid map-get($map: $grey, $key: 'lighten-2');
  tr {
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
  .v-data-table ::v-deep {
    tr {
      td {
        &:first-child {
          width: auto;
        }
      }
    }
  }
}
</style>
