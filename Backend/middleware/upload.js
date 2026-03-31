import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({ 
  dest: "temp/",
  limits: { 
    fileSize: 10 * 1024 * 1024
  } 
});

export default upload;