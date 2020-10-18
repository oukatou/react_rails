import React from "react";
import { Link } from "react-router-dom";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = { article: [] };
  }
  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const url = `/api/v1/show/${id}`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ article: response }))
      .catch(() => this.props.history.push("/articles"));
  }

  addHtmlEntities = (str) => {
    return String(str)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }
  deleteArticle = () => {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => this.props.history.push("/articles"))
      .catch(error => console.log(error.message));
  }
  render() {
    const { article } = this.state;
    const articleContent = this.addHtmlEntities(article.text);

    return (
      <div>
        <div>
          <h1>
            {article.title}
          </h1>
        </div>
        <div>
          <div>
            <div>
              <h5>Content</h5>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${articleContent}`
                }}
              />
            </div>
            <div>
              <button onClick={this.deleteArticle}>
                Delete article
              </button>
            </div>
          </div>
          <Link to="/articles">
            Back to articles
          </Link>
        </div>
      </div>
    );
  }
}

export default Article;