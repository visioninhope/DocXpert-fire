export const SEO = {
  title: "DocXpert",
  description: "Revolutionise your Learning Experience.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://docxpert.vercel.app/",
    // // url: "https://docxpert.vercel.app/",
    siteName: "docxpert",
    images: [
      { url: "/logo.png" },
      {
        url: "https://docxpert.vercel.app/og.png",
        width: 800,
        height: 600,
        alt: "Og Image",
        type: "image/jpeg",
      },
    ],
  },

  themeColor: "light",
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      name: "application-name",
      content: "DocXpert",
    },
  ],

  additionalLinkTags: [
    {
      rel: "icon",
      href: "/logo.png",
    },
  ],
};
