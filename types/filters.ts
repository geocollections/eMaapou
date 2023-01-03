import { FilterType, LookupType } from './enums'

type TextFilter = {
  type: FilterType.Text
  value: string
  lookUpType: LookupType
  label: string
  fields: string[]
}

type RangeFilter = {
  value: [null | number, null | number]
  type: FilterType.Range
  label: string
  placeholders: [string, string]
  fields: string[]
}

type RangeAltFilter = {
  value: string
  type: FilterType.RangeAlt
  label: string
  placeholders: [string, string]
  fields: string[]
}

type ObjectFilter = {
  value: null | { [K: string]: any }
  type: FilterType.Object
  searchField: string
  lookUpType: LookupType
  label: string
  fields: string[]
}
type BooleanFilter = {
  type: FilterType.Boolean
  value: boolean
  label: string
  fields: string[]
}

type ListFilter = {
  type: FilterType.List
  value: any[]
  label: string
  fields: string[]
}
type ListOrFilter = {
  type: FilterType.ListOr
  value: any[]
  label: string
  fields: string[]
}
type ListIdsFilter = {
  type: FilterType.ListIds
  value: any[]
  label: string
  fields: string[]
  valueType: 'number' | 'string'
  valueField: string
  lookupType: 'none' | 'startswith'
}

type ListTextFilter = {
  type: FilterType.ListText
  value: any[]
  label: string
  fields: string[]
  lookupType: 'none' | 'startswith'
}
type GeomFilter = {
  type: FilterType.Geom
  value: null | any
  label: string
  fields: string[]
}

export type Filter =
  | TextFilter
  | RangeFilter
  | RangeAltFilter
  | ObjectFilter
  | BooleanFilter
  | ListFilter
  | ListOrFilter
  | GeomFilter
  | ListIdsFilter
  | ListTextFilter
