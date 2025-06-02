import React from 'react'
import appwriteService from '../appwrite/config'
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage, status = "published", content}) {
    // Add fallback image in case featuredImage is missing
    const imageUrl = featuredImage 
        ? appwriteService.getFilePreview(featuredImage)
        : 'https://via.placeholder.com/300x200?text=No+Image';

    // Add excerpt from content
    const createExcerpt = (content) => {
        if (!content) return "";
        
        // Try to extract text from potential HTML content
        const div = document.createElement("div");
        div.innerHTML = content;
        const textContent = div.textContent || div.innerText || "";
        
        return textContent.length > 100 ? `${textContent.substring(0, 100)}...` : textContent;
    };

    return (
      <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4 transition-transform hover:scale-105'>
          <div className='w-full justify-center mb-4'>
            <img 
              src={imageUrl}
              alt={title || "Post image"} 
              className='rounded-xl w-full h-40 object-cover'
            />
          </div>
          <h2 className='text-xl font-bold'>{title || "Untitled Post"}</h2>
          {content && (
            <p className="text-gray-600 mt-2">{createExcerpt(content)}</p>
          )}
          {status !== "active" && (
            <span className="inline-block px-2 py-1 mt-2 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              Draft
            </span>
          )}
        </div>
      </Link>
    )
}

export default PostCard
