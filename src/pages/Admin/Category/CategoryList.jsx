

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   getCategories,
//   updateCategory,
//   deleteCategory,
// } from "../../../services/categoryService";

// import "./CategoryList.css";

// // ======================================================
// // API URL
// // ======================================================

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000";

// const API_ORIGIN = API_URL
//   .replace(/\/api\/?$/i, "")
//   .replace(/\/$/, "");

// // ======================================================
// // HELPERS
// // ======================================================

// const extractCategories = (payload) => {
//   if (Array.isArray(payload)) return payload;

//   if (Array.isArray(payload?.categories)) {
//     return payload.categories;
//   }

//   if (Array.isArray(payload?.data)) {
//     return payload.data;
//   }

//   if (Array.isArray(payload?.data?.categories)) {
//     return payload.data.categories;
//   }

//   return [];
// };

// const errorMessage = (error, fallback) => {
//   return (
//     error?.response?.data?.message ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// };

// const imageUrl = (path, version = "") => {
//   if (!path || typeof path !== "string") {
//     return "";
//   }

//   const raw = path.replace(/\\/g, "/");

//   const url = /^(https?:|data:|blob:)/i.test(raw)
//     ? raw
//     : `${API_ORIGIN}/${raw.replace(/^\/+/, "")}`;

//   if (!version || /^(data:|blob:)/i.test(url)) {
//     return url;
//   }

//   return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
//     version
//   )}`;
// };

// const getParentId = (category) => {
//   const parent = category?.parentCategory;

//   if (!parent) return "";

//   if (typeof parent === "object") {
//     return String(parent._id || "");
//   }

//   return String(parent);
// };

// // ======================================================
// // CATEGORY LIST COMPONENT
// // ======================================================

// export default function CategoryList() {
//   // ----------------------------------------------------
//   // LIST STATES
//   // ----------------------------------------------------

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [notice, setNotice] = useState("");

//   // ----------------------------------------------------
//   // EDIT STATES
//   // ----------------------------------------------------

//   const [editingCategory, setEditingCategory] =
//     useState(null);

//   const [editName, setEditName] = useState("");
//   const [editDescription, setEditDescription] =
//     useState("");
//   const [editParentId, setEditParentId] =
//     useState("");
//   const [editStatus, setEditStatus] =
//     useState("ACTIVE");

//   const [editImage, setEditImage] = useState(null);
//   const [imagePreview, setImagePreview] =
//     useState("");

//   const [saving, setSaving] = useState(false);
//   const [deletingId, setDeletingId] =
//     useState(null);

//   const [imageVersions, setImageVersions] =
//     useState({});

//   // ====================================================
//   // FETCH CATEGORIES
//   // ====================================================

//   const fetchCategories = useCallback(
//     async (initial = false) => {
//       try {
//         if (initial) {
//           setLoading(true);
//         }

//         setError("");

//         const response = await getCategories();

//         if (response?.data?.success === false) {
//           throw new Error(
//             response.data.message ||
//               "Unable to load categories."
//           );
//         }

//         const list = extractCategories(
//           response.data
//         );

//         setCategories(list);
//       } catch (err) {
//         console.error(
//           "CATEGORY LIST ERROR:",
//           err
//         );

//         setError(
//           errorMessage(
//             err,
//             "Unable to load categories."
//           )
//         );
//       } finally {
//         if (initial) {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   useEffect(() => {
//     fetchCategories(true);
//   }, [fetchCategories]);

//   // ====================================================
//   // IMAGE PREVIEW
//   // ====================================================

//   useEffect(() => {
//     if (!(editImage instanceof File)) {
//       setImagePreview("");
//       return;
//     }

//     const objectUrl =
//       URL.createObjectURL(editImage);

//     setImagePreview(objectUrl);

//     return () => {
//       URL.revokeObjectURL(objectUrl);
//     };
//   }, [editImage]);

//   // ====================================================
//   // GET PARENT NAME
//   // ====================================================

//   const getParentName = (category) => {
//     const parent = category?.parentCategory;

//     if (!parent) return "—";

//     if (typeof parent === "object") {
//       return parent.name || "—";
//     }

//     const found = categories.find(
//       (item) =>
//         String(item._id) === String(parent)
//     );

//     return found?.name || "—";
//   };

//   // ====================================================
//   // SEARCH FILTER
//   // ====================================================

//   const filteredCategories = useMemo(() => {
//     const term = search
//       .trim()
//       .toLowerCase();

//     if (!term) return categories;

//     return categories.filter((category) => {
//       const parentName =
//         getParentName(category);

//       const searchableValues = [
//         category.name,
//         category.description,
//         parentName,
//         getParentId(category),
//         category.status,
//       ];

//       return searchableValues.some((value) =>
//         String(value || "")
//           .toLowerCase()
//           .includes(term)
//       );
//     });
//   }, [categories, search]);

//   // ====================================================
//   // OPEN EDIT MODAL
//   // ====================================================

//   const openEdit = (category) => {
//     setNotice("");

//     setEditingCategory(category);
//     setEditName(category.name || "");
//     setEditDescription(
//       category.description || ""
//     );
//     setEditParentId(
//       getParentId(category)
//     );
//     setEditStatus(
//       category.status || "ACTIVE"
//     );

//     setEditImage(null);
//     setImagePreview("");
//   };

//   // ====================================================
//   // CLOSE EDIT MODAL
//   // ====================================================

//   const cancelEdit = () => {
//     if (saving) return;

//     setEditingCategory(null);
//     setEditName("");
//     setEditDescription("");
//     setEditParentId("");
//     setEditStatus("ACTIVE");
//     setEditImage(null);
//     setImagePreview("");
//   };

//   // ====================================================
//   // IMAGE SELECTION
//   // ====================================================

//   const handleImageChange = (event) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) {
//       setEditImage(null);
//       return;
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       window.alert(
//         "Only JPG, JPEG, PNG and WEBP images are allowed."
//       );

//       event.target.value = "";
//       setEditImage(null);
//       return;
//     }

//     const maxSize = 10 * 1024 * 1024;

//     if (file.size > maxSize) {
//       window.alert(
//         "Image size must be 10 MB or less."
//       );

//       event.target.value = "";
//       setEditImage(null);
//       return;
//     }

//     setEditImage(file);
//   };

//   // ====================================================
//   // UPDATE CATEGORY
//   // ====================================================

//   const handleUpdate = async (event) => {
//     event.preventDefault();

//     if (!editingCategory?._id || saving) {
//       return;
//     }

//     if (!editName.trim()) {
//       window.alert(
//         "Category name is required."
//       );
//       return;
//     }

//     if (
//       editParentId ===
//       String(editingCategory._id)
//     ) {
//       window.alert(
//         "A category cannot be its own parent."
//       );
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");
//       setNotice("");

//       // ----------------------------------------------
//       // FORM DATA
//       // ----------------------------------------------

//       const formData = new FormData();

//       formData.append(
//         "name",
//         editName.trim()
//       );

//       formData.append(
//         "description",
//         editDescription.trim()
//       );

//       formData.append(
//         "status",
//         editStatus
//       );

//       // Only send parent when changed.
//       if (
//         editParentId !==
//         getParentId(editingCategory)
//       ) {
//         formData.append(
//           "parentCategory",
//           editParentId
//         );
//       }

//       // IMPORTANT:
//       // Send only actual File objects.
//       if (editImage instanceof File) {
//         formData.append(
//           "image",
//           editImage,
//           editImage.name
//         );
//       }

//       // ----------------------------------------------
//       // DEBUG REQUEST
//       // ----------------------------------------------

//       console.log(
//         "CATEGORY UPDATE ID:",
//         editingCategory._id
//       );

//       for (const [key, value] of formData.entries()) {
//         console.log(
//           "CATEGORY FORM FIELD:",
//           key,
//           value
//         );
//       }

//       // ----------------------------------------------
//       // API REQUEST
//       // ----------------------------------------------

//       const response = await updateCategory(
//         editingCategory._id,
//         formData
//       );

//       if (
//         response?.data?.success === false
//       ) {
//         throw new Error(
//           response.data.message ||
//             "Unable to update category."
//         );
//       }

//       const saved =
//         response?.data?.data;

//       // ----------------------------------------------
//       // VERIFY IMAGE UPDATE
//       // ----------------------------------------------

//       if (editImage instanceof File) {
//         if (!saved?.image) {
//           throw new Error(
//             "Image was not saved. Backend did not return an image path."
//           );
//         }

//         if (
//           saved.image ===
//           editingCategory.image
//         ) {
//           throw new Error(
//             "Backend returned the old image path. Check req.file and multipart upload."
//           );
//         }
//       }

//       // ----------------------------------------------
//       // REFRESH IMAGE CACHE
//       // ----------------------------------------------

//       setImageVersions((previous) => ({
//         ...previous,
//         [editingCategory._id]:
//           Date.now(),
//       }));

//       setNotice(
//         "Category updated successfully."
//       );

//       setEditingCategory(null);
//       setEditImage(null);
//       setImagePreview("");

//       await fetchCategories();
//     } catch (err) {
//       console.error(
//         "CATEGORY UPDATE ERROR:",
//         err?.response?.data || err
//       );

//       window.alert(
//         errorMessage(
//           err,
//           "Unable to update category."
//         )
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ====================================================
//   // DELETE CATEGORY
//   // ====================================================

//   const handleDelete = async (category) => {
//     if (
//       !category?._id ||
//       deletingId
//     ) {
//       return;
//     }

//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete "${category.name}"?`
//       );

//     if (!confirmed) return;

//     try {
//       setDeletingId(category._id);
//       setNotice("");

//       const response =
//         await deleteCategory(
//           category._id
//         );

//       if (
//         response?.data?.success === false
//       ) {
//         throw new Error(
//           response.data.message ||
//             "Unable to delete category."
//         );
//       }

//       setCategories((previous) =>
//         previous.filter(
//           (item) =>
//             String(item._id) !==
//             String(category._id)
//         )
//       );

//       setNotice(
//         "Category deleted successfully."
//       );
//     } catch (err) {
//       console.error(
//         "CATEGORY DELETE ERROR:",
//         err
//       );

//       window.alert(
//         errorMessage(
//           err,
//           "Unable to delete category."
//         )
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // ====================================================
//   // LOADING
//   // ====================================================

//   if (loading) {
//     return (
//       <div className="category-list-page">
//         <div className="category-loading">
//           Loading categories...
//         </div>
//       </div>
//     );
//   }

//   // ====================================================
//   // JSX
//   // ====================================================

//   return (
//     <div className="category-list-page">

//       {/* ============================================= */}
//       {/* HEADER */}
//       {/* ============================================= */}

//       <div className="category-list-header">
//         <div>
//           <h1>Categories</h1>

//           <p>
//             Manage parent categories and
//             subcategories.
//           </p>
//         </div>

//         <div className="category-header-actions">
//           <button
//             type="button"
//             className="refresh-category-btn"
//             onClick={() => fetchCategories()}
//           >
//             ↻ Refresh
//           </button>
//         </div>
//       </div>

//       {/* ============================================= */}
//       {/* MESSAGES */}
//       {/* ============================================= */}

//       {error && (
//         <div
//           className="category-error"
//           role="alert"
//         >
//           {error}
//         </div>
//       )}

//       {notice && (
//         <p role="status">
//           {notice}
//         </p>
//       )}

//       {/* ============================================= */}
//       {/* SEARCH */}
//       {/* ============================================= */}

//       <div className="category-toolbar">
//         <input
//           type="search"
//           placeholder="Search category, subcategory or parent..."
//           value={search}
//           onChange={(event) =>
//             setSearch(event.target.value)
//           }
//         />

//         <span>
//           {filteredCategories.length}{" "}
//           {filteredCategories.length === 1
//             ? "category"
//             : "categories"}
//         </span>
//       </div>

//       {/* ============================================= */}
//       {/* EMPTY STATE */}
//       {/* ============================================= */}

//       {!error &&
//         filteredCategories.length === 0 && (
//           <div className="category-empty">
//             <div>📂</div>

//             <h2>
//               No Categories Found
//             </h2>

//             <p>
//               Create a category first,
//               or change your search.
//             </p>
//           </div>
//         )}

//       {/* ============================================= */}
//       {/* CATEGORY TABLE */}
//       {/* ============================================= */}

//       {filteredCategories.length > 0 && (
//         <div className="category-table-wrapper">
//           <table className="category-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Image</th>
//                 <th>Category Name</th>
//                 <th>Type</th>
//                 <th>Parent Category</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredCategories.map(
//                 (category, index) => {
//                   const isSubcategory =
//                     Boolean(
//                       getParentId(category)
//                     );

//                   const currentImage =
//                     imageUrl(
//                       category.image,
//                       imageVersions[
//                         category._id
//                       ] ||
//                         category.updatedAt
//                     );

//                   return (
//                     <tr key={category._id}>
//                       <td>
//                         {index + 1}
//                       </td>

//                       {/* IMAGE */}

//                       <td>
//                         {currentImage ? (
//                           <img
//                             src={currentImage}
//                             alt={
//                               category.name
//                             }
//                             className="category-table-image"
//                             onError={(event) => {
//                               event.currentTarget.style.display =
//                                 "none";
//                             }}
//                           />
//                         ) : (
//                           <div className="category-no-image">
//                             📁
//                           </div>
//                         )}
//                       </td>

//                       {/* NAME */}

//                       <td>
//                         <div className="category-name-cell">
//                           {isSubcategory && (
//                             <span className="subcategory-line">
//                               ↳
//                             </span>
//                           )}

//                           <strong>
//                             {category.name}
//                           </strong>
//                         </div>
//                       </td>

//                       {/* TYPE */}

//                       <td>
//                         <span
//                           className={`category-type ${
//                             isSubcategory
//                               ? "sub"
//                               : "parent"
//                           }`}
//                         >
//                           {isSubcategory
//                             ? "Subcategory"
//                             : "Parent"}
//                         </span>
//                       </td>

//                       {/* PARENT */}

//                       <td>
//                         {isSubcategory ? (
//                           <span className="parent-category-name">
//                             {getParentName(
//                               category
//                             )}
//                           </span>
//                         ) : (
//                           <span className="no-parent">
//                             —
//                           </span>
//                         )}
//                       </td>

//                       {/* DESCRIPTION */}

//                       <td>
//                         <span className="category-description">
//                           {category.description ||
//                             "—"}
//                         </span>
//                       </td>

//                       {/* STATUS */}

//                       <td>
//                         <span
//                           className={`category-status ${String(
//                             category.status ||
//                               "ACTIVE"
//                           ).toLowerCase()}`}
//                         >
//                           {category.status ||
//                             "ACTIVE"}
//                         </span>
//                       </td>

//                       {/* ACTIONS */}

//                       <td>
//                         <div className="category-actions">
//                           <button
//                             type="button"
//                             className="edit-category-btn"
//                             onClick={() =>
//                               openEdit(category)
//                             }
//                           >
//                             Edit
//                           </button>

//                           <button
//                             type="button"
//                             className="delete-category-btn"
//                             disabled={
//                               deletingId ===
//                               category._id
//                             }
//                             onClick={() =>
//                               handleDelete(
//                                 category
//                               )
//                             }
//                           >
//                             {deletingId ===
//                             category._id
//                               ? "Deleting..."
//                               : "Delete"}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 }
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ============================================= */}
//       {/* EDIT MODAL */}
//       {/* ============================================= */}

//       {editingCategory && (
//         <div
//           className="category-modal-overlay"
//           role="presentation"
//           onMouseDown={(event) => {
//             if (
//               event.target ===
//               event.currentTarget
//             ) {
//               cancelEdit();
//             }
//           }}
//         >
//           <form
//             className="category-modal"
//             onSubmit={handleUpdate}
//             role="dialog"
//             aria-modal="true"
//             aria-label="Edit Category"
//           >
//             {/* MODAL HEADER */}

//             <div className="category-modal-header">
//               <div>
//                 <h2>
//                   Edit Category
//                 </h2>

//                 <p>
//                   Update category information
//                   and image.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 disabled={saving}
//                 onClick={cancelEdit}
//               >
//                 ×
//               </button>
//             </div>

//             {/* MODAL BODY */}

//             <div className="category-modal-body">

//               {/* NAME */}

//               <div className="category-form-group">
//                 <label htmlFor="category-edit-name">
//                   Category Name *
//                 </label>

//                 <input
//                   id="category-edit-name"
//                   required
//                   value={editName}
//                   onChange={(event) =>
//                     setEditName(
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               {/* DESCRIPTION */}

//               <div className="category-form-group">
//                 <label htmlFor="category-edit-description">
//                   Description
//                 </label>

//                 <textarea
//                   id="category-edit-description"
//                   rows={4}
//                   value={editDescription}
//                   onChange={(event) =>
//                     setEditDescription(
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               {/* PARENT CATEGORY */}

//               <div className="category-form-group">
//                 <label htmlFor="category-edit-parent">
//                   Parent Category
//                 </label>

//                 <select
//                   id="category-edit-parent"
//                   value={editParentId}
//                   onChange={(event) =>
//                     setEditParentId(
//                       event.target.value
//                     )
//                   }
//                 >
//                   <option value="">
//                     No parent (main category)
//                   </option>

//                   {categories
//                     .filter(
//                       (category) =>
//                         String(
//                           category._id
//                         ) !==
//                           String(
//                             editingCategory._id
//                           ) &&
//                         !getParentId(category)
//                     )
//                     .map((category) => (
//                       <option
//                         key={category._id}
//                         value={category._id}
//                       >
//                         {category.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>

//               {/* STATUS */}

//               <div className="category-form-group">
//                 <label htmlFor="category-edit-status">
//                   Status
//                 </label>

//                 <select
//                   id="category-edit-status"
//                   value={editStatus}
//                   onChange={(event) =>
//                     setEditStatus(
//                       event.target.value
//                     )
//                   }
//                 >
//                   <option value="ACTIVE">
//                     ACTIVE
//                   </option>

//                   <option value="INACTIVE">
//                     INACTIVE
//                   </option>
//                 </select>
//               </div>

//               {/* IMAGE */}

//               <div className="category-form-group">
//                 <label htmlFor="category-edit-image">
//                   Replace Image (optional)
//                 </label>

//                 <input
//                   id="category-edit-image"
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp"
//                   onChange={
//                     handleImageChange
//                   }
//                 />

//                 <div
//                   style={{
//                     marginTop: 10,
//                   }}
//                 >
//                   {(imagePreview ||
//                     editingCategory.image) && (
//                     <img
//                       src={
//                         imagePreview ||
//                         imageUrl(
//                           editingCategory.image,
//                           imageVersions[
//                             editingCategory._id
//                           ] ||
//                             editingCategory.updatedAt
//                         )
//                       }
//                       alt="Category preview"
//                       style={{
//                         width: 130,
//                         height: 110,
//                         objectFit: "cover",
//                         borderRadius: 8,
//                       }}
//                     />
//                   )}

//                   {editImage && (
//                     <p
//                       style={{
//                         fontSize: 12,
//                       }}
//                     >
//                       New image:{" "}
//                       {editImage.name}
//                     </p>
//                   )}

//                   {!editImage &&
//                     editingCategory.image && (
//                       <p
//                         style={{
//                           fontSize: 12,
//                         }}
//                       >
//                         Current image
//                         (choose a file to
//                         replace it)
//                       </p>
//                     )}
//                 </div>
//               </div>
//             </div>

//             {/* MODAL FOOTER */}

//             <div className="category-modal-footer">
//               <button
//                 type="button"
//                 className="modal-cancel-btn"
//                 disabled={saving}
//                 onClick={cancelEdit}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="modal-save-btn"
//                 disabled={saving}
//               >
//                 {saving
//                   ? "Saving..."
//                   : "Save Changes"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }


import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

import "./CategoryList.css";

// ======================================================
// API URL & HELPERS
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_ORIGIN = API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/$/, "");

const extractCategories = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.categories)) return payload.data.categories;
  return [];
};

const errorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const imageUrl = (path, version = "") => {
  if (!path || typeof path !== "string") return "";
  const raw = path.replace(/\\/g, "/");
  const url = /^(https?:|data:|blob:)/i.test(raw)
    ? raw
    : `${API_ORIGIN}/${raw.replace(/^\/+/, "")}`;

  if (!version || /^(data:|blob:)/i.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}`;
};

const getParentId = (category) => {
  const parent = category?.parentCategory;
  if (!parent) return "";
  if (typeof parent === "object") {
    return String(parent._id || "");
  }
  return String(parent);
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // Hover preview state
  const [hoveredId, setHoveredId] = useState(null);

  // Edit states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editParentId, setEditParentId] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imageVersions, setImageVersions] = useState({});

  // ====================================================
  // FETCH CATEGORIES
  // ====================================================

  const fetchCategories = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true);
      setError("");

      const response = await getCategories();
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Unable to load categories.");
      }

      const list = extractCategories(response.data);
      setCategories(list);
    } catch (err) {
      console.error("CATEGORY LIST ERROR:", err);
      setError(errorMessage(err, "Unable to load categories."));
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // Image Preview Cleanup
  useEffect(() => {
    if (!(editImage instanceof File)) {
      setImagePreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(editImage);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editImage]);

  const getParentName = (category) => {
    const parent = category?.parentCategory;
    if (!parent) return "—";
    if (typeof parent === "object") return parent.name || "—";
    const found = categories.find((item) => String(item._id) === String(parent));
    return found?.name || "—";
  };

  // Search Filter
  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((category) => {
      const parentName = getParentName(category);
      const searchableValues = [
        category.name,
        category.description,
        parentName,
        getParentId(category),
        category.status,
      ];
      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(term)
      );
    });
  }, [categories, search]);

  // ====================================================
  // MODAL ACTIONS
  // ====================================================

  const openEdit = (category) => {
    setNotice("");
    setEditingCategory(category);
    setEditName(category.name || "");
    setEditDescription(category.description || "");
    setEditParentId(getParentId(category));
    setEditStatus(category.status || "ACTIVE");
    setEditImage(null);
    setImagePreview("");
  };

  const cancelEdit = () => {
    if (saving) return;
    setEditingCategory(null);
    setEditName("");
    setEditDescription("");
    setEditParentId("");
    setEditStatus("ACTIVE");
    setEditImage(null);
    setImagePreview("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setEditImage(null);
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      window.alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
      event.target.value = "";
      setEditImage(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      window.alert("Image size must be 10 MB or less.");
      event.target.value = "";
      setEditImage(null);
      return;
    }
    setEditImage(file);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingCategory?._id || saving) return;
    if (!editName.trim()) {
      window.alert("Category name is required.");
      return;
    }
    if (editParentId === String(editingCategory._id)) {
      window.alert("A category cannot be its own parent.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const formData = new FormData();
      formData.append("name", editName.trim());
      formData.append("description", editDescription.trim());
      formData.append("status", editStatus);

      if (editParentId !== getParentId(editingCategory)) {
        formData.append("parentCategory", editParentId);
      }

      if (editImage instanceof File) {
        formData.append("image", editImage, editImage.name);
      }

      const response = await updateCategory(editingCategory._id, formData);
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Unable to update category.");
      }

      const saved = response?.data?.data;
      if (editImage instanceof File) {
        if (!saved?.image) {
          throw new Error("Image was not saved. Backend did not return an image path.");
        }
      }

      setImageVersions((prev) => ({
        ...prev,
        [editingCategory._id]: Date.now(),
      }));

      setNotice("Category updated successfully.");
      setEditingCategory(null);
      setEditImage(null);
      setImagePreview("");
      await fetchCategories();
    } catch (err) {
      console.error("CATEGORY UPDATE ERROR:", err?.response?.data || err);
      window.alert(errorMessage(err, "Unable to update category."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!category?._id || deletingId) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${category.name}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(category._id);
      setNotice("");

      const response = await deleteCategory(category._id);
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Unable to delete category.");
      }

      setCategories((prev) => prev.filter((item) => String(item._id) !== String(category._id)));
      setNotice("Category deleted successfully.");
    } catch (err) {
      console.error("CATEGORY DELETE ERROR:", err);
      window.alert(errorMessage(err, "Unable to delete category."));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="category-list-page">
        <div className="category-loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="category-list-page">
      {/* HEADER */}
      <div className="category-list-header">
        <div>
          <h1>Categories</h1>
          <p>Manage parent categories, subcategories, and hierarchy.</p>
        </div>
        <div className="category-header-actions">
          <button
            type="button"
            className="refresh-category-btn"
            onClick={() => fetchCategories()}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="category-error" role="alert">
          {error}
        </div>
      )}
      {notice && <p role="status">{notice}</p>}

      {/* SEARCH TOOLBAR */}
      <div className="category-toolbar">
        <input
          type="search"
          placeholder="Search category, subcategory or parent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>
          {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}
        </span>
      </div>

      {/* EMPTY STATE */}
      {!error && filteredCategories.length === 0 && (
        <div className="category-empty">
          <div>📂</div>
          <h2>No Categories Found</h2>
          <p>Try refining your search term or add a new category.</p>
        </div>
      )}

      {/* CATEGORY TABLE */}
      {filteredCategories.length > 0 && (
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Category Name</th>
                <th>Type</th>
                <th>Parent Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => {
                const isSubcategory = Boolean(getParentId(category));
                const currentImage = imageUrl(
                  category.image,
                  imageVersions[category._id] || category.updatedAt
                );
                const parentName = getParentName(category);
                const isHovered = hoveredId === category._id;

                return (
                  <tr
                    key={category._id}
                    onMouseEnter={() => setHoveredId(category._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <td>{index + 1}</td>

                    {/* IMAGE */}
                    <td>
                      {currentImage ? (
                        <img
                          src={currentImage}
                          alt={category.name}
                          className="category-table-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="category-no-image">📁</div>
                      )}
                    </td>

                    {/* NAME + HOVER PREVIEW POPUP */}
                    <td className="category-name-cell">
                      {isSubcategory && <span className="subcategory-line">↳</span>}
                      <strong>{category.name}</strong>

                      {/* DETAIL HOVER POPUP */}
                      {isHovered && (
                        <div className="category-hover-preview">
                          <div className="preview-card-header">
                            {currentImage ? (
                              <img
                                src={currentImage}
                                alt={category.name}
                                className="preview-thumb"
                              />
                            ) : (
                              <div className="category-no-image preview-thumb">📁</div>
                            )}
                            <div className="preview-title">
                              <h4>{category.name}</h4>
                              <span className="preview-type-tag">
                                {isSubcategory ? "Subcategory" : "Root Category"}
                              </span>
                            </div>
                          </div>

                          <div className="preview-card-body">
                            <p>
                              {category.description ||
                                "No description available for this category."}
                            </p>

                            <div className="preview-meta-grid">
                              <div className="preview-meta-item">
                                <span>Parent Category</span>
                                <strong>{isSubcategory ? parentName : "None (Root)"}</strong>
                              </div>
                              <div className="preview-meta-item">
                                <span>Status</span>
                                <strong
                                  style={{
                                    color:
                                      String(category.status).toUpperCase() === "ACTIVE"
                                        ? "#059669"
                                        : "#dc2626",
                                  }}
                                >
                                  {category.status || "ACTIVE"}
                                </strong>
                              </div>
                              <div className="preview-meta-item">
                                <span>ID Ref</span>
                                <strong>{category._id.slice(-6).toUpperCase()}</strong>
                              </div>
                              <div className="preview-meta-item">
                                <span>Last Updated</span>
                                <strong>
                                  {category.updatedAt
                                    ? new Date(category.updatedAt).toLocaleDateString()
                                    : "Recently"}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* TYPE */}
                    <td>
                      <span className={`category-type ${isSubcategory ? "sub" : "parent"}`}>
                        {isSubcategory ? "Subcategory" : "Parent"}
                      </span>
                    </td>

                    {/* PARENT */}
                    <td>
                      {isSubcategory ? (
                        <span className="parent-category-name">{parentName}</span>
                      ) : (
                        <span className="no-parent">—</span>
                      )}
                    </td>

                    {/* DESCRIPTION */}
                    <td>
                      <span className="category-description" title={category.description}>
                        {category.description || "—"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`category-status ${String(
                          category.status || "ACTIVE"
                        ).toLowerCase()}`}
                      >
                        {category.status || "ACTIVE"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="category-actions">
                        <button
                          type="button"
                          className="edit-category-btn"
                          onClick={() => openEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-category-btn"
                          disabled={deletingId === category._id}
                          onClick={() => handleDelete(category)}
                        >
                          {deletingId === category._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCategory && (
        <div
          className="category-modal-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cancelEdit();
          }}
        >
          <form
            className="category-modal"
            onSubmit={handleUpdate}
            role="dialog"
            aria-modal="true"
            aria-label="Edit Category"
          >
            <div className="category-modal-header">
              <div>
                <h2>Edit Category</h2>
                <p>Update category details and replace image.</p>
              </div>
              <button type="button" disabled={saving} onClick={cancelEdit}>
                ×
              </button>
            </div>

            <div className="category-modal-body">
              {/* NAME */}
              <div className="category-form-group">
                <label htmlFor="category-edit-name">Category Name *</label>
                <input
                  id="category-edit-name"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="category-form-group">
                <label htmlFor="category-edit-description">Description</label>
                <textarea
                  id="category-edit-description"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              {/* PARENT CATEGORY */}
              <div className="category-form-group">
                <label htmlFor="category-edit-parent">Parent Category</label>
                <select
                  id="category-edit-parent"
                  value={editParentId}
                  onChange={(e) => setEditParentId(e.target.value)}
                >
                  <option value="">No parent (main category)</option>
                  {categories
                    .filter(
                      (cat) =>
                        String(cat._id) !== String(editingCategory._id) && !getParentId(cat)
                    )
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* STATUS */}
              <div className="category-form-group">
                <label htmlFor="category-edit-status">Status</label>
                <select
                  id="category-edit-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {/* IMAGE UPLOAD */}
              <div className="category-form-group">
                <label htmlFor="category-edit-image">Replace Image (optional)</label>
                <input
                  id="category-edit-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <div className="modal-image-preview-box">
                  {(imagePreview || editingCategory.image) && (
                    <img
                      src={
                        imagePreview ||
                        imageUrl(
                          editingCategory.image,
                          imageVersions[editingCategory._id] || editingCategory.updatedAt
                        )
                      }
                      alt="Category preview"
                      className="modal-preview-img"
                    />
                  )}
                  {editImage ? (
                    <p className="image-help-text">New: {editImage.name}</p>
                  ) : editingCategory.image ? (
                    <p className="image-help-text">Current image stored</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="category-modal-footer">
              <button
                type="button"
                className="modal-cancel-btn"
                disabled={saving}
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button type="submit" className="modal-save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
