import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { auth } from '../../firebase';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface AuthDataTypes {
  email: string;
  password: string;
}

const UserAuth: React.FC = (props: any) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm<AuthDataTypes>();
  const [isSignin, setIsSignin] = useState(true);

  const handleSignin = async (data: AuthDataTypes) => {
    const { email, password } = data;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      props.history.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUp = async (data: AuthDataTypes) => {
    const { email, password } = data;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      props.history.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      user && props.history.push('/');
    });
    unSub();
  }, [props.history]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignin ? 'Sign in' : 'Sign up'}
        </Typography>
        <form
          onSubmit={
            isSignin ? handleSubmit(handleSignin) : handleSubmit(handleSignUp)
          }
          className={classes.form}
          noValidate
        >
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
            error={Boolean(errors.email)}
            helperText={errors.email && errors.email.message}
            inputRef={register({
              required: {
                value: true,
                message: 'メールアドレスを入力してください',
              },
              pattern: {
                value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
                message: 'メールアドレスを正しい形式で入力してください',
              },
            })}
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
            error={Boolean(errors.password)}
            helperText={errors.password && errors.password.message}
            inputRef={register({
              required: {
                value: true,
                message: 'パスワードを入力してください',
              },
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上で入力してください',
              },
            })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignin ? 'Sign In' : 'Sign Up'}
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setIsSignin(!isSignin)}
              >
                {isSignin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign in'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default UserAuth;
