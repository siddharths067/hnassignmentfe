import React, {Component} from 'react';
import './App.css';

import {BrowserRouter as Router, Route} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import SignIn from "./SignIn";
import cookie from 'react-cookies'
import Button from "@material-ui/core/Button";


function urlencodeFormData(fd) {
    var s = '';

    function encode(s) {
        return encodeURIComponent(s).replace(/%20/g, '+');
    }

    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
        }
    }
    return s;
}

class Login extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <SignIn/>;
    }
}


class CommentPaper extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.upvote = this.upvote.bind(this);
        this.downvote = this.downvote.bind(this);
        this.recalibrateVotes = this.recalibrateVotes.bind(this);
    }

    recalibrateVotes() {
        var data = new FormData();
        data.append(`id`, this.props.replyto);
        data.append(`HNToken`, cookie.load(`HNToken`));
        console.log(cookie.load(`HNToken`));
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://127.0.0.1:8000/api/comment/vote/get', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.send(urlencodeFormData(data));
        const resp = JSON.parse(xhr.responseText);
        this.setState({
            upvotes: resp.upvotes,
            downvotes: resp.downvotes
        });
        xhr.onerror = function () {
            console.log(`Error has occurred`);
        }
    }

    componentDidMount() {
        this.recalibrateVotes();
    }

    upvote() {
        var data = new FormData();
        data.append(`id`, this.props.replyto);
        data.append('type', 'upvote');
        data.append(`HNToken`, cookie.load(`HNToken`));
        console.log(cookie.load(`HNToken`));
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://127.0.0.1:8000/api/comment/vote', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.send(urlencodeFormData(data));
        const resp = JSON.parse(xhr.responseText);
        this.setState({
            upvotes: parseInt(this.state.upvotes) + 1
        });
        xhr.onerror = function () {
            console.log(`Error has occurred`);
        };
        this.recalibrateVotes();
    }

    downvote() {
        var data = new FormData();
        data.append(`id`, this.props.replyto);
        data.append('type', 'downvote');
        data.append(`HNToken`, cookie.load(`HNToken`));
        console.log(cookie.load(`HNToken`));
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://127.0.0.1:8000/api/comment/vote', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.send(urlencodeFormData(data));
        const resp = JSON.parse(xhr.responseText);
        this.setState({
            downvotes: parseInt(this.state.downvotes) + 1
        });
        xhr.onerror = function () {
            console.log(`Error has occurred`);
        };
        this.recalibrateVotes();
    }

    render() {
        return <Paper>
            <h2> {this.props.text}</h2>
            <Paper>
                {`By ${this.props.username}`}
                <a href={`/feed/${this.props.replyto}`}>
                    <Button variant="contained">
                        See Replies or Reply Here to in a Nested Thread
                    </Button>
                </a>
                <Button variant="contained" onClick={this.upvote}>
                    UPVOTE {(this.state.upvotes) ? this.state.upvotes : ""}
                </Button>
                <Button variant="contained" onClick={this.downvote}>
                    DOWNVOTE {(this.state.downvotes) ? this.state.downvotes : ""}
                </Button>
            </Paper>
        </Paper>;
    }
}


class Feed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            replyto: this.props.match.params.replyto
        };

        this.commentSubmit = this.commentSubmit.bind(this);
        this.softRefresh = this.softRefresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    softRefresh() {
        console.log(10000);
        this.setState({
            comments: 10000
        });

        var data = new FormData();
        data.append(`replyto`, this.props.match.params.replyto);
        data.append(`HNToken`, cookie.load(`HNToken`));
        console.log(cookie.load(`HNToken`));
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://127.0.0.1:8000/api/comment/get', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.send(urlencodeFormData(data));
        this.setState({
            comments: JSON.parse(xhr.responseText)
        });
        xhr.onerror = function () {
            console.log(`Error has occurred`);
        }
    }

    componentDidMount() {
        this.softRefresh();
    }

    commentSubmit(event) {

        event.preventDefault();
        var data = new FormData();
        data.append(`text`, event.target.text.value);
        data.append('replyto', this.props.match.params.replyto);
        data.append(`HNToken`, cookie.load(`HNToken`));
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://127.0.0.1:8000/api/comment', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.send(urlencodeFormData(data));
        xhr.onerror = function () {
            console.log(`Error has occurred`);
        };

        this.softRefresh();

    }

    logout() {
        var data = new FormData();
        data.append(`HNToken`, cookie.load(`HNToken`));
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://127.0.0.1:8000/api/user/logout', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.send(urlencodeFormData(data));
        console.log(xhr.responseText);
        xhr.onerror = function () {
            console.log(`Error has occurred`);
        };

        window.location.href = "/";
    }

    render() {
        return <Paper>
            <form onSubmit={this.commentSubmit}>
                <input type={"text"} name={"text"} id={"text"}/>
                <input type={"submit"} name={"submit"}
                       value={(this.state.replyto === "-1") ? "POST a new Thread" : "Reply to this Top Comment"}/>
            </form>

            <Button variant="contained" onClick={this.logout}>
                Logout
            </Button>

            {(this.state.comments === undefined || this.state.comments.comments === undefined) ? "Please wait while the components load" : this.state.comments['comments'].map(e =>
                <CommentPaper text={e.text} username={e.username} replyto={e.id}/>)}
        </Paper>;
    }
}

function App() {
    return (
        <Router>
            <Route path={"/"} exact component={Login}/>
            <Route path={"/feed/:replyto"} component={Feed}/>
        </Router>
    );
}

export default App;
