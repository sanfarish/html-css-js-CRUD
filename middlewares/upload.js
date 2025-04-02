const multer = require('multer')
const path = require('path')
const fs = require('fs')

module.exports = (req, res, next) => {
  if (req.method === 'POST') {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public'))
      },
      filename: (req, file, cb) => {
        cb(null, 'img' + '-' + req.body.id + path.extname(file.originalname))
      }
    })
    
    const upload = multer({ storage: storage }).single('picture')
    
    upload(req, res, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      req.body.picture = req.file.filename
      return next()
    })
  } else if (req.method === 'DELETE') {
    const id = req.originalUrl.split('/')[2]

    const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'))
    if (!db) {
      return res.status(500).json({ error: 'Database not found' })
    }
    
    const item = db.employees.find(item => item.id === id)
    if (!item) {
      return next()
    }

    const filePath = path.join(__dirname, '../public', item.picture)
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      return next()
    })
  } else if (req.method === 'PUT') {
    return next()
  } else {
    return next()
  }
}