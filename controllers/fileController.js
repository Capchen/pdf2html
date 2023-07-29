const fs = require('fs')
const path = require('path')
const config = require('../config')
const { exec } = require('child_process');

function transferPdfToHtml(pdfFileName, res) {
  // 转换上传的 PDF 文件为 HTML
  const htmlFileName = pdfFileName.replace('.pdf', '.html');
  // 判断是否存在上传目录，不存在则创建
  if(!fs.existsSync(config.downloadDir)) {
    fs.mkdirSync(config.downloadDir)
  }
  // 使用 child_process 执行转换脚本
  const transferScript = 
  `pdf2htmlEX --zoom 1.3 %/uploads/${pdfFileName}`;
  const convertScript = 
  `pwd | xargs -I % sh -c 'cd % && cd html && ${transferScript}'`;
  console.log('convertScript', convertScript)
  exec(convertScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行脚本出错：${error.message}`);
      return res.status(500).send('转换文件失败');
    }
    if (stderr) {
      console.error(`stderr：${stderr}`);
    }
    // 打印命令输出
    console.log('命令输出：', stdout);
    res.redirect(`/success?fileName=${htmlFileName}`)
  });
}


const upload = (req, res) => {

  let fileObj = null;
  let filePath = '';

  if(!req.files || Object.keys(req.files).length === 0) {
   res.status(400).send({
     code: 1,
     msg: '没有上传文件'
   })
   return;
  }

  /* file 是上传时候body中的一个字段，有可以随意更改*/
  // 生成当前时间戳，保证文件名惟一
  const timestamp = new Date().getTime();
  fileObj = req.files.fileUpload;
  const name = `${timestamp}_${fileObj.name}`

  // 判断是否存在上传目录，不存在则创建
  if(!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir)
  }

  filePath = `${config.uploadDir}/${name}`
  fileObj.mv(filePath, (err) => {
   if(err) {
     return res.status(500).send({
       code: 1,
       msg: '文件上传失败'
     })
   }
   transferPdfToHtml(name, res)
  })
}


const download = (req, res) => {
  const fileName = req.query.fileName
  const file = {
    name: fileName,
    path: `./html/${fileName}`
  }
  let exist = fs.existsSync(path.resolve(file.path))
  if(exist) {
    res.download(file.path)
  } else {
    res.send({
      code: 1,
      msg: '下载文件不存在'
    })
  }
}

module.exports = {
 upload,
 download
}
