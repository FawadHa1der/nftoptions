const APP_NAME = 'Lyra NFT'
/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: APP_NAME,
  titleTemplate: "%s",
  defaultTitle: APP_NAME,
  description: "Lyra NFT put demo on starknet(goerli)",
  canonical: "https://nextarter-chakra.sznm.dev",
  openGraph: {
    url: "https://nextarter-chakra.sznm.dev",
    title: APP_NAME,
    description: "Lyra NFT put demo on starknet(goerli)",
    images: [
      {
        url: "https://cairopal.xyz/cairopal.png",
        alt: APP_NAME,
      },
    ],
    site_name: APP_NAME,
  },
  twitter: {
    handle: "@fawadha1der",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
