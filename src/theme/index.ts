import { Theme } from 'theme-ui'

const commonColors = {
  twitterBlue: '#00acee',
  discordPurple: '#6a0dad',
}

const lightColors = {
  // primary
  primary: '#60DDBF',
  success: '#60DDBF',
  primaryDark: '#5fc2aa',
  primaryButtonActive: '#56af99',
  primaryLight: '#60DDBF1A',
  // error
  error: '#FC4D95',
  errorDark: '#e34586',
  errorButtonActive: '#cc3e79',
  errorLight: '#E8488A1A',
  // warning
  warning: '#F7931A',
  warningDark: '#de8417',
  warningButtonActive: '#c87715',
  warningLight: '#F7931A1A',
  // background
  background: '#f2f2f2',
  hover: '#E8E8E880', // #E8E8E8 50%
  active: '#E8E8E8B3', //#E8E8E8 70%
  cardBackground: '#FEFEFE80', // #FEFEFE 50%
  cardBackgroundSolid: '#F6F9F8',
  modalBackground: '#F6F9F8',
  // button
  buttonBackground: '#E8E8E899', // #E8E8E8 60%
  buttonHover: '#E8E8E8E6', // #E8E8E8 90%
  buttonActive: '#E8E8E8',
  buttonDisabled: '#B5BECA',
  // text
  text: '#052822',
  bodyText: '#052822',
  lightText: '#6B7D94',
  secondaryText: '#7a8a9f',
  disabledText: 'B5BECA',
  invertedText: '#FFFFFF',
  primaryText: '#5bd2b5',
  ...commonColors,
}

// TODO
const darkColors = {
  // primary
  success: '#60DDBF',
  primary: '#60DDBF',
  primaryDark: '#04a17c',
  primaryButtonActive: '#048d6d',
  primaryLight: '#60DDBF0D',
  // error
  error: '#FC4D95',
  errorDark: '#e34586',
  errorButtonActive: '#c73c75',
  errorLight: '#E8488A0D',
  // warning
  warning: '#F7931A',
  warningDark: '#de8417',
  warningButtonActive: '#c27414',
  warningLight: '#F7931A0D',
  // backgrounds
  background: '#000000',
  hover: '#1F242980', // #1F2429 50%
  active: '#1F2429B3', // 1F2429 70%
  cardBackground: '#1F242980', // #1F2429 50%
  cardBackgroundSolid: '#111416',
  modalBackground: '#111416',
  // grays
  buttonBackground: '#1F242999', // #1F2429 60%
  buttonHover: '#1F2429CC', // #1F2429 80%
  buttonActive: '#1F2429', // 1F2429 100%
  buttonDisabled: '#4b4e54',
  // text
  text: '#FFFFFF',
  bodyText: '#FFFFFF',
  lightText: '#B5BECA',
  secondaryText: '#6B7D94',
  disabledText: '#4b4e54',
  invertedText: '#000000',
  primaryText: '#05c99b',
  ...commonColors,
}

const theme = {
  fonts: {
    body: "'InterVariable', sans-serif",
    heading: "'Sohne', sans-serif",
    monospace: 'Menlo, monospace',
  },
  fontSizes: ['12px', '14px', '15px', '18px', '22px', '28px', '34px', '42px', '60px', '72px'],
  lineHeights: {
    small: '20px', //+8
    secondary: '21px', //+8
    body: '23px', //+8
    bodyLarge: '26px', //+8
    heading: '34px', //+12
    heading2: '24px',
    title: '36px', //+16
    largeTitle: '50px', //+16
    xlTitle: '58px', //+16
    heroHeading: '76px', //+16
    heroTitle: '88px', //+16
  },
  fontWeights: {
    light: 300,
    body: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    strong: 800,
  },
  letterSpacings: {
    heroTitle: '0px',
    heroHeading: '0px',
    xlTitle: '0px',
    largeTitle: '0px',
    title: '0px',
    heading: '0px',
    bodyLarge: '0px',
    body: '0px',
    secondary: '0px',
    small: '0px',
  },
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  radii: {
    token: '3px',
    text: '4px',
    alert: 14,
    list: 28,
    card: 28,
    circle: 99999,
  },
  text: {
    heroTitle: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'heroTitle',
      letterSpacing: 'heroTitle',
      fontSize: 9,
    },
    heroHeading: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'heroHeading',
      letterSpacing: 'heroHeading',
      fontSize: 8,
    },
    xlTitle: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'xlTitle',
      letterSpacing: 'xlTitle',
      fontSize: 7,
    },
    largeTitle: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'largeTitle',
      letterSpacing: 'largeTitle',
      fontSize: 6,
    },
    title: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'title',
      letterSpacing: 'title',
      fontSize: 5,
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'heading',
      letterSpacing: 'heading',
      fontSize: 4,
    },
    heading2: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'heading2',
      letterSpacing: 'heading',
      fontSize: 3,
    },
    bodyLarge: {
      fontFamily: 'body',
      fontStyle: 'normal',
      fontWeight: 'medium',
      lineHeight: 'bodyLarge',
      fontSize: 3,
      letterSpacing: 'bodyLarge',
    },
    body: {
      fontFamily: 'body',
      fontStyle: 'normal',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 2,
      letterSpacing: 'body',
    },
    bodyMedium: {
      variant: 'text.body',
      fontWeight: 'medium',
    },
    secondary: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'secondary',
      fontSize: 1,
      letterSpacing: 'secondary',
    },
    secondaryMedium: {
      variant: 'text.secondary',
      fontWeight: 'medium',
    },
    small: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'small',
      fontSize: 0,
      letterSpacing: 'small',
    },
    smallMedium: {
      variant: 'text.small',
      fontWeight: 'medium',
    },
    label: {
      variant: 'text.small',
    },
  },
  variants: {
    card: {
      borderRadius: [0, 'card'],
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'transparent',
      textDecoration: 'none',
      bg: 'cardBackground',
    },
    tableRow: {
      borderSpacing: 0,
      ':hover': {
        bg: 'hover',
      },
    },
    list: {
      bg: 'transparent',
      paddingInlineStart: 0,
      marginBlockStart: 0,
      marginBlockEnd: 0,
      marginInlineStart: 0,
      marginInlineEnd: 0,
      overflow: 'hidden',
      listStyleType: 'none',
      p: 0,
    },
    listItem: {
      color: 'bodyText',
      textDecoration: 'none',
      textAlign: 'left',
      '&:not(.disabled):hover': {
        bg: 'hover',
      },
      '&:not(.disabled):active': {
        bg: 'active',
      },
    },
    inputContainer: {
      fontFamily: 'body',
      bg: 'buttonBackground',
      borderRadius: '18px',
      border: '1px solid transparent',
      minHeight: '35px',
      ':hover': {
        bg: 'buttonHover',
      },
    },
    toast: {
      cursor: 'pointer',
    },
    toastDefault: {
      variant: 'toast',
      bg: 'modalBackground',
      color: 'bodyText',
    },
    toastError: {
      variant: 'toast',
      bg: 'error',
      color: 'white',
    },
    toastSuccess: {
      variant: 'toast',
      bg: 'primary',
      color: 'white',
    },
    toastWarning: {
      variant: 'toast',
      bg: 'warning',
      color: 'white',
    },
    token: {
      fontSize: 0,
      fontWeight: 'semibold',
      borderRadius: 'token',
      textTransform: 'uppercase',
      letterSpacing: '2%',
      px: 2,
      lineHeight: '24px',
      height: '24px',
    },
    tokenDefault: {
      variant: 'variants.token',
      bg: 'hover',
      color: 'lightText',
    },
    tokenError: {
      variant: 'variants.token',
      bg: 'errorLight',
      color: 'errorDark',
    },
    tokenPrimary: {
      variant: 'variants.token',
      bg: 'primaryLight',
      color: 'primaryDark',
    },
    tokenWarning: {
      variant: 'variants.token',
      bg: 'warningLight',
      color: 'warningDark',
    },
    alert: {
      borderRadius: 'alert',
      py: 3,
      px: 4,
    },
    alertInfo: {
      variant: 'variants.alert',
      bg: 'cardBackground',
      color: 'lightText',
    },
    alertError: {
      variant: 'variants.alert',
      bg: 'errorLight',
      color: 'errorDark',
    },
    alertPrimary: {
      variant: 'variants.alert',
      bg: 'primaryLight',
      color: 'primaryDark',
    },
    alertWarning: {
      variant: 'variants.alert',
      bg: 'warningLight',
      color: 'warningDark',
    },
    textLink: {
      color: 'lightText',
      textDecoration: 'none',
      ':hover': { color: 'bodyText' },
      transition: 'color 0.1s ease-out',
      display: 'flex',
      alignItems: 'center',
    },
  },
  buttons: {
    base: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      ':focus': {
        outlineWidth: '0px',
      },
    },
    // "small", "medium", "large" variants must refer to direct fontSize indexes (0, 1, 2)
    // See dependency in Button component
    small: {
      variant: 'buttons.base',
      fontFamily: 'body',
      fontWeight: 'medium',
      fontSize: 1,
      cursor: 'pointer',
      borderRadius: 'circle',
      height: '28px',
      px: 2,
    },
    medium: {
      variant: 'buttons.base',
      fontFamily: 'body',
      fontWeight: 'medium',
      fontSize: 2,
      cursor: 'pointer',
      borderRadius: 'circle',
      height: '36px',
      px: 3,
    },
    large: {
      variant: 'buttons.base',
      fontFamily: 'heading',
      fontWeight: 'semibold',
      fontSize: 2,
      cursor: 'pointer',
      borderRadius: 'circle',
      height: '56px',
      px: 3,
    },
    disabled: {
      borderColor: 'buttonDisabled',
      color: 'invertedText',
      cursor: 'not-allowed',
      bg: 'buttonDisabled',
      '&:not(.disabled):hover': {
        bg: 'buttonDisabled',
        borderColor: 'transparent',
      },
    },
    primary: {
      borderColor: 'primary',
      bg: 'primary',
      color: 'invertedText',
      '&:not(.disabled):hover': {
        borderColor: 'primaryDark',
        bg: 'primaryDark',
      },
      '&:not(.disabled):active': {
        bg: 'primaryButtonActive',
        borderColor: 'primaryButtonActive',
      },
    },
    primaryTransparent: {
      bg: 'transparent',
      color: 'primary',
      '&:not(.disabled):hover': {
        bg: 'buttonBackground',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
    },
    primaryOutline: {
      bg: 'transparent',
      color: 'primary',
      borderColor: 'primary',
      '&:not(.disabled):hover': {
        bg: 'buttonBackground',
        borderColor: 'primaryDark',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'primaryButtonActive',
      },
    },
    error: {
      borderColor: 'error',
      bg: 'error',
      color: 'invertedText',
      '&:not(.disabled):hover': {
        borderColor: 'errorDark',
        bg: 'errorDark',
      },
      '&:not(.disabled):active': {
        bg: 'errorButtonActive',
        borderColor: 'errorButtonActive',
      },
    },
    errorTransparent: {
      bg: 'transparent',
      color: 'error',
      '&:not(.disabled):hover': {
        bg: 'buttonBackground',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
    },
    errorOutline: {
      bg: 'transparent',
      color: 'error',
      borderColor: 'error',
      '&:not(.disabled):hover': {
        bg: 'buttonBackground',
        borderColor: 'errorDark',
      },
      '&:not(.disabled):active': {
        bg: 'errorHover',
        borderColor: 'errorButtonActive',
      },
    },
    warning: {
      borderColor: 'warning',
      bg: 'warning',
      color: 'invertedText',
      '&:not(.disabled):hover': {
        borderColor: 'warningDark',
        bg: 'warningDark',
      },
      '&:not(.disabled):active': {
        bg: 'warningButtonActive',
        borderColor: 'warningButtonActive',
      },
    },
    warningTransparent: {
      bg: 'transparent',
      color: 'warning',
      '&:not(.disabled):hover': {
        bg: 'buttonBackground',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
    },
    warningOutline: {
      bg: 'transparent',
      color: 'warning',
      borderColor: 'warning',
      '&:not(.disabled):hover': {
        bg: 'buttonBackground',
        borderColor: 'warningDark',
      },
      '&:not(.disabled):active': {
        bg: 'warningHover',
        borderColor: 'warningButtonActive',
      },
    },
    default: {
      borderColor: 'buttonBackground',
      bg: 'buttonBackground',
      color: 'bodyText',
      '&:not(.disabled):hover': {
        bg: 'buttonHover',
        borderColor: 'buttonHover',
      },
      '&:not(.disabled):active': {
        bg: 'buttonActive',
        borderColor: 'buttonActive',
      },
    },
    defaultOutline: {
      borderColor: 'buttonHover',
      bg: 'transparent',
      color: 'bodyText',
      '&:not(.disabled):hover': {
        bg: 'hover',
        borderColor: 'hover',
      },
      '&:not(.disabled):active': {
        bg: 'active',
        borderColor: 'active',
      },
    },
    defaultTransparent: {
      borderColor: 'transparent',
      bg: 'transparent',
      color: 'bodyText',
      '&:not(.disabled):hover': {
        bg: 'hover',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'active',
        borderColor: 'transparent',
      },
    },
    light: {
      variant: 'buttons.default',
      color: 'lightText',
    },
    lightOutline: {
      variant: 'buttons.defaultOutline',
      color: 'lightText',
    },
    lightTransparent: {
      variant: 'buttons.defaultTransparent',
      color: 'lightText',
      borderColor: 'transparent',
    },
    white: {
      bg: 'white',
      color: lightColors.text,
      '&:not(.disabled):hover': {
        bg: lightColors.buttonHover,
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: lightColors.buttonActive,
        borderColor: 'transparent',
      },
    },
  },
  forms: {
    input: {
      variant: 'text.body',
      borderWidth: 1,
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderRadius: 0,
      color: 'bodyText',
      px: 0,
      py: 0,
      ':hover,:focus,.active': {
        outline: 0,
      },
      '::placeholder': {
        color: 'secondaryText',
        fontWeight: 'body',
      },
      '::-webkit-outer-spin-button,::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        margin: 0,
      },
    },
    slider: {
      color: 'lightText',
      ':focus': {
        color: 'primary',
      },
      bg: 'buttonBackground',
    },
  },
  styles: {
    root: {
      variant: 'text.body',
    },
  },
  zIndex: {
    popover: 1000,
    modal: 100,
    chart: 2,
    desktopHeader: 1,
    topNavBar: 5,
    bottomNav: 101,
  },
}

export const getThemePreset = (isRoot: boolean, isLightMode: boolean = true): Theme => ({
  useColorSchemeMediaQuery: isRoot ? true : false,
  initialColorModeName: 'light',
  colors: {
    ...(isLightMode ? lightColors : darkColors),
    modes: isLightMode
      ? {
          dark: darkColors,
        }
      : { light: lightColors },
  },
  ...theme,
})

export const defaultPreset = getThemePreset(true)

export const darkTheme = {
  colors: darkColors,
  ...theme,
}

export const lightTheme = {
  colors: lightColors,
  ...theme,
}

export default defaultPreset
