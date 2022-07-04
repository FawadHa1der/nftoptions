import isServer from 'utils/isServer'
import { useBreakpointIndex } from '@theme-ui/match-media'

export default function useIsMobile(): boolean {
  const index = useBreakpointIndex()
  if (isServer()) {
    // default to non-mobile
    return false
  }
  const isMobile = index <= 1
  return isMobile
}
