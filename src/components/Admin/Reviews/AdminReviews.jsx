// import React, {
//   useEffect,
//   useState
// } from "react";

// import {
//   toast
// } from "react-toastify";

// import {
//   getAllReviews,
//   approveReview,
//   rejectReview
// } from "../../../services/reviewService";

// import "./AdminReviews.css";


// const AdminReviews = () => {

//   // =======================================
//   // STATES
//   // =======================================

//   const [reviews, setReviews] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [actionLoading, setActionLoading] =
//     useState(null);

//   const [filter, setFilter] =
//     useState("ALL");

//   const [rejectModal, setRejectModal] =
//     useState(null);

//   const [rejectionReason, setRejectionReason] =
//     useState("");


//   // =======================================
//   // LOAD REVIEWS
//   // =======================================

//   const loadReviews = async () => {

//     try {

//       setLoading(true);

//       const response =
//         await getAllReviews();

//       console.log(
//         "ADMIN REVIEWS RESPONSE:",
//         response
//       );

//       const reviewList =
//         response?.data?.reviews || [];

//       setReviews(reviewList);

//     }
//     catch (error) {

//       console.error(
//         "GET ADMIN REVIEWS ERROR:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to load reviews."
//       );

//     }
//     finally {

//       setLoading(false);

//     }

//   };


//   // =======================================
//   // INITIAL LOAD
//   // =======================================

//   useEffect(() => {

//     loadReviews();

//   }, []);


//   // =======================================
//   // APPROVE REVIEW
//   // =======================================

//   const handleApprove = async (
//     reviewId
//   ) => {

//     try {

//       setActionLoading(reviewId);

//       const response =
//         await approveReview(reviewId);

//       toast.success(
//         response?.data?.message ||
//         "Review approved successfully."
//       );

//       // Update locally
//       setReviews((previous) =>

//         previous.map((review) =>

//           review._id === reviewId

//             ? {
//                 ...review,
//                 status: "APPROVED"
//               }

//             : review

//         )

//       );

//     }
//     catch (error) {

//       console.error(
//         "APPROVE REVIEW ERROR:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to approve review."
//       );

//     }
//     finally {

//       setActionLoading(null);

//     }

//   };


//   // =======================================
//   // OPEN REJECT MODAL
//   // =======================================

//   const openRejectModal = (
//     review
//   ) => {

//     setRejectModal(review);

//     setRejectionReason("");

//   };


//   // =======================================
//   // CLOSE REJECT MODAL
//   // =======================================

//   const closeRejectModal = () => {

//     setRejectModal(null);

//     setRejectionReason("");

//   };


//   // =======================================
//   // REJECT REVIEW
//   // =======================================

//   const handleReject = async () => {

//     if (!rejectModal?._id) {
//       return;
//     }


//     try {

//       setActionLoading(
//         rejectModal._id
//       );


//       const response =
//         await rejectReview(

//           rejectModal._id,

//           rejectionReason.trim()

//         );


//       toast.success(
//         response?.data?.message ||
//         "Review rejected successfully."
//       );


//       // Update locally
//       setReviews((previous) =>

//         previous.map((review) =>

//           review._id ===
//           rejectModal._id

//             ? {
//                 ...review,

//                 status: "REJECTED",

//                 rejectionReason:
//                   rejectionReason.trim()
//               }

//             : review

//         )

//       );


//       closeRejectModal();

//     }
//     catch (error) {

//       console.error(
//         "REJECT REVIEW ERROR:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to reject review."
//       );

//     }
//     finally {

//       setActionLoading(null);

//     }

//   };


//   // =======================================
//   // FILTER REVIEWS
//   // =======================================

//   const filteredReviews =
//     reviews.filter((review) => {

//       if (filter === "ALL") {
//         return true;
//       }

//       return review.status === filter;

//     });


//   // =======================================
//   // COUNTS
//   // =======================================

//   const totalReviews =
//     reviews.length;

//   const pendingReviews =
//     reviews.filter(
//       (review) =>
//         review.status === "PENDING"
//     ).length;

//   const approvedReviews =
//     reviews.filter(
//       (review) =>
//         review.status === "APPROVED"
//     ).length;

//   const rejectedReviews =
//     reviews.filter(
//       (review) =>
//         review.status === "REJECTED"
//     ).length;


//   // =======================================
//   // RENDER
//   // =======================================

//   return (

//     <div className="admin-reviews-page">


//       {/* =================================
//           HEADER
//       ================================= */}

//       <div className="admin-reviews-header">

//         <div>

//           <h1>
//             Product Reviews
//           </h1>

//           <p>
//             Manage customer product reviews
//             and approve or reject them.
//           </p>

//         </div>

//       </div>


//       {/* =================================
//           SUMMARY
//       ================================= */}

//       <div className="review-summary">


//         <div className="review-summary-card">

//           <span>
//             Total Reviews
//           </span>

//           <strong>
//             {totalReviews}
//           </strong>

//         </div>


//         <div className="review-summary-card pending">

//           <span>
//             Pending
//           </span>

//           <strong>
//             {pendingReviews}
//           </strong>

//         </div>


//         <div className="review-summary-card approved">

//           <span>
//             Approved
//           </span>

//           <strong>
//             {approvedReviews}
//           </strong>

//         </div>


//         <div className="review-summary-card rejected">

//           <span>
//             Rejected
//           </span>

//           <strong>
//             {rejectedReviews}
//           </strong>

//         </div>


//       </div>


//       {/* =================================
//           FILTER
//       ================================= */}

//       <div className="review-filter-bar">

//         <button
//           className={
//             filter === "ALL"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setFilter("ALL")
//           }
//         >
//           All
//         </button>


//         <button
//           className={
//             filter === "PENDING"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setFilter("PENDING")
//           }
//         >
//           Pending
//         </button>


//         <button
//           className={
//             filter === "APPROVED"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setFilter("APPROVED")
//           }
//         >
//           Approved
//         </button>


//         <button
//           className={
//             filter === "REJECTED"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setFilter("REJECTED")
//           }
//         >
//           Rejected
//         </button>

//       </div>


//       {/* =================================
//           REVIEWS
//       ================================= */}

//       {loading ? (

//         <div className="reviews-loading">

//           Loading reviews...

//         </div>

//       ) : filteredReviews.length === 0 ? (

//         <div className="reviews-empty">

//           <h3>
//             No reviews found
//           </h3>

//           <p>
//             There are no reviews in this category.
//           </p>

//         </div>

//       ) : (

//         <div className="reviews-table-wrapper">

//           <table className="reviews-table">

//             <thead>

//               <tr>

//                 <th>
//                   Customer
//                 </th>

//                 <th>
//                   Product
//                 </th>

//                 <th>
//                   Rating
//                 </th>

//                 <th>
//                   Review
//                 </th>

//                 <th>
//                   Purchase
//                 </th>

//                 <th>
//                   Status
//                 </th>

//                 <th>
//                   Date
//                 </th>

//                 <th>
//                   Action
//                 </th>

//               </tr>

//             </thead>


//             <tbody>

//               {filteredReviews.map(
//                 (review) => (

//                   <tr
//                     key={review._id}
//                   >


//                     {/* CUSTOMER */}

//                     <td>

//                       <div className="review-customer">

//                         <strong>

//                           {review.user?.firstName ||
//                             ""}

//                           {" "}

//                           {review.user?.lastName ||
//                             ""}

//                         </strong>

//                         <small>

//                           {review.user?.email ||
//                             "N/A"}

//                         </small>

//                       </div>

//                     </td>


//                     {/* PRODUCT */}

//                     <td>

//                       <strong>

//                         {review.product?.name ||
//                           "Product unavailable"}

//                       </strong>

//                     </td>


//                     {/* RATING */}

//                     <td>

//                       <div className="review-stars">

//                         {[1, 2, 3, 4, 5].map(
//                           (star) => (

//                             <span
//                               key={star}
//                               className={
//                                 star <=
//                                 review.rating
//                                   ? "filled"
//                                   : ""
//                               }
//                             >
//                               ★
//                             </span>

//                           )
//                         )}

//                       </div>

//                       <small>

//                         {review.rating}/5

//                       </small>

//                     </td>


//                     {/* COMMENT */}

//                     <td>

//                       <div className="review-comment">

//                         {review.comment}

//                       </div>

//                     </td>


//                     {/* PURCHASE */}

//                     <td>

//                       {review.verifiedPurchase ? (

//                         <span className="verified-badge">

//                           ✓ Verified

//                         </span>

//                       ) : (

//                         <span className="not-verified">

//                           Not Verified

//                         </span>

//                       )}

//                     </td>


//                     {/* STATUS */}

//                     <td>

//                       <span
//                         className={`
//                           review-status
//                           ${String(
//                             review.status || ""
//                           ).toLowerCase()}
//                         `}
//                       >

//                         {review.status}

//                       </span>

//                     </td>


//                     {/* DATE */}

//                     <td>

//                       {review.createdAt
//                         ? new Date(
//                             review.createdAt
//                           ).toLocaleDateString(
//                             "en-IN"
//                           )
//                         : "N/A"}

//                     </td>


//                     {/* ACTION */}

//                     <td>

//                       <div className="review-actions">


//                         {review.status !==
//                           "APPROVED" && (

//                           <button
//                             className="approve-btn"
//                             disabled={
//                               actionLoading ===
//                               review._id
//                             }
//                             onClick={() =>
//                               handleApprove(
//                                 review._id
//                               )
//                             }
//                           >

//                             {actionLoading ===
//                             review._id
//                               ? "..."
//                               : "Approve"}

//                           </button>

//                         )}


//                         {review.status !==
//                           "REJECTED" && (

//                           <button
//                             className="reject-btn"
//                             disabled={
//                               actionLoading ===
//                               review._id
//                             }
//                             onClick={() =>
//                               openRejectModal(
//                                 review
//                               )
//                             }
//                           >

//                             Reject

//                           </button>

//                         )}

//                       </div>

//                     </td>


//                   </tr>

//                 )
//               )}

//             </tbody>

//           </table>

//         </div>

//       )}


//       {/* =================================
//           REJECT MODAL
//       ================================= */}

//       {rejectModal && (

//         <div className="reject-modal-overlay">

//           <div className="reject-modal">

//             <div className="reject-modal-header">

//               <h2>
//                 Reject Review
//               </h2>

//               <button
//                 type="button"
//                 onClick={
//                   closeRejectModal
//                 }
//               >
//                 ×
//               </button>

//             </div>


//             <div className="reject-modal-body">

//               <p>
//                 Please provide a reason
//                 for rejecting this review.
//               </p>


//               <textarea
//                 value={
//                   rejectionReason
//                 }
//                 onChange={(e) =>
//                   setRejectionReason(
//                     e.target.value
//                   )
//                 }
//                 placeholder="Enter rejection reason..."
//                 maxLength={500}
//                 rows={5}
//               />

//               <small>
//                 {rejectionReason.length}/500
//               </small>

//             </div>


//             <div className="reject-modal-actions">

//               <button
//                 type="button"
//                 className="cancel-btn"
//                 onClick={
//                   closeRejectModal
//                 }
//               >
//                 Cancel
//               </button>


//               <button
//                 type="button"
//                 className="confirm-reject-btn"
//                 disabled={
//                   actionLoading ===
//                   rejectModal._id
//                 }
//                 onClick={
//                   handleReject
//                 }
//               >

//                 {actionLoading ===
//                 rejectModal._id
//                   ? "Rejecting..."
//                   : "Reject Review"}

//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   );

// };


// export default AdminReviews;

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  getAllReviews,
  approveReview,
  rejectReview,
} from "../../../services/reviewService";
import "./AdminReviews.css";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getAllReviews();
      const reviewList = response?.data?.reviews || [];
      setReviews(reviewList);
    } catch (error) {
      console.error("GET ADMIN REVIEWS ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      setActionLoading(reviewId);
      const response = await approveReview(reviewId);
      toast.success(response?.data?.message || "Review approved successfully.");

      setReviews((previous) =>
        previous.map((review) =>
          review._id === reviewId ? { ...review, status: "APPROVED" } : review
        )
      );
    } catch (error) {
      console.error("APPROVE REVIEW ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to approve review.");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (review) => {
    setRejectModal(review);
    setRejectionReason("");
  };

  const closeRejectModal = () => {
    setRejectModal(null);
    setRejectionReason("");
  };

  const handleReject = async () => {
    if (!rejectModal?._id) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      setActionLoading(rejectModal._id);
      const response = await rejectReview(
        rejectModal._id,
        rejectionReason.trim()
      );

      toast.success(response?.data?.message || "Review rejected successfully.");

      setReviews((previous) =>
        previous.map((review) =>
          review._id === rejectModal._id
            ? {
                ...review,
                status: "REJECTED",
                rejectionReason: rejectionReason.trim(),
              }
            : review
        )
      );

      closeRejectModal();
    } catch (error) {
      console.error("REJECT REVIEW ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to reject review.");
    } finally {
      setActionLoading(null);
    }
  };

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
    return reviews.filter((review) => review.status === filter);
  }, [reviews, filter]);

  const renderStars = (rating = 0) => (
    <div className="rv-star-rating">
      <div className="rv-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`rv-star ${star <= rating ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="rv-rating-num">{rating}/5</span>
    </div>
  );

  return (
    <div className="rv-dashboard-wrapper">
      {/* HEADER */}
      <div className="rv-header">
        <div>
          <span className="rv-badge-overview">Overview</span>
          <h1 className="rv-title">Product Reviews</h1>
          <p className="rv-subtitle">
            Audit, verify, and filter public-facing feedback to safeguard experience standards.
          </p>
        </div>
        <button
          type="button"
          className="rv-refresh-btn"
          onClick={loadReviews}
          disabled={loading}
        >
          <span className="rv-refresh-icon">↻</span> Refresh Records
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="rv-cards-grid">
        <div
          className={`rv-card ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          <div className="rv-card-body">
            <span className="rv-card-label">TOTAL SUBMISSIONS</span>
            <span className="rv-card-count total">{counts.all}</span>
          </div>
          <div className="rv-card-icon icon-total">💬</div>
        </div>

        <div
          className={`rv-card ${filter === "PENDING" ? "active" : ""}`}
          onClick={() => setFilter("PENDING")}
        >
          <div className="rv-card-body">
            <span className="rv-card-label">PENDING REVIEW</span>
            <span className="rv-card-count pending">{counts.pending}</span>
          </div>
          <div className="rv-card-icon icon-pending">⏳</div>
        </div>

        <div
          className={`rv-card ${filter === "APPROVED" ? "active" : ""}`}
          onClick={() => setFilter("APPROVED")}
        >
          <div className="rv-card-body">
            <span className="rv-card-label">PUBLISHED</span>
            <span className="rv-card-count approved">{counts.approved}</span>
          </div>
          <div className="rv-card-icon icon-approved">✓</div>
        </div>

        <div
          className={`rv-card ${filter === "REJECTED" ? "active" : ""}`}
          onClick={() => setFilter("REJECTED")}
        >
          <div className="rv-card-body">
            <span className="rv-card-label">REJECTED</span>
            <span className="rv-card-count rejected">{counts.rejected}</span>
          </div>
          <div className="rv-card-icon icon-rejected">✕</div>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="rv-filter-bar">
        <button
          type="button"
          className={`rv-filter-btn ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          All Feedback <span className="rv-pill">{counts.all}</span>
        </button>
        <button
          type="button"
          className={`rv-filter-btn ${filter === "PENDING" ? "active" : ""}`}
          onClick={() => setFilter("PENDING")}
        >
          Pending Approval <span className="rv-pill pending">{counts.pending}</span>
        </button>
        <button
          type="button"
          className={`rv-filter-btn ${filter === "APPROVED" ? "active" : ""}`}
          onClick={() => setFilter("APPROVED")}
        >
          Published <span className="rv-pill approved">{counts.approved}</span>
        </button>
        <button
          type="button"
          className={`rv-filter-btn ${filter === "REJECTED" ? "active" : ""}`}
          onClick={() => setFilter("REJECTED")}
        >
          Rejected <span className="rv-pill rejected">{counts.rejected}</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="rv-table-container">
        {loading ? (
          <div className="rv-table-loader">
            <div className="rv-spinner" />
            <p>Loading moderation records...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rv-empty-state">
            <span className="rv-empty-icon">📂</span>
            <h3>No reviews located</h3>
            <p>No results match the selection filter criteria.</p>
          </div>
        ) : (
          <div className="rv-table-scroll">
            <table className="rv-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>SATISFACTION</th>
                  <th>REVIEW CONTENT</th>
                  <th>PURCHASE</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th className="rv-actions-head">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review._id}>
                    {/* Customer */}
                    <td>
                      <div className="rv-customer-cell">
                        <div className="rv-avatar">
                          {(review.user?.firstName || "U")[0].toUpperCase()}
                        </div>
                        <div className="rv-customer-details">
                          <span className="rv-name">
                            {review.user?.firstName || "Customer"}{" "}
                            {review.user?.lastName || ""}
                          </span>
                          <span className="rv-email">{review.user?.email || "No email"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td>
                      <span className="rv-product-name" title={review.product?.name}>
                        {review.product?.name || "Product Unavailable"}
                      </span>
                    </td>

                    {/* Rating */}
                    <td>{renderStars(review.rating)}</td>

                    {/* Comment */}
                    <td>
                      <div className="rv-comment-box">
                        <p className="rv-comment-text" title={review.comment}>
                          {review.comment}
                        </p>
                        {review.rejectionReason && (
                          <span className="rv-rejection-note" title={review.rejectionReason}>
                            Denied: {review.rejectionReason}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Purchase */}
                    <td>
                      {review.verifiedPurchase ? (
                        <span className="rv-verified-badge valid">
                          <span className="rv-dot" /> Verified
                        </span>
                      ) : (
                        <span className="rv-verified-badge unverified">
                          <span className="rv-dot" /> Unverified
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`rv-status-badge ${String(review.status || "").toLowerCase()}`}>
                        {review.status || "PENDING"}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="rv-date">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="rv-action-buttons">
                        {review.status !== "APPROVED" && (
                          <button
                            type="button"
                            className="rv-btn-action approve"
                            disabled={actionLoading === review._id}
                            onClick={() => handleApprove(review._id)}
                            title="Approve Review"
                          >
                            ✓
                          </button>
                        )}
                        {review.status !== "REJECTED" && (
                          <button
                            type="button"
                            className="rv-btn-action reject"
                            disabled={actionLoading === review._id}
                            onClick={() => openRejectModal(review)}
                            title="Reject Review"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="rv-modal-overlay" onClick={closeRejectModal}>
          <div className="rv-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="rv-modal-header">
              <div>
                <h2>Reject Review</h2>
                <p>Provide a clear reason for rejecting this customer review.</p>
              </div>
              <button type="button" className="rv-modal-close" onClick={closeRejectModal}>
                ×
              </button>
            </div>

            <div className="rv-modal-body">
              <label htmlFor="rejectionReasonText" className="rv-label">Reason for Rejection</label>
              <textarea
                id="rejectionReasonText"
                className="rv-textarea"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Inappropriate language, spam submission, irrelevant feedback..."
                maxLength={500}
                rows={4}
              />
              <span className="rv-char-count">{rejectionReason.length}/500</span>
            </div>

            <div className="rv-modal-footer">
              <button type="button" className="rv-btn-cancel" onClick={closeRejectModal}>
                Cancel
              </button>
              <button
                type="button"
                className="rv-btn-confirm-reject"
                disabled={actionLoading === rejectModal._id}
                onClick={handleReject}
              >
                {actionLoading === rejectModal._id ? "Rejecting..." : "Reject Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;