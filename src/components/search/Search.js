import React, { useState } from "react";
import { Link, graphql, StaticQuery } from "gatsby";

const Search = (props) => {
  const emptyQuery = "";

  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  });

  const handleInputChange = (event) => {
    const query = event.target.value;
    const { data } = props;
    const posts = data.allMdx.edges || [];

    const filteredData = posts.filter((post) => {
      const { metaDescription, metaTitle, tags} = post.node.frontmatter;
      const { excerpt } = post.node;

      return (
        (metaDescription && metaDescription.toLowerCase().includes(query.toLowerCase())) ||
        (metaTitle && metaTitle.toLowerCase().includes(query.toLowerCase())) ||
        (excerpt && excerpt.toLowerCase().includes(query.toLowerCase())) ||
        (tags && tags.join("").toLowerCase().includes(query.toLowerCase()))
      );
    });

    setState({
      query,
      filteredData,
    });
  };

  const renderSearchResults = () => {
    const { query, filteredData } = state;
    const hasSearchResults = filteredData && query !== emptyQuery;
    const posts = hasSearchResults ? filteredData : [];
    return (
      posts &&
      posts.map(({ node }) => {
        const { excerpt } = node;

        const { slug } = node.fields;
        const { metaTitle, date, metaDescription, tags } = node.frontmatter;
        return (
          <div key={slug} className="search-article">
            <article key={slug}>
              <header>
                <h2>
                  <Link to={slug}>{metaTitle}</Link>
                </h2>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: excerpt //tags//tags //excerpt //metaDescription || excerpt,
                  }}
                />
                <p>
                  <em>{date}</em>
                </p>
              </section>
            </article>
          </div>
        );
      })
    );
  };

  return (
    <div className="search">
          <input
            className="form-control form-control-sm ml-3 w-75"
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={handleInputChange}
          />
      {state.query && (
        <div className="search-result-container">
          {renderSearchResults()}
        </div>
      )}
    </div>
  );
};

export default (props) => (
  <StaticQuery
    query={graphql`
      query {
        allMdx(sort: { order: DESC, fields: frontmatter___date }) {
          edges {
            node {
              excerpt(pruneLength: 50)
              frontmatter {
                metaTitle
                metaDescription
                date(formatString: "MMMM DD, YYYY")
                tags
              }
              fields {
                id
                slug
              }
            }
          }
        }
      }
    `}
    render={(data) => <Search data={data} {...props} />}
  />
);