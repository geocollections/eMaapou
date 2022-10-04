import zip from '~/utils/zip'

export default function flogParameters(analysisResultsPivot) {
  let id = 0
  const methods = zip(...Object.values(analysisResultsPivot)).map(
    ([method, methodParameters]) => {
      id += 1
      return {
        id,
        name: method.pivot[0].value,
        name_en: method.pivot[0].pivot[0].value,
        count: method.count,
        children: methodParameters.pivot.map((parameter) => {
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
