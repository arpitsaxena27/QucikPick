import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
      },
});

const fileFilter = (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
      const extname = allowedFileTypes.test(
            path.extname(file.originalname).toLowerCase()
      );
      const mimetype =
            allowedFileTypes.test(file.mimetype) ||
            file.mimetype === "application/pdf";

      if (extname && mimetype) {
            return cb(null, true);
      }
      cb(new Error("Only image files are allowed!"));
};

const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
            fileSize: 1024 * 1024 * 50, // 50MB max file size
      },
});

export default upload;
