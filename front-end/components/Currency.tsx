import { Text, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import { AbiItem } from 'web3-utils'
import { useButton, useInput } from '../hooks/ui'
import axios from 'axios';
import configuration from '../config/configuration';
// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function Currency() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3, token, profile } = globalState
  const [currencyText, setcurrencyText] = useState("")
  const [currencyOutput, setcurrencyOutput] = useState("")
  const [currencyButtonLoading, currencyButton] = useButton(setNewCurrencyValue, 'save')
  const [greeting, currencyInput] = useInput(currencyButtonLoading as boolean)
  const [currency1ButtonLoading, currency1Button] = useButton(cancelNewValue, 'cancel')
  const [greet, currency1Input] = useInput(currency1ButtonLoading as boolean)
  const [editButtonLoading, editButton] = useButton(editNewValue, 'edit')
  const [edit, editInput] = useInput(editButtonLoading as boolean)
  const contractAddress = process.env.REACT_APP_API_URL
  const isEditAction = false
  let comp : any;
  
  function login() {
    const data = { "number" : account }
    axios
    .post(configuration().api_url + configuration().api_login, data)
    .then((response) => {
        // localStorage.setItem('token', response.data.token);
        // localStorage.setItem('auth', 'true');
        console.log(contractAddress)
        console.log(contractAddress)
        console.log(contractAddress)
        dispatch({ type: 'SET_TOKEN', payload: response.data.token })
        loadProfile(response.data.token)
    })
    .catch((error) => {
        console.log(error);
    });
  }

  async function loadProfile(token:string) {
    axios
    .get(configuration().api_url + configuration().api_profile, { headers: {"Authorization" : `Bearer ${token}`} })
    .then((response) => {
      console.log(response.data)
      if (response.data && response.data.isOld) {
        console.log(response.data.isOld)
        setcurrencyText("This account its old")
      } 
      dispatch({ type: 'SET_PROFILE', payload: response.data })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  async function cancelNewValue() {
    console.log('cancelNewValue')
  }
  async function setNewCurrencyValue() {
    console.log('setNewCurrencyValue')
  }
  async function editNewValue() {
    console.log('editNewValue')
  }
  
  useEffect(() => {
    if(account && !token){
      login()
    }
  })
  return (
    <div>
      
      { 
        account && profile && isEditAction && (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem><Text textAlign="right" fontWeight="bold">Edit Currency</Text></GridItem>
          <GridItem><Text>{currencyText}</Text></GridItem>
          <GridItem alignItems="end">{currencyButton}</GridItem>
          <GridItem>{currencyInput}</GridItem>
          <GridItem alignItems="end">{currency1Button}</GridItem>
          <GridItem>{currency1Input}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{currencyOutput}</Text>
          </GridItem>
        </Grid>
        ) ||
        account && profile && !isEditAction && (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem colSpan={2} alignItems="end"><Text>{currencyText}</Text></GridItem>
          <GridItem colSpan={2} alignItems="end"><Text textAlign="right" fontWeight="bold" >List Currency</Text></GridItem>

          <GridItem alignItems="end" >{editButton}</GridItem>
          <GridItem>{editInput}</GridItem>

          <GridItem alignItems="end" colSpan={2}></GridItem>
          <GridItem colSpan={2}>{currency1Input}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{currencyOutput}</Text>
          </GridItem>
        </Grid>
        ) 

      }
    </div>
  )
}