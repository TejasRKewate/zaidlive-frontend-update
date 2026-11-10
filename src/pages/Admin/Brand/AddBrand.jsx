

// import { useEffect, useState } from "react";
// import { createBrand } from "../../../services/brandService";
// import { getCategories } from "../../../services/categoryService";
// import "./AddBrand.css";
// import { toast } from "react-toastify";

// function AddBrand() {
//   const [categories, setCategories] = useState([]);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const [brand, setBrand] = useState({
//     name: "",
//     logo: null,
//     description: "",
//     category: "",
//     status: "ACTIVE",
//   });

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       const res = await getCategories();

//       // Same API response handling
//       setCategories(res?.data?.data || res?.data || []);
//     } catch (error) {
//       console.error("Failed to load categories:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setBrand({
//       ...brand,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     // Optional image validation
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file.");
//       return;
//     }

//     // Revoke previous preview URL
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setBrand({
//       ...brand,
//       logo: file,
//     });

//     setPreview(URL.createObjectURL(file));
//   };

//   const handleRemoveLogo = () => {
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setBrand({
//       ...brand,
//       logo: null,
//     });

//     setPreview("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const formData = new FormData();

//       // SAME API PAYLOAD
//       formData.append("name", brand.name);
//       formData.append("description", brand.description);
//       formData.append("category", brand.category);
//       formData.append("status", brand.status);

//       if (brand.logo) {
//         formData.append("logo", brand.logo);
//       }

//       // SAME API SERVICE
//       const res = await createBrand(formData);

//       setMessage({
//         type: "success",
//         text: res.data?.message || "Brand created successfully!",
//       });

//       toast.success(
//         res.data?.message || "Brand created successfully!"
//       );

//       // Reset form
//       setBrand({
//         name: "",
//         logo: null,
//         description: "",
//         category: "",
//         status: "ACTIVE",
//       });

//       if (preview) {
//         URL.revokeObjectURL(preview);
//       }

//       setPreview("");

//       // Reset actual file input
//       e.target.reset();
//     } catch (error) {
//       console.error("Error creating brand:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         "Unable to create brand. Please try again.";

//       setMessage({
//         type: "error",
//         text: errorMessage,
//       });

//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setBrand({
//       name: "",
//       logo: null,
//       description: "",
//       category: "",
//       status: "ACTIVE",
//     });

//     setPreview("");
//     setMessage({ type: "", text: "" });
//   };

//   return (
//     <div className="abx-page">
//       <div className="abx-card">

//         {/* =========================
//             HEADER
//         ========================== */}
//         <div className="abx-header">
//           <div className="abx-header-content">
//             <div className="abx-header-icon">
//               <span>✦</span>
//             </div>

//             <div>
//               <h2 className="abx-title">Add New Brand</h2>

//               <p className="abx-subtitle">
//                 Register a brand and link it with an existing category.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* =========================
//             MESSAGE
//         ========================== */}
//         {message.text && (
//           <div
//             className={`abx-alert ${
//               message.type === "success"
//                 ? "abx-alert-success"
//                 : "abx-alert-error"
//             }`}
//           >
//             <span className="abx-alert-icon">
//               {message.type === "success" ? "✓" : "!"}
//             </span>

//             <span>{message.text}</span>
//           </div>
//         )}

//         {/* =========================
//             FORM
//         ========================== */}
//         <form onSubmit={handleSubmit} className="abx-form">

//           <div className="abx-form-grid">

//             {/* Brand Name */}
//             <div className="abx-field">
//               <label
//                 htmlFor="abx-brand-name"
//                 className="abx-label"
//               >
//                 Brand Name
//                 <span className="abx-required">*</span>
//               </label>

//               <input
//                 type="text"
//                 id="abx-brand-name"
//                 name="name"
//                 className="abx-input"
//                 placeholder="e.g. Samsung, Nike"
//                 value={brand.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Category */}
//             <div className="abx-field">
//               <label
//                 htmlFor="abx-brand-category"
//                 className="abx-label"
//               >
//                 Assigned Category
//                 <span className="abx-required">*</span>
//               </label>

//               <select
//                 id="abx-brand-category"
//                 name="category"
//                 className="abx-select"
//                 value={brand.category}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">
//                   Select Category
//                 </option>

//                 {categories.map((category) => (
//                   <option
//                     key={category._id}
//                     value={category._id}
//                   >
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Status */}
//             <div className="abx-field">
//               <label
//                 htmlFor="abx-brand-status"
//                 className="abx-label"
//               >
//                 Initial Status
//               </label>

//               <select
//                 id="abx-brand-status"
//                 name="status"
//                 className="abx-select"
//                 value={brand.status}
//                 onChange={handleChange}
//               >
//                 <option value="ACTIVE">
//                   ACTIVE
//                 </option>

//                 <option value="INACTIVE">
//                   INACTIVE
//                 </option>
//               </select>
//             </div>

//             {/* Logo */}
//             <div className="abx-field">
//               <label className="abx-label">
//                 Brand Logo
//               </label>

//               <div className="abx-upload-box">

//                 <input
//                   type="file"
//                   id="abx-logo-input"
//                   accept="image/*"
//                   onChange={handleLogoChange}
//                   className="abx-file-input"
//                 />

//                 <label
//                   htmlFor="abx-logo-input"
//                   className="abx-upload-button"
//                 >
//                   <span className="abx-upload-icon">
//                     ↑
//                   </span>

//                   <span>
//                     Choose Logo File
//                   </span>
//                 </label>

//                 <span className="abx-file-name">
//                   {brand.logo
//                     ? brand.logo.name
//                     : "No file selected"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* =========================
//               LOGO PREVIEW
//           ========================== */}
//           {preview && (
//             <div className="abx-preview-section">
//               <div className="abx-preview-heading">
//                 <span className="abx-preview-title">
//                   Logo Preview
//                 </span>

//                 <span className="abx-preview-hint">
//                   Selected image
//                 </span>
//               </div>

//               <div className="abx-preview-card">

//                 <div className="abx-image-container">
//                   <img
//                     src={preview}
//                     alt="Brand Logo Preview"
//                     className="abx-preview-image"
//                   />
//                 </div>

//                 <div className="abx-preview-info">
//                   <strong>
//                     {brand.logo?.name || "Brand Logo"}
//                   </strong>

//                   <span>
//                     Ready to upload
//                   </span>
//                 </div>

//                 <button
//                   type="button"
//                   className="abx-remove-button"
//                   onClick={handleRemoveLogo}
//                 >
//                   Remove Logo
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* =========================
//               DESCRIPTION
//           ========================== */}
//           <div className="abx-field abx-description-field">
//             <label
//               htmlFor="abx-brand-description"
//               className="abx-label"
//             >
//               Description
//             </label>

//             <textarea
//               id="abx-brand-description"
//               name="description"
//               rows="4"
//               className="abx-textarea"
//               placeholder="Enter a brief description for this brand..."
//               value={brand.description}
//               onChange={handleChange}
//             />
//           </div>

//           {/* =========================
//               FORM ACTIONS
//           ========================== */}
//           <div className="abx-actions">

//             <button
//               type="button"
//               className="abx-reset-button"
//               onClick={handleReset}
//               disabled={loading}
//             >
//               Reset
//             </button>

//             <button
//               type="submit"
//               className="abx-submit-button"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="abx-button-spinner" />
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <span>+</span>
//                   Create Brand
//                 </>
//               )}
//             </button>

//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddBrand;


import { useEffect, useState } from "react";
import { createBrand } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";
import "./AddBrand.css";
import { toast } from "react-toastify";

function AddBrand() {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [brand, setBrand] = useState({
    name: "",
    logo: null,
    description: "",
    category: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res?.data?.data || res?.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand((current) => ({ ...current, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setBrand((current) => ({ ...current, logo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setBrand((current) => ({ ...current, logo: null }));
    setPreview("");
  };

  const resetBrand = () => {
    setBrand({
      name: "",
      logo: null,
      description: "",
      category: "",
      status: "ACTIVE",
    });
    setPreview("");
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      formData.append("name", brand.name);
      formData.append("description", brand.description);
      formData.append("category", brand.category);
      formData.append("status", brand.status);

      if (brand.logo) {
        formData.append("logo", brand.logo);
      }

      const res = await createBrand(formData);
      const successMessage =
        res.data?.message || "Brand created successfully!";

      setMessage({ type: "success", text: successMessage });
      toast.success(successMessage);

      resetBrand();
      e.target.reset();
    } catch (error) {
      console.error("Error creating brand:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Unable to create brand. Please try again.";

      setMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetBrand();
    document.getElementById("abx-logo-input")?.value &&
      (document.getElementById("abx-logo-input").value = "");
  };

  return (
    <main className="abx-page">
      <section className="abx-card">
        <header className="abx-header">
          <div className="abx-header-content">
            <div className="abx-header-icon" aria-hidden="true">
              AB
            </div>

            <div className="abx-header-copy">
              <span className="abx-eyebrow">BRAND MANAGEMENT</span>
              <h1 className="abx-title">Create a brand</h1>
              <p className="abx-subtitle">
                Add brand details and assign it to a category.
              </p>
            </div>
          </div>
        </header>

        {message.text && (
          <div
            className={`abx-alert ${
              message.type === "success"
                ? "abx-alert-success"
                : "abx-alert-error"
            }`}
            role="status"
          >
            <span className="abx-alert-icon" aria-hidden="true">
              {message.type === "success" ? "✓" : "!"}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="abx-form">
          <div className="abx-section-heading">
            <div>
              <h2>Brand information</h2>
              <p>Enter the essential details for this brand.</p>
            </div>
            <span className="abx-required-note">
              <span aria-hidden="true">*</span> Required
            </span>
          </div>

          <div className="abx-form-grid">
            <div className="abx-field">
              <label htmlFor="abx-brand-name" className="abx-label">
                Brand name <span className="abx-required">*</span>
              </label>
              <input
                type="text"
                id="abx-brand-name"
                name="name"
                className="abx-input"
                placeholder="e.g. Acme Studio"
                value={brand.name}
                onChange={handleChange}
                autoComplete="organization"
                required
              />
              <span className="abx-field-hint">
                Use the official name customers recognize.
              </span>
            </div>

            <div className="abx-field">
              <label htmlFor="abx-brand-category" className="abx-label">
                Category <span className="abx-required">*</span>
              </label>
              <select
                id="abx-brand-category"
                name="category"
                className="abx-select"
                value={brand.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="abx-field-hint">
                Choose the category this brand belongs to.
              </span>
            </div>

            <div className="abx-field">
              <label htmlFor="abx-brand-status" className="abx-label">
                Status
              </label>
              <select
                id="abx-brand-status"
                name="status"
                className="abx-select"
                value={brand.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <span className="abx-field-hint">
                Inactive brands may not be available for use.
              </span>
            </div>

            <div className="abx-field">
              <label htmlFor="abx-logo-input" className="abx-label">
                Brand logo <span className="abx-optional">(Optional)</span>
              </label>

              <div className="abx-upload-box">
                <input
                  type="file"
                  id="abx-logo-input"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="abx-file-input"
                />

                <label htmlFor="abx-logo-input" className="abx-upload-button">
                  <span className="abx-upload-icon" aria-hidden="true">
                    ↑
                  </span>
                  <span>{brand.logo ? "Change logo" : "Upload logo"}</span>
                </label>

                <span className="abx-file-name">
                  {brand.logo ? brand.logo.name : "PNG, JPG or SVG"}
                </span>
              </div>
            </div>
          </div>

          {preview && (
            <section className="abx-preview-section" aria-label="Logo preview">
              <div className="abx-preview-heading">
                <div>
                  <h3 className="abx-preview-title">Logo preview</h3>
                  <p className="abx-preview-hint">
                    This is how the uploaded image will appear.
                  </p>
                </div>
                <button
                  type="button"
                  className="abx-remove-button"
                  onClick={handleRemoveLogo}
                >
                  Remove
                </button>
              </div>

              <div className="abx-preview-card">
                <div className="abx-image-container">
                  <img
                    src={preview}
                    alt="Brand logo preview"
                    className="abx-preview-image"
                  />
                </div>

                <div className="abx-preview-info">
                  <strong>{brand.logo?.name || "Brand logo"}</strong>
                  <span>Ready to upload</span>
                </div>
              </div>
            </section>
          )}

          <div className="abx-field abx-description-field">
            <label htmlFor="abx-brand-description" className="abx-label">
              Description <span className="abx-optional">(Optional)</span>
            </label>
            <textarea
              id="abx-brand-description"
              name="description"
              rows="4"
              className="abx-textarea"
              placeholder="Briefly describe this brand..."
              value={brand.description}
              onChange={handleChange}
            />
            <span className="abx-field-hint">
              Add a short description to help identify this brand.
            </span>
          </div>

          <footer className="abx-actions">
            <button
              type="button"
              className="abx-reset-button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            <button
              type="submit"
              className="abx-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="abx-button-spinner" aria-hidden="true" />
                  Creating…
                </>
              ) : (
                <>
                  <span aria-hidden="true">+</span>
                  Create brand
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}

export default AddBrand;