import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
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

export default function Login(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state , setState] = useState({
    email : "",
    password : ""
  })
  const handleChange = (e) => {
      const {id , value} = e.target ;  
      setState(prevState => ({
          ...prevState,
          [id] : value
      }
      ))
      
  }
  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload={
        "email":state.email,
        "password":state.password,
    }
    fetch('/api/login',{
      method: 'post',
      body:    JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
  })
        .then(function (response) {
            if(response.data.code === 200){
                setState(prevState => ({
                    ...prevState,
                    'successMessage' : 'Login successful. Redirecting to home page..'
                }))
                redirectToHome();
                props.showError(null)
            }
            else if(response.data.code === 204){
                props.showError("Username and password do not match");
            }
            else{
                props.showError("Username does not exists");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

const redirectToHome = () => {
  history.push('/home');
}
const redirectToSignUp = () => {
  history.push('/signup'); 
}
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={state.email}
              onChange = {handleChange}
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
              value={state.password}
              onChange = {handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onclick={handleSubmitClick}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            
          </form>
        </div>
    </Container>
  );
}