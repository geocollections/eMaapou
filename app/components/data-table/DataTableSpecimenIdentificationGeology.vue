<template>
  <!-- @vue-ignore -->
  <BaseDataTable v-bind="$attrs">
    <template #item.rock="{ item }">
      <BaseLinkExternal
        v-if="item.rock"
        @click="$openWindow(`https://kivid.info/${item.rock.id}`)"
      >
        {{
          $translate({
            et: item.rock.name,
            en: item.rock.name_en,
          })
        }}
      </BaseLinkExternal>
    </template>
    <template #item.agent="{ item }">
      <div v-if="item.agent">
        {{ item.agent.name }}
      </div>
    </template>
    <template #item.dateIdentified="{ item }">
      <div>{{ item.date_identified || item.date_identified_free }}</div>
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
      <div v-if="item.type">
        {{
          $translate({
            et: item.type.value,
            en: item.type.value_en,
          })
        }}
      </div>
    </template>
    <template #item.current="{ item }">
      <BaseBoolean :model-value="item.is_current" />
    </template>
  </BaseDataTable>
</template>
