import path from "node:path";
import express from "express";
import { createBook, deleteBook, getSingleBook, listBooks, updateBook } from "./bookController";
import multer from "multer";
import authenticate from "../config/authenticated";

const bookRouter = express.Router();
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/create",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
bookRouter.get("/",listBooks);
bookRouter.get("/:bookId",getSingleBook)
bookRouter.delete("/:bookId",authenticate,deleteBook)

export default bookRouter;
