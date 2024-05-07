import { z } from "zod";
import uniq from "lodash/uniq";

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
    const [startStr, endStr] = val.split("-");
    const start = Number.parseInt(startStr) || null;
    const end = Number.parseInt(endStr) || null;

    if (start && end && start > end) {
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

export const parameterParamParser = z
  .string()
  .transform(val =>
    val.split(",").map((v) => {
      const [parameter, values] = v.split(":");
      const [startStr, endStr] = values.split("-");
      const start = startStr === "*" ? null : Number.parseInt(startStr);
      const end = endStr === "*" ? null : Number.parseInt(endStr);
      return {
        parameter,
        value: [start, end],
      } as { parameter: string; value: [null | number, null | number] };
    }),
  )
  .catch(_ctx => []);
