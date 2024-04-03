import { BlogDocument } from "../domains/schemas/blogs.schema";
import { OutputBlogModel } from "../../features/blogs/api/models/output";

export const blogsMapper = (blog:BlogDocument):OutputBlogModel => {
  return {
    id:blog._id.toString(),
    name:blog.name,
    websiteUrl:blog.websiteUrl,
    description:blog.description,
    createdAt:blog.createdAt,
    isMembership:blog.isMembership
  }
}

