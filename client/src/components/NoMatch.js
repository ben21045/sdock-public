import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect
} from "react-router-dom";
import React from 'react';
import {
  Alert,
  AlertTitle
} from '@material-ui/lab';
import {
  Box,
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
export default ()=> {
    let location = useLocation();
    const [open, setOpen] = React.useState(true);
    return (
      <Box zIndex="snackbar" position="fixed" top={0} left={0} width="100%">
      <Collapse in={open}>
      <Alert variant="filled" severity="error" onClose={() => {setOpen(false)}}>
        404 - No match for <strong><code>{location.pathname}</code></strong>
      </Alert>
      </Collapse>
      </Box>
          
    );
  }