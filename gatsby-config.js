require('dotenv').config();

module.exports = {
  siteMetadata: {
    url: 'https://zacharytamas.com',
    title: 'zacharytamas',
    subtitle: 'The web home of a very varied man.',
    copyright: '© All rights reserved.',
    disqusShortname: '',
    menu: [
      { label: 'Articles', path: '/' },
      // TODO Add back once page is ready.
      // { label: 'About me', path: '/about/' },
      { label: 'Contact me', path: '/contact/' }
    ],
    author: {
      name: 'Zachary Jones',
      email: 'zachary@thorough.company',
      twitter: 'zacharytamas',
      github: 'zacharytamas',
      telegram: '',
      rss: '#',
      vk: '#'
    }
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: { path: `${__dirname}/src/pages`, name: 'pages' }
    },
    {
      resolve: `@zacharytamas/gatsby-source-web-data`,
      options: { token: process.env.GITHUB_TOKEN }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: url
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge =>
                Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.site_url + edge.node.fields.slug,
                  guid: site.siteMetadata.site_url + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }]
                })
              ),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        layout
                        draft
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml'
          }
        ]
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: `<!-- more -->`,
        excerptSeparator: `<!-- more -->`,
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: { maxWidth: 960 }
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: { wrapperStyle: 'margin-bottom: 1.0725rem' }
          },
          // { resolve: 'gatsby-remark-toc', options: { header: '' } },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants'
        ]
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: { trackingId: 'UA-11164103-1' }
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Domine`, `Open Sans`]
      }
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
            {
              site {
                siteMetadata {
                  url
                }
              }
              allSitePage(
                filter: {
                  path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
                }
              ) {
                edges {
                  node {
                    path
                  }
                }
              }
          }`,
        output: '/sitemap.xml',
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.url + edge.node.path,
              changefreq: 'daily',
              priority: 0.7
            };
          })
      }
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss-sass'
  ]
};
