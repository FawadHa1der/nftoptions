/* eslint-disable react/jsx-props-no-spreading */
import 'material-react-toastify/dist/ReactToastify.css'
import 'styles/globals.css'
import '@fontsource/inter/variable-full.css'

import { Layout } from 'components/layout'
import NoSSR from 'components/layout/NoSSR'
import { ToastContainer } from 'material-react-toastify'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import React from 'react'
import { SWRConfig } from 'swr'
import ThemeProvider from 'theme/ThemeProvider'

import defaultSEOConfig from '../../next-seo.config'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <ThemeProvider>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <NoSSR>
          <ToastContainer />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NoSSR>
      </ThemeProvider>
    </SWRConfig>
  )
}

export default MyApp
