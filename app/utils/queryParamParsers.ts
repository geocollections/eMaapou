import uniq from "lodash/uniq";
import { z } from "zod";

export function idParamParser(separator: string) {
  return z
    .string()
    .transform(val => uniq(val.split(separator)))
    .catch(_ctx => []);
}

export const textParamParser = z
  .string()
  .transform(val => uniq(val.split(",")))
  .catch(_ctx => []);

export const rangeParamParser = z
  .string()
  .transform((val, ctx) => {
    const [startStr, endStr] = val.split("-", 2);
    const start = startStr !== undefined && startStr.length > 0 && !Number.isNaN(Number(startStr)) ? Number.parseInt(startStr) : null;
    const end = endStr !== undefined && endStr.length > 0 && !Number.isNaN(Number(endStr)) ? Number.parseInt(endStr) : null;

    if (start !== null && end !== null && start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start cannot be larger than end",
      });
      return z.NEVER;
    }

    return [start, end] as [null | number, null | number];
  })
  .catch(_ctx => [null, null]);

export const booleanParamParser = z
  .string()
  .transform(val => val === "true")
  .catch(false);

export const geometryParamParser = z
  .string()
  .transform(val => JSON.parse(val) as GeoJSON.Feature | null)
  .catch(null);

export const dateArrayParamParser = z
  .string()
  .transform(val => val.split(",").map(v => v.split("~")))
  .catch(_ctx => []);

export const dateParamParser = z
  .string()
  .transform((val, ctx) => {
    const [startStr, endStr] = val.split("~", 2);
    const start = startStr !== undefined && startStr.length > 0 && !Number.isNaN(Date.parse(startStr)) ? startStr : undefined;
    const end = endStr !== undefined && endStr.length > 0 && !Number.isNaN(Date.parse(endStr)) ? endStr : undefined;

    if (start !== null && end !== null && start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start cannot be larger than end",
      });
      return z.NEVER;
    }

    return [start, end] as [undefined | string, undefined | string];
  })
  .catch(_ctx => [undefined, undefined]);

export const parameterParamParser = z
  .string()
  .transform(val =>
    val.split(",").filter(
      v => v.includes(":"),
    ).map((v) => {
      const [parameter, values] = v.split(":", 2);

      const [startStr, endStr] = values!.split("-");
      const start = parseParameterValue(startStr);
      const end = parseParameterValue(endStr);
      return {
        parameter,
        value: [start, end],
      } as { parameter: string; value: [null | number, null | number] };
    }),
  )
  .catch(_ctx => []);

function parseParameterValue(value: string | undefined) {
  if (value === undefined) {
    return null;
  }
  if (value === "*") {
    return null;
  }
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) {
    return null;
  }
  return num;
}
