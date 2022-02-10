<template>
  <v-simple-table dense class="custom-table">
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
