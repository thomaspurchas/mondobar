'use babel'
import app from 'app'
// import Menu from 'menu'
import Tray from 'tray'
import Client from '../mondo-node/index.js'

let mondo = null
let today = true

const { CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD } = process.env

const c = new Client({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  url: 'production-api.gmon.io'
})

const showSpendToday = () => {
  const formatNumber = n => n * -1 / 100

  mondo.setTitle(' £' + formatNumber(c.balance.spend_today).toString() + ' ')
}

const showBalanceTotal = () => {
  const formatNumber = n => n / 100

  mondo.setTitle(' £' + formatNumber(c.balance.balance).toString() + ' ')
}

const setBalance = () => {
  c.accounts()
    .then((x) => {
      return c.balance()
    })
    .then((b) => {
      showSpendToday()
    })
}

const toggleTitle = () => {
  if (today) {
    today = false
    showBalanceTotal()
  } else {
    today = true
    showSpendToday()
  }
}

app.on('ready', () => {
  c.authenticate(USERNAME, PASSWORD).then(() => {
    mondo = new Tray('./logo_horz_darkbg.png')
    setBalance()
    mondo.on('click', () => toggleTitle())
  })
})
