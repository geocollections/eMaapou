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
    // &:hover {
    //   background-color: map-get($map: $grey, $key: 'lighten-5') !important;
    // }
    td {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
      &:first-child {
        border-right: 2px solid map-get($map: $grey, $key: 'lighten-2');

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
