var Comment = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    var comment = {"author":this.props.author, "text": this.props.text};
    return this.props.onDelete(comment);
  },
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          { this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{ __html: rawMarkup }} />
        <div className="btn btn-danger" onClick={this.handleDelete}>delete</div>
      </div>
    )
  }
});

var CommentList = React.createClass({
  handleDelete: function(comment) {
    return this.props.delete(comment);
  },
  render: function() {
    var  commentNodes = this.props.data.map(function(comment, index) {
      console.log('COMMENT', comment);
      return (
        <Comment author={ comment.author } text={ comment.text } onDelete={ this.handleDelete } key={ index }>
          { comment.text }
        </Comment>
      );
    }.bind(this));
    console.log('COMMENTLIST', commentNodes);
    return (
      <div className = "commentList" >
        { commentNodes }
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if(!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return ( 
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input className="btn btn-primary" type="submit" value="Post" />
      </form>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    console.log("Loaded comments from server");
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function() {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    console.log("Submitting to the server");
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  deleteComment: function(comment) {
    // var comments = this.state.data;
    // var updatedComments = comments.splice(comments.indexOf([comment]), 1);
    // this.setState({data: updatedComments});
    console.log('Deleted Comment:', comment);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'PUT',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className = "commentBox" >
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <h1> Comments </h1> 
        <CommentList data={ this.state.data } delete={ this.deleteComment }/>
      </div>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);