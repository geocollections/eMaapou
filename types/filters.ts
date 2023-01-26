import { FilterType, LookupType } from './enums'

export type TextFilter = {
  type: FilterType.Text
  value: string
  lookUpType: LookupType
  fields: string[]
}

export type RangeFilter = {
  value: [null | number, null | number]
  type: FilterType.Range
  placeholders: [string, string]
  fields: string[]
}

export type RangeAltFilter = {
  value: string[]
  type: FilterType.RangeAlt
  placeholders: [string, string]
  fields: string[]
}

export type ObjectFilter = {
  value: null | { [K: string]: any }
  type: FilterType.Object
  searchField: string
  lookUpType: LookupType
  fields: string[]
}
export type BooleanFilter = {
  type: FilterType.Boolean
  value: boolean
  fields: string[]
}

export type ListFilter = {
  type: FilterType.List
  value: any[]
  fields: string[]
}
export type ListOrFilter = {
  type: FilterType.ListOr
  value: any[]
  fields: string[]
}
export type ListIdsFilter = {
  type: FilterType.ListIds
  value: any[]
  fields: string[]
  valueType: 'number' | 'string'
  valueField: string
  lookupType: 'none' | 'startswith'
}
export type ListIdsMultiFilter = {
  type: FilterType.ListIdsMulti
  value: any[]
  valueField: string
  fields: string[]
  valueType: 'number' | 'string'
  idValueField: string
  lookupType: 'none' | 'startswith'
}

export type ListTextFilter = {
  type: FilterType.ListText
  value: any[]
  fields: string[]
  lookupType: 'none' | 'startswith' | 'contains'
}
export type ListDateFilter = {
  type: FilterType.ListDate
  value: any[][]
  fields: string[]
}
export type GeomFilter = {
  type: FilterType.Geom
  value: null | any
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
  | ListDateFilter
  | ListIdsMultiFilter
