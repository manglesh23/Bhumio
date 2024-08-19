const express =require('express');
const { home } = require('../authcontroller/authcontroller');
const { uploadfile } = require('../authcontroller/uploadfile');
const { uploadfileUsingMulter } = require('../middleware/multer');
const { getfile } = require('../authcontroller/getFile');

const router=express.Router();

router.route("/").get(home);
router.route("/upload").post(uploadfileUsingMulter().single('file'),uploadfile);
router.route("/pdf/:filename").get(getfile);

module.exports={router};