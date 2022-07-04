import { CSSObject } from 'styled-components'

import theme from '../theme'
import getValue from './getValue'
import mergeDeep from './mergeDeep'

const MAX_ITERATIONS = 100

export default function getVariantSX(variant: string): CSSObject {
  let sx = Object.assign({}, getValue(theme, variant))
  let currSx = sx
  let n = 0
  while (currSx.variant && n < MAX_ITERATIONS) {
    const tmpSx = Object.assign({}, getValue(theme, currSx.variant))
    delete currSx.variant
    sx = mergeDeep(tmpSx, sx)
    currSx = tmpSx
    n++
  }
  return sx
}
