<script>
import { mdiHome, mdiMagnify, mdiRefresh } from "@mdi/js";
import InputSearch from "~/components/input/InputSearch.vue";

export default {
  name: "DetailError",
  components: { InputSearch },
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      query: "",
      otherError: this.$t("error.occurred"),
    };
  },
  head() {
    const title = this.otherError;
    return {
      title,
    };
  },
  computed: {
    title() {
      return this.otherError;
    },
    icons() {
      return {
        mdiMagnify,
        mdiRefresh,
        mdiHome,
      };
    },
  },
  methods: {
    handleSearch() {
      this.$router.push(
        this.localePath({ name: "search", query: { q: this.query } }),
      );
    },
  },
};
</script>

<template>
  <VRow justify="center">
    <VCol
      sm="8"
      md="6"
      class="text-center"
    >
      <h1 class="text-h4 mb-5">
        {{ title }}
      </h1>

      <VBtn
        variant="text"
        size="large"
        elevation="0"
        class="text-capitalize montserrat"
        @click="$router.go(0)"
      >
        <VIcon start>
          {{ icons.mdiRefresh }}
        </VIcon>
        Refresh
      </VBtn>
      <VBtn
        size="large"
        variant="text"
        elevation="0"
        nuxt
        to="/"
        class="montserrat text-capitalize"
      >
        <VIcon start>
          {{ icons.mdiHome }}
        </VIcon>
        {{ $t("common.backToLanding") }}
      </VBtn>
      <VForm class="d-flex text-right my-4" @submit.prevent="handleSearch">
        <InputSearch
          v-model="query"
          input-class="rounded"
          height="56"
          :placeholder="$t('landing.searchPlaceholder')"
        />
        <VBtn
          height="56px"
          width="84px"
          class="text-body-1 ml-2 ml-sm-3 mt-0 mt-sm-0"
          type="submit"
          color="warning"
          dark
        >
          <VIcon>{{ icons.mdiMagnify }}</VIcon>
        </VBtn>
      </VForm>
    </VCol>
  </VRow>
</template>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
