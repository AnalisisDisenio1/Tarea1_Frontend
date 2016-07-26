var data = {"Users":[
  {"User_id": 1, "Username": "PeteHunt", "Password": "This is one comment"},
  {"User_id": 2, "Username": "JordanWalke", "Password": "This is *another* comment"},
  {"User_id": 3, "Username": "TrisPrior", "Password": "Divergent"}
]};

var User = React.createClass({
  deleteUser: function() {
    var url = "http://e2c867cf.ngrok.io/user/remove/";
    var user_id = this.props.user_id;
    url = url.concat(user_id);
    $.ajax({
      type: 'GET',
      url: url,
      cache: false,
      dataType: 'json',
      success: function() {
        alert("deleted");
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <tbody>
      <tr className="input-container">
        <td id={this.props.user_id}>{this.props.user_id}</td>
        <td> {this.props.children} </td>
        <td> {this.props.password} </td>
        <td> <button value="Delete" type="submit" onClick={this.deleteUser}>Delete</button> </td>
        <div className="bar"></div>
      </tr>
      </tbody>
    );
  }
});

var UserList = React.createClass({
  render: function() {
    var UserNodes = this.props.data.map(function(user, i) {
      return (
        <User user_id={user.User_id} password= {user.Password}>
          {user.Username}
        </User>
      );
    });
    return (
      <table className="table">
      <thead>
          <tr>
              <th data-field="id">ID</th>
              <th data-field="name">Username</th>
              <th data-field="pass">Password</th>
          </tr>
        </thead>
        {UserNodes}
      </table>
    );
  }
});

var Card = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadUsersFromServer: function() {
    $.ajax({
      type: 'GET',
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

var UserForm = React.createClass({
  getInitialState: function() {
    return {user_id: undefined, username: '',password: ''};
  },
  handleUsernameChange: function(e) {
    this.setState({username: e.target.value});
  },
  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },
  handleUser_idChange: function(e) {
    this.setState({user_id: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.state.username.trim();
    var password = this.state.password.trim();
    var user_id = this.state.user_id;
    if (!username || !password) {
      return;
    }
    if(user_id == undefined) {
      this.props.onUserSubmit({username: username, password: password});
    }
    else {
      user_id = parseInt(this.state.user_id.trim());
      this.props.onUserSubmit({user_id: user_id, username: username, password: password});
      alert(user_id + " "+ username + " "+ password);
    }
    this.setState({user_id: undefined, username: '', password: ''});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div id={this.props.title} className={"input-container input" + this.props.title}>
          <input
            type="number"
            id="User_id"
            name="User_id"
            value={this.state.User_id}
            onChange={this.handleUser_idChange}
          />
          <label htmlFor="User_id">ID</label>
          <div className="bar"></div>
        </div>
        <div className="input-container">
          <input
            type="text"
            id="Username"
            name="Username"
            required="required"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
          <label htmlFor="Username">Username</label>
          <div className="bar"></div>
        </div>
        <div className="input-container">
          <input
            type="password"
            id="Password"
            name="Password"
            required="required"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <label htmlFor="Password">Password</label>
          <div className="bar"></div>
        </div>
        <div className="button-container">
          <button type="submit"><span>Save</span></button>
        </div>
      </form>
    );
  }
});

var HidenCard = React.createClass({
  handleUserSubmit: function(user) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return(
      <div>
        <div className="card"></div>
        <div className="card">
            <h1 className="title">{this.props.title}</h1>
            <UserForm onUserSubmit={this.handleUserSubmit} title={this.props.title}/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Card title="List Users" url="http://e2c867cf.ngrok.io/users" pollInterval={1000}/>,
  document.getElementById('content')
);

ReactDOM.render(
  <HidenCard title="Create" url="http://e2c867cf.ngrok.io/user/save" pollInterval={40000}/>,
  document.getElementById('register')
);

ReactDOM.render(
  <HidenCard title="Update" url="http://e2c867cf.ngrok.io/user/edit" pollInterval={40000}/>,
  document.getElementById('update')
);
