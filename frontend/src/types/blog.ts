// types/blog.ts
export interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;  // Changed from profilePicture
  };
  author: string;
  tags: string[];
  isPublished: boolean;
  likes: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
}