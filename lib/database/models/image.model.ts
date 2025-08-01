import { Document, model, models, Schema } from "mongoose";

export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  config?: object;
  transformationUrl?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  CreateAt?: Date;
  updateAt?: Date;
}

const ImageSchema = new Schema({
    title: { type: String, required: true},
    transformationType: {type: String, required: true},
    publicId: {type: String, required: true},
    secureUrl: {type: URL, required: true},
    width: {type: Number},
    height: {type: Number},
    transformationUrl: {type: URL},
    aspectRatio: {type: String},
    color: {type: String},
    prompt: {type: String},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    CreateAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
})

const Image = models?.Image || model('Image', ImageSchema);

export default Image; 
