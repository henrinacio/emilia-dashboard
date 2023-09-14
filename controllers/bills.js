const fs = require('fs')
const Papa = require('papaparse')

// ===== LOCALS =====
const CSV_PATH = './data'

const bills = []
fs.readdir(CSV_PATH, (error, files) => {
  if (error) {
    console.log(error)
  }

  for (let i = 0, j = files.length; i < j; i++) {
    Papa.parse(fs.createReadStream(`${CSV_PATH}/${files[i]}`), {
      header: true,
      skipEmptyLines: true,
      complete (results) {
        bills.push(...results.data)
      }
    })
  }
})

function getBills (req, res) {
  const newBills = bills.map((bill, index) => {
    bill.id = ++index
    return bill
  })

  return res.status(200).json({ success: true, data: newBills })
}

function getBillByID (req, res) {
  const { billID } = req.params

  const singleBill = bills.find((bill) => bill.id === Number(billID))

  if (!singleBill) {
    return res.status(404).send('<h1>bill does not exist</h1>')
  }

  return res.status(200).json({ success: true, data: singleBill })
}

function queryBillByTitle (req, res) {
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

  return res.status(200).json({ success: true, data: sortedBills })
}

module.exports = {
  getBills,
  getBillByID,
  queryBillByTitle
}
