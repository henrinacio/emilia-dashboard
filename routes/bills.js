const express = require('express')
const { getBills, getBillByID, queryBillByTitle } = require('../controllers/bills')
const router = express.Router()

router.get('/', getBills)
router.get('/:billID', getBillByID)
router.get('/query', queryBillByTitle)

module.exports = router
