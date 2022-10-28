export enum FilterType {
  Range = 'range',
  Text = 'text',
  RangeAlt = 'range_alt',
  Object = 'object',
  List = 'list',
  ListOr = 'list_or',
  Boolean = 'boolean',
  Geom = 'geom',
}

export enum LookupType {
  Contains = 'contains',
  Equals = 'equals',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  DoesNotContain = 'doesNotContain',
  GreaterThan = 'greaterThan',
  SmallerThan = 'smallerThan',
}
