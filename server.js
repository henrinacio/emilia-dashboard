const express = require('express')
const { logger, authorize } = require('./middleware')
const auth = require('./routes/auth')
const bills = require('./routes/bills')

// ===== LOCALS =====
const PORT = 3000
const IP = '127.0.0.1'

const app = express()

// ===== SETUP STATIC
app.use(express.static('./public'))

// ===== PARSE FORM DATA
app.use(express.urlencoded({ extended: false }))

// ===== PARSE JSON
app.use(express.json())

// ===== MIDDLEWARE =====
app.use([logger, authorize])

// ===== APP ROUTES =====
app.use('/login', auth)

app.get('/home', (req, res) => {
  res.send('<h1>home</h1><a href="/api/v1/bills">bills</a>')
})

// ===== API ENDPOINTS =====
app.use('/api/v1/bills', bills)

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
