import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  getAllReviews,
  approveReview,
  rejectReview,
} from "../../../services/reviewService";
import "./ReviewList.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getAllReviews();
      setReviews(response.data?.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "PENDING").length,
      approved: reviews.filter((r) => r.status === "APPROVED").length,
      rejected: reviews.filter((r) => r.status === "REJECTED").length,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filter === "ALL") return reviews;
    return reviews.filter((r) => r.status === filter);
  }, [reviews, filter]);

  const handleApprove = async (review) => {
    if (!window.confirm("Approve this review for public display?")) return;

    try {
      setActionLoading(true);
      const response = await approveReview(review._id);
      toast.success(response.data?.message || "Review approved successfully.");

      setReviews((prev) =>
        prev.map((item) =>
          item._id === review._id
            ? {
                ...item,
                status: "APPROVED",
                reviewedBy:
                  response.data?.review?.reviewedBy || item.reviewedBy,
              }
            : item
        )
      );
      setSelectedReview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve review.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (review) => {
    setSelectedReview(review);
    setRejectionReason(review.rejectionReason || "");
    setShowRejectModal(true);
  };

  const handleCloseReject = () => {
    if (actionLoading) return;
    setShowRejectModal(false);
    setSelectedReview(null);
    setRejectionReason("");
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      setActionLoading(true);
      const response = await rejectReview(
        selectedReview._id,
        rejectionReason.trim()
      );
      toast.success(response.data?.message || "Review rejected successfully.");

      setReviews((prev) =>
        prev.map((item) =>
          item._id === selectedReview._id
            ? {
                ...item,
                status: "REJECTED",
                rejectionReason: rejectionReason.trim(),
                reviewedBy:
                  response.data?.review?.reviewedBy || item.reviewedBy,
              }
            : item
        )
      );
      handleCloseReject();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject review.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderStars = (rating = 0) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "star filled" : "star"}>
          ★
        </span>
      ))}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );

  const getStatusBadge = (status) => {
    const map = {
      APPROVED: { label: "Approved", className: "badge-approved" },
      PENDING: { label: "Pending", className: "badge-pending" },
      REJECTED: { label: "Rejected", className: "badge-rejected" },
    };
    const current = map[status] || { label: status, className: "badge-default" };
    return (
      <span className={`status-badge ${current.className}`}>
        <span className="badge-dot" />
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="review-dashboard-container">
        <div className="dashboard-skeleton">
          <div className="spinner" />
          <p>Loading moderation records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-titles">
          <span className="header-tag">Moderation Hub</span>
          <h1>Product Reviews</h1>
          <p>Audit, verify, and curate customer feedback and sentiment.</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadReviews}
            disabled={loading}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      {/* METRIC CARDS */}
      <section className="metrics-grid">
        <div className={`metric-card ${filter === "ALL" ? "selected" : ""}`} onClick={() => setFilter("ALL")}>
          <div className="metric-info">
            <span className="metric-label">Total Submissions</span>
            <span className="metric-value">{counts.all}</span>
          </div>
          <div className="metric-icon total-icon">💬</div>
        </div>

        <div className={`metric-card ${filter === "PENDING" ? "selected" : ""}`} onClick={() => setFilter("PENDING")}>
          <div className="metric-info">
            <span className="metric-label">Pending Review</span>
            <span className="metric-value">{counts.pending}</span>
          </div>
          <div className="metric-icon pending-icon">⏳</div>
        </div>

        <div className={`metric-card ${filter === "APPROVED" ? "selected" : ""}`} onClick={() => setFilter("APPROVED")}>
          <div className="metric-info">
            <span className="metric-label">Published</span>
            <span className="metric-value">{counts.approved}</span>
          </div>
          <div className="metric-icon approved-icon">✓</div>
        </div>

        <div className={`metric-card ${filter === "REJECTED" ? "selected" : ""}`} onClick={() => setFilter("REJECTED")}>
          <div className="metric-info">
            <span className="metric-label">Rejected</span>
            <span className="metric-value">{counts.rejected}</span>
          </div>
          <div className="metric-icon rejected-icon">✕</div>
        </div>
      </section>

      {/* FILTER PILLS */}
      <nav className="filter-navigation">
        <div className="tab-group">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`filter-tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className="tab-count">
                {tab === "ALL" ? counts.all : counts[tab.toLowerCase()]}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* REVIEWS TABLE */}
      <section className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Author</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Order ID</th>
                <th>Status</th>
                <th>Submitted</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <div className="empty-content">
                      <span className="empty-icon">📂</span>
                      <p className="empty-title">No reviews located</p>
                      <p className="empty-subtitle">
                        There are no reviews matching the "{filter.toLowerCase()}" filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id}>
                    <td>
                      <div className="product-cell">
                        <div className="avatar-square">
                          {(review.product?.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <span className="product-title" title={review.product?.name}>
                          {review.product?.name || "Untitled Product"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">
                          {review.user?.firstName || "Anonymous"} {review.user?.lastName || ""}
                        </span>
                        <span className="customer-email">{review.user?.email || "No email"}</span>
                      </div>
                    </td>
                    <td>{renderStars(review.rating)}</td>
                    <td className="comment-cell">
                      <p className="comment-truncate" title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                    <td>
                      <span className="order-pill">
                        #{review.order?.orderNumber || (review.order?._id ? review.order._id.slice(-6) : "N/A")}
                      </span>
                    </td>
                    <td>{getStatusBadge(review.status)}</td>
                    <td className="date-cell">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button
                          type="button"
                          className="action-icon-btn view"
                          onClick={() => setSelectedReview(review)}
                          title="Inspect Details"
                        >
                          👁
                        </button>
                        {review.status !== "APPROVED" && (
                          <button
                            type="button"
                            className="action-icon-btn approve"
                            onClick={() => handleApprove(review)}
                            disabled={actionLoading}
                            title="Approve Review"
                          >
                            ✓
                          </button>
                        )}
                        {review.status !== "REJECTED" && (
                          <button
                            type="button"
                            className="action-icon-btn reject"
                            onClick={() => handleOpenReject(review)}
                            disabled={actionLoading}
                            title="Reject Review"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* INSPECT DETAIL MODAL */}
      {selectedReview && !showRejectModal && (
        <div className="modal-backdrop" onClick={() => setSelectedReview(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <h3>Review Moderation</h3>
                <span className="modal-sub">ID: {selectedReview._id}</span>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedReview(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body-content">
              <div className="review-hero">
                <div className="review-score">
                  <span className="large-score">{selectedReview.rating || 0}</span>
                  <div>
                    {renderStars(selectedReview.rating)}
                    <span className="score-label">Customer Rating</span>
                  </div>
                </div>
                <div>{getStatusBadge(selectedReview.status)}</div>
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <span className="info-title">Product</span>
                  <span className="info-desc">{selectedReview.product?.name || "N/A"}</span>
                </div>
                <div className="info-card">
                  <span className="info-title">Customer</span>
                  <span className="info-desc">
                    {selectedReview.user?.firstName} {selectedReview.user?.lastName}
                  </span>
                  <span className="info-sub-desc">{selectedReview.user?.email || "N/A"}</span>
                </div>
                <div className="info-card">
                  <span className="info-title">Order Reference</span>
                  <span className="info-desc">
                    {selectedReview.order?.orderNumber || selectedReview.order?._id || "N/A"}
                  </span>
                </div>
                <div className="info-card">
                  <span className="info-title">Submitted On</span>
                  <span className="info-desc">
                    {selectedReview.createdAt
                      ? new Date(selectedReview.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <span className="section-label">Review Content</span>
                <p className="narrative-box">{selectedReview.comment}</p>
              </div>

              {selectedReview.rejectionReason && (
                <div className="detail-section rejection-alert">
                  <span className="section-label-rejection">Rejection Notes</span>
                  <p>{selectedReview.rejectionReason}</p>
                </div>
              )}
            </div>

            {selectedReview.status !== "APPROVED" && (
              <div className="modal-bottom-actions">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleOpenReject(selectedReview)}
                  disabled={actionLoading}
                >
                  Reject Feedback
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedReview)}
                  disabled={actionLoading}
                >
                  Approve Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REJECT FORM MODAL */}
      {showRejectModal && selectedReview && (
        <div className="modal-backdrop" onClick={handleCloseReject}>
          <div className="modal-dialog modal-narrow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <h3>Reject Feedback</h3>
                <span className="modal-sub">Specify reason for internal logs</span>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={handleCloseReject}
                disabled={actionLoading}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReject}>
              <div className="modal-body-content">
                <div className="form-group">
                  <label htmlFor="rejectionInput" className="form-label">
                    Reason for Moderation Denial
                  </label>
                  <textarea
                    id="rejectionInput"
                    className="form-textarea"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Inappropriate language, spam submission, non-product feedback..."
                    maxLength={500}
                    rows={4}
                    disabled={actionLoading}
                    required
                  />
                  <div className="char-count">
                    <span>{rejectionReason.length}/500 characters</span>
                  </div>
                </div>
              </div>

              <div className="modal-bottom-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseReject}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;