
import React, {Fragment} from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {useHistory} from 'react-router-dom';

export default (props)=>{
    //const [quantity , setQuantity] = React.useState(0);
    const [cookie,setCookie] = useCookies('isLoggedIn');
    const [stocks , setStocks] = React.useState(props.stocks);
    const history = useHistory();
    const handleChange = (e) => {
        let targetValue = e.target.value;
        
        targetValue=targetValue.replace('-', ''); 
        
        targetValue=parseInt(targetValue);
        const targetName = e.target.name;
        
        setStocks((prevState) => ({
            ...prevState,
            [targetName]:{...prevState[targetName],quantity:targetValue}
            })
            );
        }
        
    const handleDelete = (e) => {
        console.log(e.currentTarget)
        const targetName = e.currentTarget.name;
        
        setStocks((prevState) => ({
            ...prevState,
            [targetName]:{...prevState[targetName],quantity:-1}
            })
            )
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        fetch(`/api/user/portfolio`, {
            method: 'POST',
            body:    JSON.stringify(stocks),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => { 
            if (res.status>=200 && res.status<300) {
                console.log('update success')
                history.go(0);
            }else {
                if(res.status==401){
                    setCookie('isLoggedIn',false);
                    history.push('/login');
                }  
              throw res; 
              
            }
        }
        )
        .catch(error=>{
            console.log(error);
        });
    
    };
    return (
    <Box m={2}>
    
    {Object.keys(stocks).map((symbol) =>
        
      <Fragment key={symbol}>
        {!(stocks[symbol].quantity<0)?
        <Fragment>
      <Box ml={1} mr={1}>
      <Grid container direction="row" alignContent='center'>
        <Grid item xs={4}>
          <ListItemText primary={symbol} />
        </Grid>
        <Grid item xs={5} style={{textAlign: "right"}}>
          <TextField
                        autoFocus
                        color="secondary"
                        margin="dense"
                        id="quantity"
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        InputProps={{ inputProps: { min: 0, max: 10000 } }}
                        style = {{width: '70'}}
                        value = {isNaN(stocks[symbol].quantity)?'':parseInt(stocks[symbol].quantity)}
                        name = {symbol}
                        onChange = {handleChange}
                          />
        </Grid>
        <Grid item xs={3} style={{textAlign: "right"}}>
            <IconButton aria-label="delete" name={symbol} onClick={handleDelete}>
                <CloseIcon />
            </IconButton>
        </Grid>
      </Grid>
      </Box>
      <Divider/>
      </Fragment>
      :null}
    </Fragment>
    
    )}
    <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>Update</Button>
    
    </Box>
    );
  }