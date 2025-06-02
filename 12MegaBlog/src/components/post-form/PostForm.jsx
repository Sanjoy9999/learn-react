import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    setError("");
    try {
      if (post) {
        // update flow
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;
        if (file && post.freaturedImage) {
          await appwriteService.deleteFile(post.freaturedImage);
        }
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          freaturedImage: file ? file.$id : undefined,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        // NEW post flow
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;
        if (file) {
          data.featuredImage = file.$id;
        }

        // Ensure userData exists before accessing $id
        if (!userData || !userData.$id) {
          setError("User data not available. Please log in again.");
          return;
        }

        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id, // This will be converted to "userid" in appwriteService
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "Failed to save post. Please try again.");
    }
  };

  const slugTransform = useCallback((value) => {
    if (!value) return "";

    // Fix: Correctly transform the title into a slug
    return value
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  // Update the onInput handler for the slug field
  const handleSlugInput = (e) => {
    const inputValue = e.currentTarget.value;
    // Remove any special chars from the beginning
    const sanitizedValue = inputValue.replace(/^[^a-zA-Z0-9]+/, "");
    if (inputValue !== sanitizedValue) {
      // Only update if there was a change to avoid cursor jumping
      setValue("slug", sanitizedValue, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/,
              message: "Slug can't start with special characters",
            },
          })}
          onInput={handleSlugInput}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4 border-amber-300"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.freaturedImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
      {error && (
        <div className="w-full text-center text-red-500 mb-4">{error}</div>
      )}
    </form>
  );
}

export default PostForm;
