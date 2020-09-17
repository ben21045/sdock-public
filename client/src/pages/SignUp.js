import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import validator from 'validator';
import {validEmailRegex} from '../constants';


const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  
  const [state , setState] = useState({
    email : "",
    password : "",
    firstname : "",
    lastname : "",
    errors: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    }
  })
  
  const redirectToLogin = () => {
    history.push('/login'); 
  }
  
  const handleChange = (e) => {
      var {id , value} = e.target;
      const errors = state.errors;
      switch (id) {
        case 'firstname': 
          value=value.trim(); 
          errors.firstname = 
            value.length < 1
              ? 'First Name must be 1 character long!'
              : '';
          break;
        case 'lastname':
          value=value.trim(); 
          errors.lastname = 
            value.length < 1
              ? 'Last Name must be 1 character1 long!'
              : '';
          break;
        case 'email': 
          value=value.trim(); 
          errors.email = 
            validEmailRegex.test(value)
              ? ''
              : 'Invalid Email Address!';
          break;
        case 'password': 
          errors.password = 
            value.length < 4
              ? 'Password must be 4 characters long!'
              : '';
          break;
        default:
          break;
      }
      setState(prevState => ({
        ...prevState,[id]: value, errors}));
      

  }
  const validateForm = (errors) => {
    let valid = true;
    Object.values(state).forEach(
      // if we have an error string set valid to false
      (val, id) => val==="" && (valid = false)
    );
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  function checkStatus(jsonData) {
    
    if (status>=200 && status<300) { // res.status >= 200 && res.status < 300
      redirectToLogin();
    } else {
      throw jsonData; 
    }
  }

  let status;
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(validateForm(state.errors)) {

      fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      })
      .then((res) => { 
        status = res.status;
        return res.json();
      })
      .then(checkStatus)
      .catch(error=>{
        console.log(error);
      });
    }
    

  };
  
  return (
    
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstname"
                variant="outlined"
                required
                fullWidth
                color= "secondary"
                id="firstname"
                label="First Name"
                autoFocus
                value={state.firstname}
                error={!!state.errors.firstname}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                color= "secondary"
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="lname"
                value={state.lastname}
                error={!!state.errors.lastname}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                color= "secondary"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={state.email}
                onChange={handleChange}
                error={!!state.errors.email}
                helperText={state.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                color= "secondary"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={state.password}
                onChange={handleChange}
                error={!!state.errors.password}
                helperText={state.errors.password !='' ? 'Password needs to be at least 4 characters!' : ''}
              />
            </Grid>
            
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="inherit"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2" color="inherit">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      
    </Container>
  );
}