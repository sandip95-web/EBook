import path from "node:path";
import fs from "node:fs";
import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../config/authenticated";
import cloudinary from "../config/cloudinary";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  if (!files.coverImage || files.coverImage.length === 0) {
    return next(createHttpError(400,"CoverImage is required"));
  }
  if (!files.file || files.file.length === 0) {
    return next(createHttpError(400,"File is required"));
  }
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads/",
    fileName
  );

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads/",
    bookFileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "Book-Covers",
      format: coverImageMimeType,
    });
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        format: "pdf",
        folder: "Books-pdf",
        filename_override: bookFileName,
      }
    );
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      return next(createHttpError(500, "Error while Removing file"));
    }

    res.status(201).json({
      book_id: newBook._id,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while uploading file"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    // Fetch the book
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (_req.userId !== book.author.toString()) {
      return next(
        createHttpError(
          403,
          "You are not authorized to change other books' details."
        )
      );
    }

    // Initialize variables
    let newCoverImage = book.coverImage;
    let newFile = book.file;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Process cover image
    if (files?.coverImage) {
      const coverFile = files.coverImage[0];
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + coverFile.filename
      );

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        format: coverFile.mimetype.split("/").at(-1),
        folder: "Book-Covers",
      });
      newCoverImage = uploadResult.secure_url;

      // Remove local file
      await fs.promises.unlink(filePath);
    }

    // Process PDF file
    if (files?.file) {
      const bookFile = files.file[0];
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + bookFile.filename
      );

      const fileUploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw",
        format: "pdf",
        folder: "Books-pdf",
      });
      newFile = fileUploadResult.secure_url;

      // Remove local file
      await fs.promises.unlink(filePath);
    }

    // Update the book
    const updatedBook = await bookModel.findByIdAndUpdate(
      bookId,
      {
        title,
        genre,
        coverImage: newCoverImage,
        file: newFile,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    next(createHttpError(500, "An error occurred while updating the book"));
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    res.status(200).json({
      data: books,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found."));
    }
    res.status(200).json({
      data: book,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found."));
  }
  const _req = req as AuthRequest;
  if (_req.userId !== book.author.toString()) {
    return next(
      createHttpError(
        403,
        "You are not authorized to change other books' details."
      )
    );
  }
  const coverImageUrlSplit = book.coverImage.split("/");
  const coverPublicId =
    coverImageUrlSplit.at(-2) + "/" + coverImageUrlSplit.at(-1)?.split(".").at(-2);
    
  const fileUrlSplit = book.file.split("/");
  const filePublicId = fileUrlSplit.at(-2) + "/" + fileUrlSplit.at(-1);
 console.log(coverPublicId,filePublicId)
  try {
    await cloudinary.uploader.destroy(coverPublicId);
    await cloudinary.uploader.destroy(filePublicId, {
      resource_type: "raw",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while deleting the data."));
  }
  await bookModel.deleteOne({ _id: bookId });
  res.sendStatus(204);
};
export { createBook, updateBook, listBooks, getSingleBook,deleteBook };
