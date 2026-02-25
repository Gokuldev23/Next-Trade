"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "../db/postgres";
import type { UserType } from "../types/user.type";

// --- Schema Validation ---
const uploadDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profile_image_file: z
    .union([
      z.instanceof(File).refine((f) => f.type.startsWith("image/"), {
        message: "Must be an image",
      }),
      z.null(),
    ])
    .optional(),
});

// --- Upload image to Vercel ---
const uploadImageToVercel = async (imageFile: File) => {
  try {
    const { url } = await put(`nxt-trade-profile-${Date.now()}`, imageFile, {
      access: "public",
    });
    return {
      success: true,
      message: "Uploaded successfully",
      image_url: url,
    };
  } catch (error) {
    console.error("Blob upload error:", error);
    return {
      success: false,
      message: "Image upload failed",
      image_url: null,
    };
  }
};

// --- Update User in PG ---
const editUserData = async (
  userId: string,
  name: string,
  image_url: string | null,
) => {
  try {
    const result = await db.query<UserType>(
      `UPDATE users
        SET
        name = $1,
        profile_image_url = CASE WHEN $2::text IS NOT NULL THEN $2::text ELSE profile_image_url END,
        updated_at = NOW()
        WHERE id = $3
        RETURNING id, name, email, profile_image_url, created_at, updated_at, is_active;
      `,
      [name, image_url, userId],
    );

    return result.rows[0];
  } catch (err) {
    console.log("Unable to update 505 error", err);
  }
};

// --- Main Action ---
export const editProfileAction = async (prev: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const profile_image_file = formData.get("profile_image_file") as File;
  const userId = formData.get("userId") as string;

  const normalizedFile =
    profile_image_file && profile_image_file.size > 0
      ? profile_image_file
      : null;

  const data = { name, profile_image_file: normalizedFile };
  console.log("data", data);

  try {
    // ✅ Validate inputs
    const result = uploadDataSchema.safeParse(data);
    if (!result.success) {
      return {
        ...prev,
        success: false,
        message: "Validation Error",
        errors: z.flattenError(result.error).fieldErrors,
        inputs: data,
      };
    }

    // ✅ Upload image
    let imageUrl = null;
    if (normalizedFile) {
      const uploadRes = await uploadImageToVercel(normalizedFile);
      if (!uploadRes.success) {
        return {
          ...prev,
          success: false,
          message: "Image upload failed",
        };
      }
      imageUrl = uploadRes.image_url;
    }

    // ✅ Update user in DB
    console.log({ userId, name, imageUrl });
    const updatedUser = await editUserData(userId, name, imageUrl);

    revalidatePath("/dashboard/profile");
    return {
      ...prev,
      success: true,
      message: "Profile updated successfully ✅",
      user: updatedUser,
    };
  } catch (error) {
    console.error("editProfileAction error:", error);
    return {
      ...prev,
      success: false,
      message: "Something went wrong while updating profile",
    };
  }
};
