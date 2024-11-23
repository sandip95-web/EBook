import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: [true, "Book Title is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Book Author is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Book Cover image is required"],
    },
    file: {
      type: String,
      required: [true, "File is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Book>("Book", bookSchema);
