export enum FilterType {
  Range = 'range',
  Text = 'text',
  RangeAlt = 'range_alt',
  Select = 'select', // NOTE: this is not used currently anywhere
  Object = 'object',
  List = 'list',
  ListOr = 'list_or',
  Boolean = 'boolean',
  Raw = 'raw', // NOTE: this is not used currently anywhere
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
