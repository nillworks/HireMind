import { Suspense } from "react";
import getUserSession from "@/lib/getUserSession";
import AddBlogPostForm from "./AddBlogPostForm";
import AddBlogPostSkeleton from "./AddBlogPostSkeleton";

const AddBlogPostPage = async () => {
  const user = await getUserSession();

  return (
    <Suspense fallback={<AddBlogPostSkeleton />}>
      <AddBlogPostForm user={user ?? null} />
    </Suspense>
  );
};

export default AddBlogPostPage;
