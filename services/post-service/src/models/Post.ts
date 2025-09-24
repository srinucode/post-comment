import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  text: string;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPost>("Post", PostSchema);


