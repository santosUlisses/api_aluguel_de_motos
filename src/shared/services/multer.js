const multer = require('multer');
const path = require('path');
const fs = require("fs");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "temp/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
})



const uploadPath = path.resolve("temp");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}


function fileFilter(req, file, cb) {
    const arqPermitido = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (arqPermitido.includes(file.mimetype)) {
        cb(null, uploadPath);
    } else {
        cb(new Error("Tipo de arquivo inválido"), false);
    }
}

const limits = {
    fileSize: 2 * 2048 * 1024
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;