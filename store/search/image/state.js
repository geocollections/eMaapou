import { IMAGE } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: IMAGE.options,
    currentView: 'image',
    useMap: true,
    useInstitutions: true,
    filters: {
      byIds: {
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.locality',
          fields: ['locality', 'locality_en'],
        },
        people: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.people',
          fields: ['image_people'],
        },
        tags: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.tags',
          fields: ['tags'],
        },
        country: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.countryCountyParish',
          fields: [
            'country',
            'country_en',
            'maakond',
            'maakond_en',
            'vald',
            'vald_en',
          ],
        },
        date: {
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: 'photo.date',
          placeholders: ['boxes.min', 'boxes.max'],
          fields: ['date_created', 'date_created_free_year'],
        },
        dateFree: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.dateFree',
          fields: ['date_created_free'],
        },
        imageNumber: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.imageNumber',
          fields: ['image_number'],
        },
        author: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.author',
          fields: ['agent', 'author_free'],
        },
        imageSize: {
          value: '',
          type: 'text',
          lookUpType: 'greaterThan',
          label: 'photo.size',
          fields: ['image_width', 'image_height'],
        },
      },
      allIds: ['locality', 'people'],
    },
    // NOTE: Because this filter does not ever change, it was separated from the rest.
    // So that the hasActiveFilter does not return false positives.
    persistantFilters: {
      specimenImageAttachment: {
        value: '2',
        type: 'text',
        lookUpType: 'equals',
        fields: ['specimen_image_attachment'],
      },
    },
  }
}

export default initState
