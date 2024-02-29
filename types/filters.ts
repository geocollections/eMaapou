import type { FilterType, LookupType } from "./enums";

// export interface TextFilter {
//   type: FilterType.Text;
//   value: string;
//   lookUpType: LookupType;
//   fields: string[];
// };
//
// export interface RangeFilter {
//   value: [null | number, null | number];
//   type: FilterType.Range;
//   placeholders: [string, string];
//   fields: string[];
// };
//
// export interface RangeAltFilter {
//   value: string[];
//   type: FilterType.RangeAlt;
//   placeholders: [string, string];
//   fields: string[];
// };
//
// export interface ObjectFilter {
//   value: null | { [K: string]: any };
//   type: FilterType.Object;
//   searchField: string;
//   lookUpType: LookupType;
//   fields: string[];
// };
// export interface BooleanFilter {
//   type: FilterType.Boolean;
//   value: boolean;
//   fields: string[];
// };
//
// export interface ListFilter {
//   type: FilterType.List;
//   value: any[];
//   fields: string[];
// };
// export interface ListOrFilter {
//   type: FilterType.ListOr;
//   value: any[];
//   fields: string[];
// };
// export interface ListIdsFilter {
//   type: FilterType.ListIds;
//   value: any[];
//   fields: string[];
//   valueType: "number" | "string";
//   valueField: string;
//   lookupType: "none" | "startswith";
// };
// export interface ListIdsMultiFilter {
//   type: FilterType.ListIdsMulti;
//   value: any[];
//   valueField: string;
//   fields: string[];
//   valueType: "number" | "string";
//   idValueField: string;
//   lookupType: "none" | "startswith";
// };
//
// export interface ListTextFilter {
//   type: FilterType.ListText;
//   value: any[];
//   fields: string[];
//   lookupType: "none" | "startswith" | "contains";
// };
// export interface ListDateFilter {
//   type: FilterType.ListDate;
//   value: any[][];
//   fields: string[];
// };
// export interface GeomFilter {
//   type: FilterType.Geom;
//   value: null | any;
//   fields: string[];
// };
//
// export interface ParameterFilter {
//   type: FilterType.Parameter;
//   value: any[];
// };
//
// export type Filter =
//   | TextFilter
//   | RangeFilter
//   | RangeAltFilter
//   | ObjectFilter
//   | BooleanFilter
//   | ListFilter
//   | ListOrFilter
//   | GeomFilter
//   | ListIdsFilter
//   | ListTextFilter
//   | ParameterFilter
//   | ListDateFilter
//   | ListIdsMultiFilter;
//
// export interface DefaultFilterObject {
//   id: number | string;
//   text: string;
//   text_en: string;
//   count: number;
// };
