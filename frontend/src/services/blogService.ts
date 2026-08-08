// services/blogService.ts

import { Blog } from "@/types/blog";
import axiosInstance from "@/lib/axiosInstance";

export const blogService = {
  
  getUserBlogs: async (): Promise<{
    success: boolean;
    data?: Blog[];
    count?: number;
    message?: string;
  }> => {
    try {
      const response = await axiosInstance.get("/api/admin/blogs");

      return response.data;
    } catch (error: any) {
      console.error("Get User Blogs Error:", error);

      return {
        success: false,
        message: error?.response?.data?.message || "Failed to fetch user blogs",
      };
    }
  },

  /**
   * Get single blog
   */
  getBlog: async (
    id: string,
  ): Promise<{
    success: boolean;
    data?: Blog;
    message?: string;
  }> => {
    try {
      const response = await axiosInstance.get(`/api/blogs/${id}`);

      return response.data;
    } catch (error: any) {
      console.error("Get Blog Error:", error);

      return {
        success: false,
        message: error?.response?.data?.message || "Failed to fetch blog",
      };
    }
  },

  /**
   * Create blog
   */
  createBlog: async (
    formData: FormData,
  ): Promise<{
    success: boolean;
    data?: Blog;
    message?: string;
  }> => {
    try {
      const response = await axiosInstance.post("/api/admin/blogs", formData);

      return response.data;
    } catch (error: any) {
      console.error("Create Blog Error:", error);

      return {
        success: false,
        message: error?.response?.data?.message || "Failed to create blog",
      };
    }
  },

  /**
   * Update blog
   */
  updateBlog: async (
    id: string,
    formData: FormData,
  ): Promise<{
    success: boolean;
    data?: Blog;
    message?: string;
  }> => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/blogs/${id}`,
        formData,
      );

      return response.data;
    } catch (error: any) {
      console.error("Update Blog Error:", error);

      return {
        success: false,
        message: error?.response?.data?.message || "Failed to update blog",
      };
    }
  },

  /**
   * Delete blog
   */
  deleteBlog: async (
    id: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await axiosInstance.delete(`/api/admin/blogs/${id}`);

      return response.data;
    } catch (error: any) {
      console.error("Delete Blog Error:", error);

      return {
        success: false,
        message: error?.response?.data?.message || "Failed to delete blog",
      };
    }
  },
};
