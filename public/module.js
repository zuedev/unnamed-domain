const state = {};

state.query = new URLSearchParams(window.location.search.slice(1));

// do we have an "id" parameter? if not, set it to "README.md"
state.article_id = state.query.get("id") || "README.md";

// fetch article data from github
state.data = await fetch(
  `https://raw.githubusercontent.com/zuedev/unnamed-domain/canon/wiki/${state.article_id}`
);

// parse article data as markdown
state.markdown = await state.data.text();

// override markdown renderer
const renderer = {
  link(href, title, text) {
    // if the link is an internal link, use the query parameter "id" to navigate to the article
    if (!href.startsWith("http"))
      return `<a href="?id=${href.slice(2)}">${text}</a>`;

    // otherwise, use the default renderer
    return marked.Renderer.prototype.link.call(this, href, title, text);
  },
};
marked.use({ renderer });

// convert markdown to html
state.html = marked.parse(state.markdown);

// render html to the DOM
document.querySelector("article").innerHTML = state.html;

// expose state to the global scope and log for debugging
window.state = state;
console.log(state);
