var CommentList = React.createClass({
  render: function() {
    return (
      <div className = "commentList" >
        I am a Comment List 
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return ( 
      <div className = "commentForm" >
        I am a Comment Form 
      </div>
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className = "commentBox" >
        <h1> Comments </h1> 
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

React.render(
  <CommentBox /> ,
  document.getElementById('content')
);