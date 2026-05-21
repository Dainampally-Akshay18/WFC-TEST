/**
 * BLOGS PAGE
 * Blog listing with search and tag filtering
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { useBlogs } from "../../hooks/useBlogs";
import BlogSearch from "./BlogSearch";
import BlogTags from "./BlogTags";

const Blogs = () => {
  const navigate = useNavigate();
  const { colors, glassmorphism, shadows } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const tagsParam = selectedTags.join(",");
  const { data: blogs = [], isLoading, error } = useBlogs({
    search,
    tags: tagsParam,
  });

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleTagsChange = useCallback((tags) => {
    setSelectedTags(tags);
  }, []);

  const handleBlogClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1
          className="mb-2 text-4xl font-bold md:text-5xl"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Blog & Insights
        </h1>
        <p style={{ color: colors.text.secondary }}>
          Inspiring stories, spiritual wisdom, and community updates
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3">
          <BlogSearch onSearch={handleSearch} initialValue={search} />
        </div>
      </div>

      {/* TAG FILTERS */}
      <div>
        <BlogTags blogs={blogs} selectedTags={selectedTags} onTagsChange={handleTagsChange} />
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" style={{ color: colors.accent.purple }} />
            <p style={{ color: colors.text.secondary }}>Loading blogs...</p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div
          className="rounded-lg border px-4 py-4"
          style={{
            borderColor: colors.accent.blue,
            background: `rgba(59,130,255,0.1)`,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: colors.accent.blue }} />
            <div>
              <h3 className="font-semibold" style={{ color: colors.text.primary }}>
                Failed to load blogs
              </h3>
              <p style={{ color: colors.text.secondary }} className="text-sm">
                {error.message || "An error occurred while fetching blogs"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && blogs.length === 0 && !error && (
        <div className="text-center py-12">
          <p style={{ color: colors.text.muted }} className="text-lg">
            {search || selectedTags.length > 0
              ? "No blogs found matching your criteria"
              : "No blogs available yet"}
          </p>
        </div>
      )}

      {/* BLOG GRID */}
      {!isLoading && blogs.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                background: glassmorphism.card.background,
                border: `1px solid ${glassmorphism.card.border}`,
                backdropFilter: glassmorphism.card.backdropFilter,
                boxShadow: shadows.md,
              }}
              className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = glassmorphism.cardHover.background;
                e.currentTarget.style.border = `1px solid ${glassmorphism.cardHover.border}`;
                e.currentTarget.style.boxShadow = glassmorphism.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = glassmorphism.card.background;
                e.currentTarget.style.border = `1px solid ${glassmorphism.card.border}`;
                e.currentTarget.style.boxShadow = shadows.md;
              }}
              onClick={() => handleBlogClick(blog.slug)}
            >
              {/* THUMBNAIL */}
              {blog.thumbnail && (
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-current to-transparent">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 40%, ${colors.background.primary}80)`,
                    }}
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="p-6">
                {/* TITLE */}
                <h3
                  className="mb-2 line-clamp-2 text-xl font-bold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  {blog.title}
                </h3>

                {/* AUTHOR & DATE */}
                <div className="mb-4 flex items-center justify-between">
                  <p style={{ color: colors.text.secondary }} className="text-sm">
                    by {blog.authorName}
                  </p>
                  <p style={{ color: colors.text.muted }} className="text-xs">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* TAGS */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          background: `rgba(176,38,255,0.2)`,
                          color: colors.accent.purple,
                          border: `1px solid ${colors.border.glass}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span style={{ color: colors.text.muted }} className="text-xs pt-1">
                        +{blog.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  className="mt-4 inline-block font-semibold transition-all duration-200"
                  style={{ color: colors.accent.purple }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
