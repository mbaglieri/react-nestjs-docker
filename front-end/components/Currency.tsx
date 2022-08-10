import { Text, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import { useButton, useInput } from '../hooks/ui'
import React from 'react'
import Select from 'react-select'
import axios from 'axios';
import configuration from '../config/configuration';
// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function Currency() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, token, profile, isEditCurrency } = globalState
  const [currencyText, setCurrencyText] = useState("")
  const [currencyOutput, setCurrencyOutput] = useState("")
  const [currencyEtherOutput, setCurrencyEtherOutput] = useState("")
  const [currencySelected, setCurrencySelected] = useState("")
  const [currencyButtonLoading, currencyButton] = useButton(setNewCurrencyValue, 'save')
  const [currency1ButtonLoading, currency1Button] = useButton(cancelNewValue, 'cancel')
  const [ethersInput, setEthersInput] = useInput(currencyButtonLoading as boolean)
  const [amountInput, setAmountInput] = useInput(currency1ButtonLoading as boolean)
  const [amount, setAmount] = useState("")
  const [ether, setEther] = useState("")
  const [editButtonLoading, editButton] = useButton(editNewValue, 'edit')
  let comp : any;
  
  function login() {
    const data = { "number" : account }
    axios
    .post(configuration().api_url + configuration().api_login, data)
    .then((response) => {
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
        setCurrencyText("This account its old")
      } 
      let currenciesCombo = [],currency:any;
      for (let index = 0; index < response.data.currencies.length; index++) {
        const curr = response.data.currencies[index];
        let currencyCombo = {
          value: response.data.currencies[index]._id,
          label: response.data.currencies[index].key
        }
        if(index == 0){
          currency =  response.data.currencies[index]
          setCurrencyOutput(response.data.currencies[index].price +  " " +  response.data.currencies[index].key)
          setCurrencyEtherOutput(response.data.currencies[index].ethers)
          setCurrencySelected(response.data.currencies[index]._id);
        }
        currenciesCombo.push(currencyCombo)
      }
      let data             = response.data
      data.currency        = currency
      data.currenciesCombo = currenciesCombo

      dispatch({ type: 'SET_PROFILE', payload: data })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  async function cancelNewValue() {
    dispatch({ type: 'SET_EDIT_CURRENCY', payload: false })
  }
  async function setNewCurrencyValue() {
    console.log(ether)
    if(Number(ether)<=0){
      alert("the min val is 0")
      return;
    }
    let url = configuration().api_url + configuration().api_currency + profile.currency._id
    console.log(url)
    axios
    .put(url,{ethers: ether}, { headers: {"Authorization" : `Bearer ${token}`} })
    .then((response) => {
      profile.currency.ethers = ether
      setCurrencyEtherOutput(ether)
      dispatch({ type: 'SET_EDIT_CURRENCY', payload: false })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  async function editNewValue() {
    setAmount(profile.currency.price +  " " + profile.currency.key ) 
    setEther(profile.currency.ethers)
    dispatch({ type: 'SET_EDIT_CURRENCY', payload: true })
  }
  const handleChange = (selectedOption: any) => {

    let currency:any;
    for (let index = 0; index < profile.currencies.length; index++) {
      let comboValue = profile.currencies[index]._id
      if(comboValue == selectedOption.value){
        profile.currency = profile.currencies[index]
        setCurrencyOutput(profile.currencies[index].price +  " " +  profile.currencies[index].key)
        setCurrencyEtherOutput(profile.currencies[index].ethers)
        setCurrencySelected(comboValue);
        dispatch({ type: 'SET_PROFILE', payload: profile })
      }
    }
  };
  useEffect(() => {
    if(account && !token){
      login()
    }
  })
  return (
    <div>
      
      { 
        account && profile && isEditCurrency && (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem colSpan={2} alignItems="center"><Text>{currencyText}</Text></GridItem>
          <GridItem colSpan={2} alignItems="center"><Text textAlign="center" fontWeight="bold" >Edit Currency</Text></GridItem>

          <GridItem><input type="number" placeholder="Ethers" onChange={e => setEther(e.target.value)} value={ether} min="0"/></GridItem>
          <GridItem >{amount}</GridItem>
          <GridItem alignItems="end">{currencyButton}</GridItem>
          <GridItem alignItems="end">{currency1Button}</GridItem>
        </Grid>
        ) ||
        account && profile && !isEditCurrency && (

        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
          <GridItem colSpan={2} alignItems="end"><Text>{currencyText}</Text></GridItem>
          <GridItem colSpan={2} alignItems="end"><Text textAlign="center" fontWeight="bold" >List Currency</Text></GridItem>

          <GridItem>{currencyEtherOutput}</GridItem>
          <GridItem >{currencyOutput}</GridItem>
          <GridItem >{editButton}</GridItem>
          <GridItem ><Select options={profile.currenciesCombo} onChange={handleChange} value={currencySelected}/></GridItem>
        </Grid>
        ) 

      }
    </div>
  )
}