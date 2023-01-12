import { FilterType, LookupType } from './enums'

export type TextFilter = {
  type: FilterType.Text
  value: string
  lookUpType: LookupType
  label: string
  fields: string[]
}

export type RangeFilter = {
  value: [null | number, null | number]
  type: FilterType.Range
  label: string
  placeholders: [string, string]
  fields: string[]
}

export type RangeAltFilter = {
  value: string[]
  type: FilterType.RangeAlt
  label: string
  placeholders: [string, string]
  fields: string[]
}

export type ObjectFilter = {
  value: null | { [K: string]: any }
  type: FilterType.Object
  searchField: string
  lookUpType: LookupType
  label: string
  fields: string[]
}
export type BooleanFilter = {
  type: FilterType.Boolean
  value: boolean
  label: string
  fields: string[]
}

export type ListFilter = {
  type: FilterType.List
  value: any[]
  label: string
  fields: string[]
}
export type ListOrFilter = {
  type: FilterType.ListOr
  value: any[]
  label: string
  fields: string[]
}
export type ListIdsFilter = {
  type: FilterType.ListIds
  value: any[]
  label: string
  fields: string[]
  valueType: 'number' | 'string'
  valueField: string
  lookupType: 'none' | 'startswith'
}

export type ListTextFilter = {
  type: FilterType.ListText
  value: any[]
  label: string
  fields: string[]
  lookupType: 'none' | 'startswith' | 'contains'
}
export type GeomFilter = {
  type: FilterType.Geom
  value: null | any
  label: string
  fields: string[]
}

export type ParameterFilter = {
  type: FilterType.Parameter
  value: any[]
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
  | ParameterFilter
