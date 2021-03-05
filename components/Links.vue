<template>
  <v-menu transition="slide-y-transition" offset-y bottom right>
    <template #activator="{ on, attrs }">
      <v-btn
        aria-label="links to external sites"
        class="d-block mx-3"
        text
        v-bind="attrs"
        v-on="on"
      >
        <template #default>
          <span class="header-text">
            {{ $t('common.links') }}
          </span>
        </template>
      </v-btn>
    </template>
    <v-list>
      <!-- <div v-for="(link, idx) in links" :key="idx"> -->
      <v-list-item
        v-for="(link, idx) in links"
        :key="idx"
        class="header-menu-item"
        dense
        :href="link.url"
        target="_blank"
      >
        <v-list-item-title>{{ $t(link.name) }}</v-list-item-title>
      </v-list-item>
      <!-- </div> -->
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'Links',
  data() {
    return {
      links: [
        { name: 'link.geokogud', url: 'https://geocollections.info' },
        { name: 'link.geokirjandus', url: 'https://geocollections.info' },
        { name: 'link.sarvDOI', url: 'https://doi.geocollections.info/' },
        { name: 'link.fossils', url: 'https://fossiilid.info/' },
        { name: 'link.turvas', url: 'https://turba.geoloogia.info' },
        { name: 'link.chitinozoa', url: 'https://chitinozoa.net/' },
        { name: 'link.eurocore', url: 'https://eurocore.rocks/' },
        { name: 'link.sarvAPI', url: 'https://api.geocollections.info' },
        { name: 'link.github', url: 'https://github.com/geocollections/' },
      ],
    }
  },
}
</script>
