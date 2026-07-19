import BlogHero from "./BlogHero";
import BlogList from "./BlogList";

const BlogPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <BlogHero />
      <BlogList />
    </div>
  );
};

export default BlogPage;
