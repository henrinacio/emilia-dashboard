const express = require('express')
const fs = require('fs')
const Papa = require('papaparse')

// ===== LOCALS =====
const CSV_PATH = './data'
const PORT = 3000
const IP = '127.0.0.1'

// ===== PARSE CSV DATA TO JSON =====
const bills = []
fs.readdir(CSV_PATH, (error, files) => {
  if (error) {
    console.log(error)
  }

  for (let i = 0, j = files.length; i < j; i++) {
    Papa.parse(fs.createReadStream(`./data/${files[i]}`), {
      header: true,
      skipEmptyLines: true,
      complete (results) {
        bills.push(...results.data)
      }
    })
  }
})

// ===== SETUP STATIC AND MIDDLEWARE =====
// app.use(express.static('./public'))

const app = express()

// ===== MIDDLEWARE =====
function logger (req, res, next) {
  const method = req.method
  const url = req.url
  const time = new Date().getFullYear()
  console.log(method, url, time)
  next()
}

// ===== APP ROUTES =====
app.get('/', logger, (req, res) => {
  res.send('<h1>Teste</h1><a href="/api/v1/bills">bills</a>')
})

// ===== API ENDPOINTS =====
app.get('/api/v1/bills', (req, res) => {
  const newBills = bills.map((bill, index) => {
    bill.id = ++index
    return bill
  })

  return res.status(200).json(newBills)
})

app.get('/api/v1/bills/:billID', (req, res) => {
  const { billID } = req.params

  const singleBill = bills.find((bill) => bill.id === Number(billID))

  if (!singleBill) {
    return res.status(404).send('<h1>bill does not exist</h1>')
  }

  return res.status(200).json(singleBill)
})

app.get('/api/v1/query', (req, res) => {
  const { search, limit } = req.query
  let sortedBills = [...bills]

  if (search) {
    sortedBills = sortedBills.filter((bill) => {
      return bill.title.toLowerCase().startsWith(search)
    })
  }

  if (limit) {
    sortedBills = sortedBills.slice(0, Number(limit))
  }

  if (sortedBills.length < 1) {
    return res.status(200).json({ success: true, data: [] })
  }

  return res.status(200).json(sortedBills)
})

app.all('*', (req, res) => {
  res.status(404).send('<h1>resource not found</h1>')
})

app.listen(PORT, IP, () => {
  console.log({
    date: new Date().toLocaleString(),
    type: 'APP_START',
    env: 'dev',
    what: `Server is running on http://${IP}:${PORT}`
  })
})

module.exports = app
