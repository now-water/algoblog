const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://www.nowwatersblog.com/',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: 'src/favicon.ico',
    logoLink: './favicon.ico',
    title:
      "<a href='https://github.com/nowwater/algoblog'><img class='img-responsive' src='src/favicon.ico' alt='Learn logo' /></a>",
    githubUrl: 'https://github.com/nowwater/algoblog',
    helpUrl: '',
    tweetText: '',
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: 'index_name',
      algoliaAppId: 'appid',
      algoliaSearchKey: 'searchKey',
      algoliaAdminKey: 'adminKey',
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/introduction', // add trailing slash if enabled above
      '/codeblock',
    ],
    collapsedNav: [
      '/codeblock', // add trailing slash if enabled above
    ],
    links: [{ text: '', link: '' }],
    frontline: false,
    ignoreIndex: true,
    title:"<div><span>목차</span></div>"
  },
  siteMetadata: {
    title: '끊임없이 배우고 성장하려는 개발자입니다.',
    description: 'Computer Science & Server engineer',
    ogImage: null,
    docsLocation: 'https://github.com/nowwater',
    favicon: 'https://nowwatersblog.com/favicon.ico',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/favicon.ico',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
