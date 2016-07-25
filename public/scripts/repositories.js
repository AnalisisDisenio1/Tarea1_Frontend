var ReposTry = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadReposServerFrom: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadReposServerFrom();
    setInterval(this.loadReposServerFrom, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentList">
        <h1>Repos</h1>
        <CommentList data={this.state.data}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
    return (
      <Comment author={comment.name} key={comment.id}>
        {comment.html_url}
      </Comment>
    );
  });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },
  render: function() {
    var md = new Remarkable();
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <ReposTry url="https://api.github.com/users/kenystev/repos" pollInterval={100}/>,
  document.getElementById('content')
);
