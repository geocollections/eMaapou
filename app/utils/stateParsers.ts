import isNil from "lodash/isNil";
import uniq from "lodash/uniq";
import { z } from "zod";

// Parsers that convert values to URL params

export const stringValueParser = z
  .string()
  .transform(val => (val.length > 0 ? val : undefined))
  .catch("");

export const stringArrayValueParser = z
  .string()
  .array()
  .transform(val => (val.length > 0 ? uniq(val).join(",") : undefined));

export function idValueParser(separator: string) {
  return z
    .string()
    .array()
    .transform(val =>
      val.length > 0 ? uniq(val).join(separator) : undefined,
    );
}

export const dateArrayValueParser = z
  .string()
  .array()
  .array()
  .transform(val =>
    val.length > 0
      ? uniq(val)
        .map(v => v.join("~"))
        .join(",")
      : undefined,
  );

export const rangeValueParser = z
  .number()
  .nullable()
  .array()
  .length(2)
  .transform(val =>
    val.some(v => v !== null)
      ? val.map(v => (v === null ? "*" : v)).join("-")
      : undefined,
  );

export const booleanValueParser = z
  .boolean()
  .transform(val => (val ? "true" : undefined));

export const geometryValueParser = (z
  .any() satisfies z.ZodType<GeoJSON.Geometry | null>)
  .transform(val => (val !== null ? JSON.stringify(val) : undefined));

export const parameterValueParser = z
  .object({
    value: z.array(z.number().nullable()).length(2),
    parameter: z.string().nullable(),
  })
  .array()
  .transform((val) => {
    const validValues = val.filter(v => v.parameter !== null);

    if (validValues.length < 1)
      return undefined;

    return validValues.map((val) => {
      const start = isNil(val.value[0]) ? "*" : val.value[0];
      const end = isNil(val.value[1]) ? "*" : val.value[1];
      return `${val.parameter}:${start}-${end}`;
    }).join(",");
  },
  );
