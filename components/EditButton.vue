<template>
  <v-btn
    id="edit-btn"
    icon
    dark
    small
    color="deep-orange darken-2"
    @click="handleClick"
  >
    <v-icon small>{{ icons.mdiSquareEditOutline }}</v-icon>
    <v-tooltip bottom activator="#edit-btn">
      <span>{{ $t('common.linkToEdit') }}</span>
    </v-tooltip>
  </v-btn>
</template>

<script lang="ts">
import { mdiSquareEditOutline } from '@mdi/js'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'EditButton',
  computed: {
    icons() {
      return {
        mdiSquareEditOutline,
      }
    },
    table() {
      return this.$route.name?.substring(0, this.$route.name.indexOf('-')) ?? ''
    },
  },
  methods: {
    handleClick() {
      let table = this.table
      if (table === 'photo' || table === 'file') table = 'attachment'
      this.$openEdit(table, this.$route.params.id)
    },
  },
})
</script>
