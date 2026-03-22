import multer from "multer";


// -----------------------------------------
// 1) Store file in memory (RAM), NOT on disk
// -----------------------------------------
const storage = multer.memoryStorage();

// -----------------------------------------
// 2) Set upload limits
// fileSize → max file size allowed (2MB)
// -----------------------------------------
const limits = {
    fileSize: 2 * 1024 * 1024 // 2MB in bytes
};

// -----------------------------------------
// 3) File filter
// Controls WHICH file types are allowed
// file.mimetype → returns "image/png", "image/jpeg", etc
// cb(error, accept?)
//    error → if file not allowed
//    accept → true = accept, false = reject
// -----------------------------------------
const fileFilter = (req, file, cb) => {

    // Allowed MIME types
    const allowed = ["image/jpeg", "image/png", "image/gif"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);   // ACCEPT the file
    } else {
        cb(new Error("Only JPG, PNG, and GIF images are allowed"), false); 
    }
};

// -----------------------------------------
// 4) Create Multer upload instance
// Options:
//   storage → where file is stored (memoryStorage in RAM)
//   limits → max file size
//   fileFilter → validate file type
// -----------------------------------------
const upload = multer({
    storage,     // Keep file in memory (req.file.buffer)
    limits,      // File size limit
    fileFilter,  // Allowed file types
});

// -----------------------------------------
// 5) Export single-file upload middleware
// "image" → field name in <input name="image">
const uploadMulter = upload.single("image")
// -----------------------------------------
export default  uploadMulter;
