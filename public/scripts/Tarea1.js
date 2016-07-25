var data = [
  {user_id: 1, username: "PeteHunt", password: "This is one comment"},
  {user_id: 2, username: "JordanWalke", password: "This is *another* comment"},
  {user_id: 3, username: "TrisPrior", password: "Divergent"}
];

var User = React.createClass({
  render: function() {
    return (
      <div className="input-container">
        <h3 id={this.props.user_id}>{this.props.children}</h3>
        <div className="bar"></div>
      </div>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    var UserNodes = this.props.data.map(function(user) {
      return (
        <User user_id={user.user_id}>
          {user.username}
        </User>
      );
    });
    return (
      <div className="userList">
        {UserNodes}
      </div>
    );
  }
});

var Card = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadUsersFromServer: function() {
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
    this.loadUsersFromServer();
    setInterval(this.loadUsersFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div>
        <div className="card"></div>
        <div className="card">
            <h1 className="title">{this.props.title}</h1>
            <UserList data={this.state.data}/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Card title="List Users" url="localhost:3000/users" pollInterval={100}/>,
  document.getElementById('content')
);
