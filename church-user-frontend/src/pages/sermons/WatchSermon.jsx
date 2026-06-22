import { useParams, useNavigate } from "react-router-dom";
import { useSermonDetails } from "../../hooks/useSermons";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

const WatchSermon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: sermon, isLoading, error } = useSermonDetails(id);

  const handleBack = () => {
    navigate("/sermons");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-[#E2E8F0] border-t-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-[#64748B]">Loading sermon...</p>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Failed to load sermon.
          </p>
          <button
            onClick={handleBack}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Sermons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Sermons</span>
        </button>

        {/* Video Player Section */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-8">
          {/* YouTube Embed */}
          <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${sermon.youtubeVideoId}`}
              title={sermon.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Sermon Details */}
          <div className="p-8">
            {/* Category Badge */}
            {sermon.categoryId?.name && (
              <div className="inline-block bg-[#EFF6FF] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {sermon.categoryId.name}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#0F172A] mb-6">
              {sermon.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#64748B]">
                <User size={18} />
                <span>{sermon.speakerName || "Unknown Speaker"}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Calendar size={18} />
                <span>
                  {new Date(sermon.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {sermon.categoryId && (
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Tag size={18} />
                  <span>{sermon.categoryId.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-base text-[#64748B] leading-relaxed whitespace-pre-wrap">
              {sermon.description}
            </div>
          </div>
        </div>

        {/* Category Info */}
        {sermon.categoryId?.description && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-4">
              About {sermon.categoryId.name}
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              {sermon.categoryId.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchSermon;
