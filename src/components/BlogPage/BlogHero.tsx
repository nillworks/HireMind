const BlogHero = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl md:text-5xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
        Our <span className="text-PrimaryColor">Blog</span>
      </h1>
      <p className="mt-4 text-lg font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-2xl mx-auto">
        Insights, tips, and stories from the TalentAI community
      </p>
    </div>
  );
};

export default BlogHero;
