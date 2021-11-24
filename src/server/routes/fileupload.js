const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');  // 파일이 저장되는 경로입니다.
  },
  filename: function(req, file, cb) {
    cb(null, moment().format('YYYYMMDDHHmmss') + "_" + file.originalname);  // 저장되는 파일명
  }
});

const upload = multer({ storage: storage }).single("file");   // single : 하나의 파일업로드 할때

module.exports = upload;