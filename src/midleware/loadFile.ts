const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E7) + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const allowTypes= ['image/png','image/jpg','image/gif','text/plain',];

const fileFilter = (req, file, cb) => {
    if (allowTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        console.log('mimetype-',file.mimetype);
        cb(null, false)
    }
}

export const upload = multer({storage: storage, fileFilter: fileFilter})