import React from 'react'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { injectStyle } from 'react-toastify/dist/inject-style'
import styled from 'styled-components'
import { ThemeProvider as InternalThemeProvider } from 'theme-ui'

import { darkTheme, getThemePreset, lightTheme } from '.'

type Props = {
  children: React.ReactNode
  isDarkMode?: boolean
  isLightMode?: boolean
}

const StyledToastContainer = styled(ToastContainer)`
  // https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
  &&&.Toastify__toast-container {
    width: 420px !important;
    max-width: 100vw !important;
    min-height: 42px !important;
  }
  .Toastify__toast {
    border-radius: 10px !important;
    padding: 0px !important;
    min-height: 42px !important;
  }
  .Toastify__toast-body {
    padding: 0px !important;
    margin: 0px !important;
  }
  .Toastify__progress-bar {
  }
  .Toastify__toast--default {
    background: transparent;
  }
`

export default function ThemeProvider({ children, isDarkMode = false, isLightMode = false }: Props) {
  const theme = isDarkMode ? darkTheme : isLightMode ? lightTheme : getThemePreset(true)

  useEffect(() => {
    injectStyle()
  }, [])

  return (
    // TODO: @earthtojake fix theme typing
    <InternalThemeProvider theme={theme as any}>
      <>
        {children}
        <StyledToastContainer closeButton={false} />
      </>
    </InternalThemeProvider>
  )
}
