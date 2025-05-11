import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronDown, MessageCircle, ThumbsUp, Send } from "lucide-react";
import {
  CustomerReview,
  formatRelativeTime,
  calculateAverageRating,
} from "../../lib/reviewData";
import axios from "axios";

interface Response {
  id: string;
  reviewId: string;
  description: string;
  freelancer: {
    id: string;
    name: string;
    avatar: string;
  };
  like: boolean;
  createdAt: string;
}

interface CustomerReviewWithResponse extends CustomerReview {
  response?: Response;
  vote?: {
    isHelpFull: "like" | "dislike" | "none";
  };
}

interface CustomerReviewsProps {
  reviews: CustomerReviewWithResponse[];
  showGigTitle?: boolean;
  initialDisplayCount?: number;
  isGigOwner?: boolean;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews: initialReviews,
  showGigTitle = true,
  initialDisplayCount = 3,
  isGigOwner = false,
}) => {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState(initialReviews);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [showResponses, setShowResponses] = useState<{
    [key: string]: boolean;
  }>({});

  const averageRating = calculateAverageRating(reviews);

  const toggleExpandComment = (reviewId: string) => {
    setExpandedComments((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const showMoreReviews = () => {
    setDisplayCount((prev) => prev + 3);
  };

  const handleSubmitResponse = async (reviewId: string) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:5000/api/response/create",
        {
          idReview: reviewId,
          description: replyText,
          like: true,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data && !response.data.error) {
        setReplyText("");
        setReplyingTo(null);

        // Cập nhật state reviews với phản hồi mới
        const newResponse = response.data.response;
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? { ...review, response: newResponse }
              : review
          )
        );
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Có lỗi xảy ra khi gửi phản hồi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (
    reviewId: string,
    isHelpFull: "like" | "dislike"
  ) => {
    try {
      setIsVoting(true);
      const response = await axios.post(
        "http://localhost:5000/api/review-vote/create",
        {
          idReview: reviewId,
          isHelpFull,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  vote: {
                    isHelpFull: response.data.vote?.isHelpFull || "none",
                  },
                }
              : review
          )
        );
      }
    } catch (err) {
      console.error("Error voting:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleGetResponse = async (reviewId: string) => {
    try {
      setIsLoadingResponse(true);
      const response = await axios.get(
        `http://localhost:5000/api/response/get/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data && !response.data.error) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? { ...review, response: response.data.respone }
              : review
          )
        );
      }
    } catch (err) {
      console.error("Error fetching response:", err);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          let starClass = "text-gray-300";
          if (rating >= star) starClass = "text-yellow-400 fill-yellow-400";
          else if (rating >= star - 0.5)
            starClass = "text-yellow-400 fill-yellow-400 opacity-90";

          return <Star key={star} size={16} className={starClass} />;
        })}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Title and overview */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{averageRating.toFixed(1)}/5</span>
            <span className="text-gray-500 ml-2">
              ({reviews.length} đánh giá)
            </span>
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="divide-y divide-gray-100">
        {reviews.length > 0 ? (
          reviews.slice(0, displayCount).map((review) => (
            <div
              key={review.id}
              id={`review-${review.id}`}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={review.customerAvatar || "/default-avatar.png"}
                    alt={`${review.customerName}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-start justify-between mb-2">
                    <div>
                      <Link
                        to={`/user/${review.customerId}`}
                        className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {review.customerName}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(review.date)}
                      </div>
                    </div>

                    <div className="mt-1">{renderStars(review.rating)}</div>
                  </div>

                  {/* Gig title */}
                  {showGigTitle && review.gigTitle && (
                    <Link
                      to={`/gig/${review.gigId}`}
                      className="inline-block mt-1 mb-3 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {review.gigTitle}
                    </Link>
                  )}

                  {/* Comment content */}
                  <div className="mt-2">
                    <p
                      className={`text-gray-700 text-sm leading-relaxed ${
                        !expandedComments.includes(review.id) &&
                        review.comment.length > 180
                          ? "line-clamp-3"
                          : ""
                      }`}
                    >
                      {review.comment}
                    </p>

                    {review.comment.length > 180 && (
                      <button
                        onClick={() => toggleExpandComment(review.id)}
                        className="mt-1 text-xs font-medium text-gray-600 hover:text-blue-600"
                      >
                        {expandedComments.includes(review.id)
                          ? "Thu gọn"
                          : "Xem thêm"}
                      </button>
                    )}
                  </div>

                  {/* Interactions */}
                  <div className="flex items-center mt-4 text-sm">
                    <div className="flex items-center mr-4">
                      <button
                        onClick={() => handleVote(review.id, "like")}
                        disabled={isVoting}
                        className={`flex items-center px-3 py-1 rounded-full transition-colors mr-2 ${
                          review.vote?.isHelpFull === "like"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        <ThumbsUp size={14} className="mr-1" />
                        Yes
                      </button>
                      <button
                        onClick={() => handleVote(review.id, "dislike")}
                        disabled={isVoting}
                        className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                          review.vote?.isHelpFull === "dislike"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        <ThumbsUp size={14} className="mr-1 rotate-180" />
                        No
                      </button>
                    </div>
                    {isGigOwner && !review.isResponse && (
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === review.id ? null : review.id
                          )
                        }
                        className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <MessageCircle size={14} className="mr-1" />
                        Phản hồi
                      </button>
                    )}
                    {review.isResponse && (
                      <button
                        onClick={() => {
                          if (!showResponses[review.id]) {
                            handleGetResponse(review.id);
                          }
                          setShowResponses((prev) => ({
                            ...prev,
                            [review.id]: !prev[review.id],
                          }));
                        }}
                        disabled={isLoadingResponse}
                        className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <MessageCircle size={14} className="mr-1" />
                        {isLoadingResponse
                          ? "Đang tải..."
                          : showResponses[review.id]
                          ? "Ẩn phản hồi"
                          : "Hiện phản hồi"}
                      </button>
                    )}
                  </div>

                  {/* Hiển thị phản hồi nếu có */}
                  {review.response && showResponses[review.id] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            review.response.freelancer?.avatar ||
                            "/default-avatar.png"
                          }
                          alt={review.response.freelancer?.name || "Freelancer"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {review.response.freelancer?.name || "Freelancer"}
                            <span className="ml-2 text-xs text-gray-500">
                              {formatRelativeTime(review.response.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">
                            {review.response.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reply form */}
                  {replyingTo === review.id && !review.response && (
                    <div className="mt-4">
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Viết phản hồi của bạn..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {error && (
                          <p className="text-red-500 text-sm">{error}</p>
                        )}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSubmitResponse(review.id)}
                            disabled={isSubmitting || !replyText.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              "Đang gửi..."
                            ) : (
                              <>
                                <Send size={14} />
                                <span>Gửi phản hồi</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            <p>Chưa có đánh giá nào</p>
          </div>
        )}
      </div>

      {/* See more button */}
      {reviews.length > displayCount && (
        <div className="p-4 text-center border-t border-gray-100">
          <button
            onClick={showMoreReviews}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span>Xem thêm đánh giá</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
