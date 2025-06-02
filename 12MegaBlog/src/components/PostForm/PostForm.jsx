import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import appwriteService from '../../services/appwriteService';

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    });
    
    const userData = useSelector(state => state.auth.userData);
    
    // Generate a proper slug from the title
    const generateSlug = (title) => {
        if (!title) return '';
        // Convert to lowercase, remove special chars, replace spaces with hyphens
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };
    
    // Watch the title field to auto-generate slug
    const titleValue = watch('title');
    useEffect(() => {
        if (!post && titleValue) {
            setValue('slug', generateSlug(titleValue));
        }
    }, [titleValue, post, setValue]);
    
    const submit = async (data) => {
        try {
            if (post) {
                // ...existing code...
            } else {
                // Ensure userData exists before accessing $id
                if (!userData || !userData.$id) {
                    console.error("User data not available. Please log in again.");
                    return;
                }
                
                const file = await appwriteService.uploadFile(data.image[0]);
                
                if (file) {
                    const fileId = file.$id;
                    
                    // Make sure we're using our sanitized slug
                    const sanitizedSlug = generateSlug(data.slug || data.title);
                    
                    const newPost = await appwriteService.createPost({
                        ...data,
                        slug: sanitizedSlug, // Send sanitized slug
                        featuredImage: fileId,
                        userId: userData.$id // This needs to be lowercase "userid" in appwriteService
                    });
                    
                    // ...existing code...
                }
            }
        } catch (error) {
            console.log("Form submission error:", error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium">Title</label>
                <input 
                    type="text" 
                    id="title"
                    placeholder="Title" 
                    className="w-full px-3 py-2 border rounded-lg"
                    {...register("title", { required: true })}
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="slug" className="block mb-2 text-sm font-medium">Slug</label>
                <input 
                    type="text" 
                    id="slug"
                    placeholder="Slug" 
                    className="w-full px-3 py-2 border rounded-lg"
                    {...register("slug", { 
                        required: true,
                        pattern: {
                            value: /^[a-zA-Z0-9][a-zA-Z0-9-_.]*$/,
                            message: "Slug can't start with special characters and can only contain letters, numbers, hyphens, underscores and periods."
                        }
                    })}
                />
                <p className="mt-1 text-sm text-gray-500">
                    URL-friendly version of the title. Must not start with special characters.
                </p>
            </div>
            
            {/* ...existing code... */}
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                {post ? "Update" : "Publish"} Post
            </button>
        </form>
    );
}