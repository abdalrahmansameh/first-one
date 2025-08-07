/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Image from "../database/models/image.model";
import User from "../database/models/user.model";
import { ConnectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId",
  });

//Add image to the database
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await ConnectToDatabase();

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

//  Update image in the database
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await ConnectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Unauthorized ir image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

//  Delete image in the database
export async function deleteImage(imageId: string) {
  try {
    await ConnectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// Get image from the database
export async function getImageById(imageId: string) {
  try {
    await ConnectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

//Get all images from the database
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await ConnectToDatabase();

    let query = {};

    if (searchQuery) {
      query = {
        title: {
          $regex: searchQuery,
          $options: "i",
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      images: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);

    return {
      images: [],
      totalPages: 1,
      savedImages: 0,
    };
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await ConnectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
