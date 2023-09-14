const express = require('express')
const { getCredentials } = require('../controllers/auth')
const router = express.Router()

router.post('/', getCredentials)

module.exports = router
