<template>
  <!--
    TODO:  This component probably needs to be universal.
    Right now the fields like uuid_filename and date_created make it hard to use,
    because the filename field is named differently in each API table
    (ex. attachment -> uuid_filename and attachment_link -> attachment__uuid_filename).
    NOTE: Currently these field names can be overwritten by using scoped slots.
  -->
  <v-card class="mt-6 mx-4 d-flex align-center" style="overflow-x: auto" flat>
    <div v-for="(item, index) in images" :key="index" class="mx-3 mb-3">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <slot name="image" :item="item" :on="on" :attrs="attrs">
            <v-hover v-slot="{ hover }">
              <v-img
                v-bind="attrs"
                :src="`https://files.geocollections.info/small/${item.uuid_filename}`"
                :lazy-src="`https://files.geocollections.info/small/${item.uuid_filename}`"
                max-width="200"
                max-height="200"
                width="200"
                height="200"
                :class="{
                  'elevation-4': hover,
                  'elevation-2': !hover,
                }"
                class="grey lighten-2 rounded transition-swing cursor-pointer"
                v-on="on"
                @click="
                  $router.push(
                    localePath({
                      name: 'file-id',
                      params: { id: item.attachment_id },
                    })
                  )
                "
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-hover>
          </slot>
        </template>
        <slot name="info" :item="item">
          <div v-if="item.agent || item.date_created || item.date_created_free">
            <div v-if="item.agent">
              <span class="font-weight-bold"
                >{{ $t('locality.author') }}:
              </span>
              <span>{{ item.agent }}</span>
            </div>
            <div v-if="item.date_created || item.date_created_free">
              <span class="font-weight-bold">{{ $t('locality.date') }}: </span>
              <span v-if="item.date_created">
                {{ new Date(item.date_created).toISOString().split('T')[0] }}
              </span>
              <span v-else>{{ item.date_created_free }}</span>
            </div>
          </div>
          <div v-else>{{ $t('common.clickToOpen') }}</div>
        </slot>
      </v-tooltip>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ImageBar',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
