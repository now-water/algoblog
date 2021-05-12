import React, { useState } from "react";
import { Link, graphql, StaticQuery } from "gatsby";
//import { StyledSearchWrapper } from "./SearchStyle";
import './SearchCSS.css';

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
        const { title, metaTitle, date, metaDescription, tags } = node.frontmatter;
        return (
          //<StyledSearchWrapper>
          <div key={slug} className={"search-article"}>
            <article key={slug}>
              <header>
                <h1>
                  <Link to={slug}>{title}</Link>
                </h1>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: excerpt //tags//tags //excerpt //metaDescription || excerpt,
                    /* 이 p 태그 아래에 다음과 같이 날짜
                        <p>
                          <em>{date}</em>
                        </p>
                    */
                  }}
                />
              </section>
            </article>
          </div>
          //</StyledSearchWrapper>
        );
      })
    );
  };

  return (
    //<StyledSearchWrapper>
    <div className={"search"}>
          <input
            className="form-control form-control-sm ml-3 w-500 search-input"
            type="text"
            placeholder="검색 (제목, 내용, 태그)"
            aria-label="Search"
            onChange={handleInputChange}
          />
      {state.query && (
        <div className={"search-result"}>
          {renderSearchResults()}
        </div>
      )}
    </div>
    //</StyledSearchWrapper>
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
                title
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
