/**
 * BLOG DETAILS PAGE
 * Single blog view with full content
 */

import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft, Calendar, User } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { useBlogDetails } from "../../hooks/useBlogs";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { colors, glassmorphism, shadows } = useTheme();

  const { data: blog, isLoading, error } = useBlogDetails(slug);

  const handleGoBack = () => {
    navigate("/blogs");
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" style={{ color: colors.accent.purple }} />
          <p style={{ color: colors.text.secondary }}>Loading blog...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !blog) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 transition-colors duration-200"
          style={{ color: colors.accent.blue }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </button>

        <div
          className="rounded-lg border px-4 py-6 text-center"
          style={{
            borderColor: colors.accent.blue,
            background: `rgba(59,130,255,0.1)`,
          }}
        >
          <AlertCircle className="mx-auto mb-3 h-8 w-8" style={{ color: colors.accent.blue }} />
          <h2 className="mb-2 text-xl font-bold" style={{ color: colors.text.primary }}>
            Blog not found
          </h2>
          <p style={{ color: colors.text.secondary }}>
            {error?.message || "The blog you're looking for doesn't exist"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BACK BUTTON */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 transition-colors duration-200"
        style={{ color: colors.accent.blue }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.7";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blogs
      </button>

      {/* THUMBNAIL */}
      {blog.thumbnail && (
        <div className="relative h-96 w-full overflow-hidden rounded-xl">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 30%, ${colors.background.primary}90)`,
            }}
          />
        </div>
      )}

      {/* HEADER */}
      <div className="space-y-4">
        <h1
          className="text-4xl font-bold md:text-5xl lg:text-6xl"
          style={{ color: colors.text.primary }}
        >
          {blog.title}
        </h1>

        {/* METADATA */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            {/* AUTHOR */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" style={{ color: colors.accent.purple }} />
              <p style={{ color: colors.text.secondary }}>By {blog.authorName}</p>
            </div>

            {/* PUBLISHED DATE */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" style={{ color: colors.accent.blue }} />
              <p style={{ color: colors.text.secondary }}>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* TAGS */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={{
                    background: `rgba(176,38,255,0.2)`,
                    color: colors.accent.purple,
                    border: `1px solid ${colors.border.glass}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
        }}
      />

      {/* CONTENT */}
      <article
        style={{
          color: colors.text.primary,
        }}
        className="prose prose-invert max-w-none space-y-6"
      >
        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="space-y-4"
          style={{
            color: colors.text.primary,
            fontSize: "16px",
            lineHeight: "1.8",
          }}
        >
          {/* Content rendered as HTML */}
        </div>
      </article>

      {/* DIVIDER */}
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
        }}
      />

      {/* AUTHOR BIO SECTION */}
      <div
        className="rounded-lg p-6"
        style={{
          background: glassmorphism.card.background,
          border: `1px solid ${glassmorphism.card.border}`,
          backdropFilter: glassmorphism.card.backdropFilter,
        }}
      >
        <div className="space-y-2">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: colors.text.secondary }}
          >
            About the Author
          </p>
          <p className="text-lg font-bold" style={{ color: colors.text.primary }}>
            {blog.authorName}
          </p>
          <p style={{ color: colors.text.secondary }}>
            Sharing spiritual insights and faith-based perspectives with our community.
          </p>
        </div>
      </div>

      {/* BACK TO BLOGS BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={handleGoBack}
          className="rounded-lg px-8 py-3 font-semibold transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            color: colors.text.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Back to All Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
