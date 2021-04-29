<template>
  <v-row>
    <v-col>
      <slot name="title"></slot>
      <v-row>
        <v-col cols="12" md="3">
          <search-view-form-wrapper>
            <slot name="form"></slot>
          </search-view-form-wrapper>
        </v-col>
        <v-col cols="12" md="9">
          <slot name="result"></slot>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import SearchViewFormWrapper from '~/components/search/forms/SearchViewFormWrapper'
export default {
  components: { SearchViewFormWrapper },
}
</script>
