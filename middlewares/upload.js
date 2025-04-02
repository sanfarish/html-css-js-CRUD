const multer = require('multer')
const path = require('path')
const fs = require('fs')

module.exports = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public'))
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
      }
    })
    
    const upload = multer({ storage: storage }).single('file')
    
    upload(req, res, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      req.body.picture = req.file.filename
      next()
    })
  } else if (req.method === 'DELETE') {
    const id = req.originalUrl.split('/')[2]
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'))
    if (!db) {
      return res.status(500).json({ error: 'Database not found' })
    }
    const item = db.employees.find(item => item.id === id)
    // if (!item) {
    //   return res.status(404).json({ error: 'Item not found' })
    // }
    if (item.picture) {
      const filePath = path.join(__dirname, '../public', item.picture)
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
}