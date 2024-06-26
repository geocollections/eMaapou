export enum FilterType {
  Range = "range",
  Text = "text",
  RangeAlt = "range_alt",
  Object = "object",
  List = "list",
  ListOr = "list_or",
  Boolean = "boolean",
  Geom = "geom",
  ListIds = "list_ids",
  ListText = "list_text",
  Parameter = "parameter",
  ListDate = "list_date",
  ListIdsMulti = "list_ids_multi",
}

export enum LookupType {
  Contains = "contains",
  Equals = "equals",
  StartsWith = "startsWith",
  EndsWith = "endsWith",
  DoesNotContain = "doesNotContain",
  GreaterThan = "greaterThan",
  SmallerThan = "smallerThan",
}

export enum Renderer {
  Canvas = "canvas",
  Svg = "svg",
}
