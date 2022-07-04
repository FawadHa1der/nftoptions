import getVariantSX from './getVariantSX'
import mergeDeep from './mergeDeep'

export default function mergeVariantSX(targetVariant: string, ...variants: string[]) {
  const targetSx = getVariantSX(targetVariant)
  const sxs = variants.map(variant => {
    const sx = getVariantSX(variant)
    if (!sx) {
      console.warn('Missing variant:', variant)
    }
    return sx
  })
  const sx = mergeDeep(targetSx, ...sxs)
  return sx
}
