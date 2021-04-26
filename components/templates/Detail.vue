<template>
  <v-row>
    <v-col>
      <slot name="title" />
      <slot name="top" />
      <slot>
        <v-card>
          <v-row no-gutters justify="center">
            <v-col v-if="$slots['column-left']" cols>
              <slot name="column-left" />
            </v-col>
            <v-col v-if="$slots['column-right']" cols="12" md="6">
              <slot name="column-right" />
            </v-col>
          </v-row>
        </v-card>
      </slot>
      <slot name="bottom" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Detail',
}
</script>
