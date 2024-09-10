<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.name="{ item }">
      <BaseLinkExternal
        v-if="item.taxon"
        @click="$openWindow(`https://fossiilid.info/${item.taxon.id}`)"
      >
        {{ item.taxon.name }}
      </BaseLinkExternal>

      <div v-if="item.name">
        | {{ item.name }}
      </div>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.name }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      {{ item.date_identified }}
    </template>
    <template #item.reference="{ item }">
      <BaseLinkExternal
        v-if="item.reference"
        @click="$openGeokirjandus('reference', item.reference.id)"
      >
        {{ item.reference.reference }}
      </BaseLinkExternal>
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
      <BaseBoolean :model-value="item.is_current" />
    </template>
  </BaseDataTable>
</template>
