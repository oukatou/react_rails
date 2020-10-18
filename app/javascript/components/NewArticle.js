import React from "react";
import { Link } from "react-router-dom";

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
    };
  }

  stripHtmlEntities = (str) => {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    const url = "/api/v1/articles/create";
    const { title, text } = this.state;

    if (title.length == 0 || text.length == 0)
      return;

    const body = {
      title,
      text: this.stripHtmlEntities(text).replace(/\n/g, "<br> <br>")
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.props.history.push(`/article/${response.id}`))
      .catch(error => console.log(error.message));
  }
  render() {
    return (
      <div>
        <h1>
          Add a new article.
        </h1>
        <form onSubmit={this.onSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              onChange={this.onChange}
            />
          </div>
          <label htmlFor="text">Content</label>
          <textarea
            id="text"
            name="text"
            rows="5"
            required
            onChange={this.onChange}
          />
          <button type="submit">
            Create Article
          </button>
          <Link to="/articles">
            Back to articles
          </Link>
        </form>
      </div>
    );
  }

}

export default NewArticle;