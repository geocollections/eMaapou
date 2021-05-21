<template>
  <v-card flat>
    <div class="px-4 pb-4">
      <v-switch
        v-model="containImages"
        class="mt-0"
        hide-details
        color="header"
        :label="$t('common.containImages')"
      />
    </div>

    <v-row v-if="count > 0" no-gutters class="px-2">
      <v-col
        v-for="(image, index) in items"
        :key="index"
        class="d-flex child-flex pt-0 px-2 pb-4"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom color="header" z-index="51000" max-width="250">
          <template #activator="{ on }">
            <v-card
              flat
              class="d-flex image-hover"
              color="transparent"
              hover
              nuxt
              :to="localePath({ name: 'photo-id', params: { id: image.id } })"
              :class="{ 'elevation-4 image-hover-elevation': !containImages }"
              v-on="on"
            >
              <v-img
                v-if="image.uuid_filename"
                max-height="400"
                min-width="72"
                :contain="containImages"
                aspect-ratio="1"
                :lazy-src="`https://files.geocollections.info/small/${image.uuid_filename}`"
                :src="`https://files.geocollections.info/small/${image.uuid_filename}`"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>

              <v-row v-else align="center">
                <v-col class="text-center">
                  <div class="py-3">
                    <v-icon style="font-size: 6rem" class="grey--text"
                      >mdi-file-image-outline</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <span>
            <b>{{ $t('photo.id') }}: </b> {{ image.id }}<br />
            <span v-if="image.date_created || image.date_created_free">
              <b>{{ $t('photo.date') }}: </b>
              <span v-if="image.date_created">{{
                image.date_created.split('T')[0]
              }}</span>
              <span v-else>{{ image.date_created_free }}</span>
              <br />
            </span>
            <span v-if="image.agent || image.author_free">
              <b>{{ $t('photo.author') }}: </b
              >{{ image.agent || image.author_free }}
              <br />
            </span>
            <span v-if="image.image_number">
              <b>{{ $t('photo.number') }}: </b>
              {{ image.image_number }}
              <br />
            </span>
          </span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'ImageView',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      containImages: false,
    }
  },
}
</script>

<style scoped>
.image-hover:hover {
  opacity: 0.7;
}
.image-hover {
  transition: opacity 250ms ease-in-out;
}
.image-hover-elevation:hover {
  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2),
    0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12) !important;
}
.image-hover-elevation {
  transition: box-shadow 250ms ease-in-out;
}
</style>
