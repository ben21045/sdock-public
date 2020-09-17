
import React from 'react';
import { useCookies } from 'react-cookie';
import {useHistory} from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Title from './Title';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { stringify } from 'uuid';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles((theme)=>({
    depositContext: {
        flex: 1,
    },
    purchaseDialog:{
        width:300
    }
  }));


export default function Deposits(props) {
    const classes = useStyles();
    let price=parseFloat(props.purchaseInfo.price,10).toFixed(2);
    let symbol=props.purchaseInfo.symbol;
    let timestamp=props.purchaseInfo.timestamp;
    let date= new Date(timestamp);
    const [quantity , setQuantity] = React.useState(0);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [cookie,setCookie] = useCookies('isLoggedIn');
    const history = useHistory();

    const handleCloseDialog= ()=>{
        setOpenDialog(false)
    }
    const handleOpenDialog= ()=>{
        setOpenDialog(true)
    }
    const handleCloseAlert= ()=>{
        setSuccessMessage('');
    }
    const handleChange = (e) => {
        let targetValue = e.target.value;
        targetValue=targetValue.replace('-', ''); 
        setQuantity(targetValue);
        
    }


    let status;
    function checkStatus(jsonData) {
    
        if (status>=200 && status<300) { // res.status >= 200 && res.status < 300
          setSuccessMessage("Successfully added "+quantity+" shares of "+symbol+"!");
          setOpenDialog(false);
        } else {
            if(status==401){
                setCookie('isLoggedIn',false);
                history.push('/login')
            }  
          throw jsonData; 
          
        }
      }
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(`/api/user/symbol/${symbol}/quantity/${quantity}`);
        fetch(`/api/user/symbol/${symbol}/quantity/${quantity}`, {
            method: 'POST'
        })
        .then((res) => { 
            status = res.status;
          })
        .then(checkStatus)
        .catch(error=>{
            console.log(error);
        });
    
        
    
      };
    return (
        <React.Fragment>
        <Box className={classes.purchaseDialog}>
        <Dialog open={openDialog} onClose={handleCloseDialog}  >
            
            <DialogTitle id="form-dialog-title">Add {symbol} to portfolio</DialogTitle>
                <DialogContent>
                <form noValidate onSubmit={handleSubmit}>
                    <Box display="flex" alignContent="center" flexDirection="row" mb={2}>
                    
                        <TextField
                        autoFocus
                            color="secondary"
                            margin="dense"
                            id="quantity"
                            label="Quantity"
                            type="number"
                            variant="outlined"
                            InputProps={{ inputProps: { min: 0, max: 10 } }}
                        style = {{width: '70'}}
                        value = {quantity}
                        onChange = {handleChange}
                        />
                        <div style={{
    display: 'flex',
    alignItems: 'center'
}}>
                            <Button type="submit" disabled={!quantity||quantity==0}  variant="contained" color="primary" >confirm</Button>
                        </div>
                    
                    </Box>
                </form>
                </DialogContent>
                
        </Dialog>
        </Box>


        {/*<Title color="textPrimary">{symbol}</Title>*/}
        <Typography  variant="h4">
            ${price}
        </Typography>
        <Typography color="textSecondary" className={classes.depositContext}>
            {date.toUTCString()}
        </Typography>
        <div>
          <Button variant="contained" color="primary" onClick={handleOpenDialog} disabled={!symbol}>Add to porfolio</Button>
        </div>

        <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success">
                {successMessage}
            </Alert>
        </Snackbar>
        </React.Fragment>
    );
}