function getCredentials (req, res) {
  const { name } = req.body

  if (name) {
    return res.status(200).redirect('/home')
  }

  res.status(401).send('<h1>please provide credentials</h1>')
}

module.exports = { getCredentials }
