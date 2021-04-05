<template>
  <div class="d-flex lang-button justify-center align-center">
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          icon
          small
          :class="{ 'custom-small': isDetail }"
          v-on="on"
          @click="$i18n.setLocale($i18n.locale === 'et' ? 'en' : 'et')"
        >
          <span
            class="flag lang-icon"
            :class="{
              'flag-et': $i18n.locale === 'en',
              'flag-en': $i18n.locale === 'et',
              'lang-icon-detail': isDetail,
            }"
          />
        </v-btn>
      </template>

      <span class="font-weight-bold">{{
        $i18n.locale === 'et' ? 'ENG' : 'EST'
      }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'LangSwitcherFast',
  props: {
    isDetail: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
.lang-button {
  height: 36px !important;
  width: 36px !important;
}

.lang-icon {
  height: 20px;
  width: 20px !important;
}

.lang-icon-detail {
  height: 24px;
  width: 24px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 100%;

  transition: opacity 200ms ease-in-out;
}

.flag:before {
  content: '\A0';
}

.flag-et {
  background-image: url('~assets/et.svg');
}

.flag-en {
  background-image: url('~assets/en.svg');
}

.custom-small {
  height: 32px;
  width: 32px;
}
</style>
