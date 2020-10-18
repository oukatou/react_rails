import React from "react";
import { Link } from 'react-router-dom'

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
  }

  addHtmlEntities = (str) => {
    return String(str)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }
  
  componentDidMount() {
    const url = "/api/v1/articles/index";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ articles: response }))
      .catch(() => this.props.history.push("/"));
  }

  render() {
    const { articles } = this.state;
    const allArticles = articles.map((article, index) => (
      <div key={index}>
        <Link to={`/article/${article.id}`}>
          <h1>{article.title}</h1>
        </Link>
        <h5>{this.addHtmlEntities(article.text)}</h5>
      </div>
    ));

    return (
      <>
        <main>
          <div>
            <Link to="/article">
              Create New Article
            </Link>
          </div>
          <div>
            {articles.length > 0 ? allArticles : 'no article'}
          </div>
          <Link to="/">
            Home
          </Link>
        </main>
      </>
    );
  }
}
export default Articles;