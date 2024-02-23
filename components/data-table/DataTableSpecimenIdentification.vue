<template>
  <base-data-table v-bind="$attrs">
    <template #item.name="{ item }">
      <base-link-external
        v-if="item.taxon"
        @click.native="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.taxon }}
      </base-link-external>

      <div v-if="item.name">
        | {{ item.name }}
      </div>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.agent }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      {{ item.date_identified }}
    </template>
    <template #item.reference="{ item }">
      <base-link-external
        v-if="item.reference"
        @click.native="$openGeology('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </base-link-external>
    </template>
    <template #item.type="{ item }">
      <div v-if="item.identification_type">
        {{
          $translate({
            et: item.identification_type.value,
            en: item.identification_type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.current="{ item }">
      <base-boolean :value="item.current" />
    </template>
  </base-data-table>
</template>
