import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "../conf/conf";

class AppwriteService {
  client = new Client();
  databases;
  storage;
  
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // Helper method to sanitize slugs for Appwrite document IDs
  sanitizeSlug(slug) {
    if (!slug) return ID.unique(); // Generate a unique ID if slug is empty
    
    // Remove invalid characters, replace spaces with hyphens
    let sanitized = slug.toLowerCase().replace(/[^a-z0-9\s-_.]/g, '')
        .replace(/\s+/g, '-');
    
    // Remove leading special chars
    sanitized = sanitized.replace(/^[^a-zA-Z0-9]+/, '');
    
    // Remove trailing special chars
    sanitized = sanitized.replace(/[^a-zA-Z0-9]+$/, '');
    
    // If after sanitization we have an empty string, generate a unique ID
    if (!sanitized) return ID.unique();
    
    // Limit to 36 characters as per Appwrite requirements
    return sanitized.substring(0, 36);
  }

  async createPost({title, slug, content, featuredImage, status, userId}) {
    try {
      // Sanitize the slug before using it as document ID
      const documentId = this.sanitizeSlug(slug || title); // Use title as fallback for slug
      
      return await this.databases.createDocument(
        conf.databaseId,
        conf.collectionId,
        documentId,
        {
          title,
          content,
          slug: documentId, // Store the sanitized slug in the document too
          featuredImage,
          status,
          userid: userId,
        }
      );
    } catch (error) {
      console.log("Appwrite service : createPost : error", error);
      throw error;
    }
  }

  // Add other methods for your service (getPost, updatePost, deletePost, etc.)
  // ...existing code...
}

const appwriteService = new AppwriteService();
export default appwriteService;