const express =require('express');
const { home } = require('../authcontroller/authcontroller');
const { uploadfile } = require('../authcontroller/uploadfile');
const { uploadfileUsingMulter } = require('../middleware/multer');

const router=express.Router();

router.route("/").get(home);
router.route("/upload").post(uploadfileUsingMulter().single('file'),uploadfile);

module.exports={router};