import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import cookie from 'react-cookies'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


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

function handleSubmit(event) {
    console.log(event.target);
    const username = event.target.username.value;
    const password = event.target.password.value;
    console.log(username);
    console.log(password);
    // Login

    var data = new FormData();
    data.append(`username`, username);
    data.append(`password`, password);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://127.0.0.1:8000/api/user/login', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(urlencodeFormData(data));
    xhr.onload = function () {
        // do something to response
        const jsResponse = JSON.parse(xhr.responseText);
        //alert(`The Auth Token is ${jsResponse.token}`);
        console.log(jsResponse.token);
        if (jsResponse.status === 'success') {
            cookie.save(`HNToken`, jsResponse.token, {path: `/`});
            window.location.href = "http://127.0.0.1:3000/feed/-1";
        } else alert(`Wrong Credentials`);
        //console.log(this.responseText);
    };

    xhr.onerror = function () {
        alert("Please Try Again");
    };


    event.preventDefault();

    //if(jsResponse.status==='success')
    //  window.location.href = "http://127.0.0.1:3000/feed/-1";
    //else alert(`Wrong Credentials`);
}


function handleRegister(event) {
    console.log(`Register Called`);
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username);
    console.log(password);
    // Login

    var data = new FormData();
    data.append(`username`, username);
    data.append(`password`, password);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://127.0.0.1:8000/api/user/register', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(urlencodeFormData(data));
    xhr.onload = function () {
        // do something to response
        //console.log(this.responseText);
        if (JSON.parse(xhr.responseText).status === "success") alert("Registration Successful");
        else alert(JSON.parse(xhr.responseText).message);
        //console.log(cookie.load(`HNToken`));
    };
    xhr.onerror = function () {
        alert("Please Try Again");
    };

    event.preventDefault();
}


export default function SignIn() {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form id={"credForm"} className={classes.form} onSubmit={handleSubmit} method={"POST"} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Grid container>
                        <Grid item xs>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                name={"login"}
                                value={"login"}
                            >
                                Sign In
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                name={"register"}
                                value={"register"}
                                onClick={handleRegister}
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
