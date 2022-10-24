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

<script>
import { mdiSquareEditOutline } from '@mdi/js'

export default {
  name: 'EditButton',
  fetchOnServer: false,
  data() {
    return {
      isLoggedIn: false,
    }
  },
  async fetch() {
    // NOTE: Should think over if we want to show the edit button based on the login state
    // const isLoggedInRespones = await this.$services.sarvRwapi.isLoggedIn()
    // this.isLoggedIn = !!isLoggedInRespones?.results?.success
  },
  computed: {
    style() {
      return ` z-index: 4;`
    },
    icons() {
      return {
        mdiSquareEditOutline,
      }
    },
    table() {
      return this.$route.name.substring(0, this.$route.name.indexOf('-'))
    },
  },
  created() {
    // this.interval = setInterval(() => this.refreshIsLoggedIn(), 60000)
  },
  beforeDestroy() {
    // clearInterval(this.interval)
  },
  methods: {
    refreshIsLoggedIn() {
      this.$fetch()
    },

    handleClick() {
      let table = this.table
      if (table === 'photo' || table === 'file') table = 'attachment'
      this.$openEdit(table, this.$route.params.id)
    },
  },
}
</script>
