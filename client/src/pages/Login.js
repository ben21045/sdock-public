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
import { useCookies } from 'react-cookie';
import Fade from '@material-ui/core/Fade';
import Copyright from '../components/Copyright'
import {
  Alert
} from '@material-ui/lab';


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
  const [cookies, setCookie] = useCookies('userId');

  const [state , setState] = useState({
    email : "",
    password : "",
    errorMessage : "",
    successMessage : ""
  })
  const handleChange = (e) => {
      const {id , value} = e.target ;  
      setState(prevState => ({
          ...prevState,
          [id] : value,
          "errorMessage" : ""
      }
      ))
      
  }
  
  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload={
        "email":state.email,
        "password":state.password,
    }
    let status;
    fetch('/api/login',{
      method: 'post',
      body:    JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
          status=response.status;
          return response.json();
        })
        .then(function (data) {
            if(status===200){
              setState(prevState => ({
                  ...prevState,
                  'successMessage' : 'Login successful. Redirecting to home page..'
              }));
              props.onSuccess()
              redirectToDashboard();
              
            }else{
              setState(prevState => ({
                ...prevState,
                'errorMessage' : 'Invalid email or password'
              }));
              throw data
            }
        })
        .catch(function (error) {
            console.log(error);
        });
  };

  const redirectToDashboard = () => {
    console.log("redirecting")
    history.push('/dashboard');

  }
  return (
    <div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon style={{ color: '#FFFFFF' }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate >
            <Fade in={!!state.errorMessage}>
                <Alert severity="warning">
                  {state.errorMessage}
                </Alert>
            </Fade>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              color="secondary"
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
              color="secondary"
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
              variant="outlined"
              color="inherit"
              className={classes.submit}
              onClick={handleSubmitClick}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" color="inherit">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2" color="inherit">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            
          </form>
        </div>
        
    </Container>
    <Copyright />
    </div>
  );
}