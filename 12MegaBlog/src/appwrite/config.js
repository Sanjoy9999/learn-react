import conf from "../conf/conf.js";
import { Databases, Storage, Query, ID } from "appwrite"; // added ID
import authService from "./auth.js";          // <— import singleton

export class Service {
  client = authService.client;               // <— reuse authService.client
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)         // optional: re-set, harmless
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket    = new Storage(this.client);
  }

  // Helper function to sanitize slug for document ID
  sanitizeSlug(slug) {
    if (!slug) return ID.unique();
    
    // Remove invalid chars, replace spaces with hyphens
    let sanitized = String(slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_.]/g, '')
      .replace(/\s+/g, '-');
    
    // Remove leading special chars
    sanitized = sanitized.replace(/^[^a-zA-Z0-9]+/, '');
    
    // If empty or starts with special char, prepend 'post-'
    if (!sanitized || /^[._-]/.test(sanitized)) {
      sanitized = 'post-' + sanitized;
    }
    
    // Ensure it's not too long
    return sanitized.substring(0, 36);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      // Generate a safe document ID from the slug or title
      const documentId = this.sanitizeSlug(slug || title);
      
      // Ensure userId is available, otherwise use a default or guest ID
      if (!userId) {
        console.warn("No userId provided for post creation, using default");
        // Try to get current user or use a placeholder
        const currentUser = await authService.getCurrentUser();
        userId = currentUser ? currentUser.$id : "guest-user";
      }
      
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId,
        {
          title,
          content,
          slug: documentId, // Store the sanitized slug
          freaturedImage: featuredImage, // Fixed: renamed to match Appwrite schema requirement
          status,
          userid: userId, // This is the field Appwrite expects
        }
      );
    } catch (error) {
      console.log("Appwrite service : createPost : error", error);
      throw error; // Re-throw to allow components to handle or display the error
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Appwrite service : updatePost : error", error);
    }
  }

async deletePost(slug){
    try {
        await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId, // Was using appwriteDatabaseId
            slug
        ) 
        return true;
    } catch (error) {
        console.log("Appwrite service :: deletePost :: error", error);
        return false;
    }
}

async getPost(slug){
    try {
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId, // Was using appwriteDatabaseId
            slug
        )
    } catch (error) {
        console.log("Appwrite service :: getPost :: error", error);
        return false;
    }
}

  async getPosts(queries = []) {
    try {
      // Default query to get active/published posts
      const defaultQueries = [
        Query.equal('status', 'active')
      ];
      
      // Use provided queries or default
      const finalQueries = queries.length > 0 ? queries : defaultQueries;
      
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        finalQueries
      );
    } catch (error) {
      console.log("Appwrite service : getPosts : error", error);
      return null;
    }
  }

  async getUserPosts(userId) {
    try {
        if (!userId) {
            throw new Error("userId is required for getUserPosts");
        }
        
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.equal("userid", userId) // Make sure to pass the actual userId value here
            ]
        );
    } catch (error) {
        console.log("Appwrite service : getUserPosts : error", error);
        throw error;
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
     return await this.bucket.createFile(
       conf.appwriteBucketId,
       ID.unique(),        // now ID is defined
       file
     );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(
      conf.appwriteBucketId, // Was incorrectly using confirm.appwriteBucketId
      fileId
    );
  }
}

const service = new Service();
export default service;
