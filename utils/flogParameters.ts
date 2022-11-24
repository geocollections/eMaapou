import zip from '~/utils/zip'

export interface IFlogParameter {
  id: number
  value: number
  methodValue: number
  count: number
  name: string
}
export interface IFlogMethod {
  id: number
  value: number
  name: string
  name_en: string
  count: number
  children: IFlogParameter[]
}

export default function flogParameters(analysisResultsPivot: {
  [K: string]: any[]
}): IFlogMethod[] {
  let id = 0
  const methods = zip(...Object.values(analysisResultsPivot)).map(
    ([method, methodParameters]: any[]) => {
      id += 1
      return {
        id,
        value: parseInt(method.value),
        name: method.pivot[0].value,
        name_en: method.pivot[0].pivot[0].value,
        count: method.count,
        children: methodParameters.pivot.map((parameter: any) => {
          id += 1
          return {
            value: parseInt(parameter.value),
            methodValue: parseInt(method.value),
            id,
            count: parameter.count,
            name: parameter.pivot[0].value,
          }
        }),
      }
    }
  )
  return methods
}
