import { Dispatch } from 'react'
import { useColorMode } from 'theme-ui'

export default function useIsDarkMode(): [boolean, Dispatch<boolean>] {
  const [colorMode, setColorMode] = useColorMode()
  const isDarkMode = colorMode === 'dark'
  const setIsDarkMode = (isDarkMode: boolean) => {
    setColorMode(isDarkMode ? 'dark' : 'light')
  }
  return [isDarkMode, setIsDarkMode]
}
