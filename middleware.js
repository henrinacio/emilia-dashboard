// ===== MIDDLEWARE =====
function logger (req, res, next) {
  const method = req.method
  const url = req.url
  const time = new Date().getFullYear()
  console.log(method, url, time)
  next()
}

function authorize (req, res, next) {
  console.log('authorize')
  next()
}

module.exports = { logger, authorize }
