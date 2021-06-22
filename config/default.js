module.exports = {
  metadata: {
    name: '만렙 개발자 키우기',
    short_name: '만렙 개발자 키우기',
    description: '',
    language: 'en',
    url: 'https://nowwatersblog.com',
    pathPrefix: '/',
    gaTrackingId: null,
    siteImage: null,
    favicon: '/assets/favicon.png',
    themeColor: '#',
  },
  header: {
    logo: '',
    logoLink: '/',
    helpUrl: '',
    links: [],
  },
  sidebar: {
    enabled: true,
    ignoreIndex: true,
    forcedNavOrder: [],
    expanded: [],
    groups: [],
    links: [],
    poweredBy: {},
  },

  pwa: {
    enabled: true, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'BooGi',
      short_name: 'BooGi',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'minimal-ui',
      crossOrigin: 'anonymous',
    },
  },
  social: {
    facebook: '',
    github: 'https://github.com/nowwater',
    gitlab: '',
    instagram: '',
    linkedin: '',
    mail: '',
    gmail: 'nowwater0225@gmail.com',
    slack: '',
    twich: '',
    twitter: '',
    youtube: '',
  },
  features: {
    editOnRepo: {
      editable: true,
      location: 'https://github.com/nowwater/algoblog',
      type: 'github',
    },
    search: {
      enabled: true,
      indexName: 'docs',
      algoliaAppId: "285XXYOWZF",
      algoliaSearchKey: "3e27ff65dfec103e090451c54b419b56",
      algoliaAdminKey: "35ac39e2950702ed1d782ce78f7c08a0",
      excerptSize: 20000,
      engine: 'localsearch',
      placeholder: 'Search',
      startComponent: 'icon', // 'input',
      debounceTime: 380,
      snippetLength: 23,
      hitsPerPage: 10,
      showStats: true,
      localSearchEngine: {
        encode: "advanced",
        tokenize: "full",
        threshold: 2,
        resolution: 30,
        depth: 20
      },
      pagination: {
        enabled: true,
        totalPages: 10,
        showNext: true,
        showPrevious: true,
      },
    },
    toc: {
      show: true,
      depth: 3,
    },
    previousNext: {
      enabled: true,
      arrowKeyNavigation: true,
    },
    scrollTop: true,
    showMetadata: true,
    propagateNetlifyEnv: true,
    pageProgress: {
      enabled: false,
      // includePaths: [],
      excludePaths: ['/'],
      height: 3,
      prependToBody: false,
      color: '#A05EB5',
    },
    mermaid: {
      language: 'mermaid',
      theme: 'dark', // default, dark, forest, neutral
      options: {}, // https://mermaidjs.github.io/#/mermaidAPI
      width: 300,
      height: 300,
    },
    rss: {
      enabled: true,
      showIcon: true,
      title: 'My RSS feed',
      copyright: '',
      webMaster: 'M',
      managingEditor: '',
      categories: ['GatsbyJS', 'Docs'],
      ttl: '60',
      matchRegex: '^/',
      outputPath: '/rss.xml',
      generator: 'gidocs',
    },
    darkMode: {
      enabled: true,
      default: false,
    },
    publishDraft: false,
    fullScreenMode: {
      enabled: false,
      hideHeader: true,
      hideToc: true,
      hideSidebar: true
    }
  },
};