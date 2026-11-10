

import { useEffect, useState } from "react";
import {
  createCategory,
  getCategories,
} from "../../../services/categoryService";

import "./AddCategory.css";

function AddCategory() {

  // ==========================================
  // FORM
  // ==========================================

  const [category, setCategory] = useState({
    name: "",
    image: null,
    description: "",
    parentCategory: "",
  });


  // ==========================================
  // CATEGORY TYPE
  // ==========================================

  const [categoryType, setCategoryType] =
    useState("CATEGORY");


  // ==========================================
  // MAIN CATEGORIES
  // ==========================================

  const [categories, setCategories] =
    useState([]);


  const [loadingCategories, setLoadingCategories] =
    useState(false);


  // ==========================================
  // OTHER STATES
  // ==========================================

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });


  // ==========================================
  // LOAD MAIN CATEGORIES
  // ==========================================

  useEffect(() => {
    loadCategories();
  }, []);


  const loadCategories = async () => {

    try {

      setLoadingCategories(true);

      const response = await getCategories();

      console.log(
        "FULL CATEGORY API RESPONSE:",
        response
      );


      // ==========================================
      // IMPORTANT
      // Axios response se actual backend data
      // different structures se extract karenge
      // ==========================================

      let data = [];


      // ------------------------------------------
      // CASE 1
      // response.data = []
      // ------------------------------------------

      if (Array.isArray(response?.data)) {

        data = response.data;

      }


      // ------------------------------------------
      // CASE 2
      // response.data.categories = []
      // ------------------------------------------

      else if (
        Array.isArray(
          response?.data?.categories
        )
      ) {

        data =
          response.data.categories;

      }


      // ------------------------------------------
      // CASE 3
      // response.data.data = []
      // ------------------------------------------

      else if (
        Array.isArray(
          response?.data?.data
        )
      ) {

        data =
          response.data.data;

      }


      // ------------------------------------------
      // CASE 4
      // response.data.data.categories = []
      // ------------------------------------------

      else if (
        Array.isArray(
          response?.data?.data?.categories
        )
      ) {

        data =
          response.data.data.categories;

      }


      // ------------------------------------------
      // CASE 5
      // response.categories = []
      // ------------------------------------------

      else if (
        Array.isArray(
          response?.categories
        )
      ) {

        data =
          response.categories;

      }


      // ------------------------------------------
      // DEBUG
      // ------------------------------------------

      console.log(
        "ALL CATEGORIES:",
        data
      );


      // ==========================================
      // ONLY MAIN/PARENT CATEGORIES
      // ==========================================

      const mainCategories =
        data.filter((item) => {

          return (
            !item.parentCategory ||
            item.parentCategory === null ||
            item.parentCategory === ""
          );

        });


      console.log(
        "MAIN PARENT CATEGORIES:",
        mainCategories
      );


      setCategories(
        mainCategories
      );

    }

    catch (error) {

      console.error(
        "LOAD CATEGORY ERROR:",
        error
      );

      setCategories([]);

    }

    finally {

      setLoadingCategories(false);

    }

  };


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ==========================================
  // CATEGORY TYPE
  // ==========================================

  const handleTypeChange = (e) => {

    const value =
      e.target.value;

    setCategoryType(value);


    // ------------------------------------------
    // MAIN CATEGORY
    // ------------------------------------------

    if (value === "CATEGORY") {

      setCategory((prev) => ({
        ...prev,
        parentCategory: "",
      }));

    }

  };


  // ==========================================
  // IMAGE
  // ==========================================

  // const handleImageChange = (e) => {

  //   const file =
  //     e.target.files[0];

  //   if (!file) return;


  //   setCategory((prev) => ({
  //     ...prev,
  //     image: file,
  //   }));


  //   setPreview(
  //     URL.createObjectURL(file)
  //   );

  // };


  
const handleImageChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setCategory((prev) => ({
    ...prev,
    image: file,
  }));

  setPreview(URL.createObjectURL(file));
};

const handleRemoveImage = () => {
  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setCategory((prev) => ({
    ...prev,
    image: null,
  }));

  setPreview("");

  const input = document.getElementById("category-image-input");

  if (input) input.value = "";
};


  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  // const handleRemoveImage = () => {

  //   setCategory((prev) => ({
  //     ...prev,
  //     image: null,
  //   }));

  //   setPreview("");

  // };


  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {

    setCategory({
      name: "",
      image: null,
      description: "",
      parentCategory: "",
    });

    setCategoryType(
      "CATEGORY"
    );

    setPreview("");

    setMessage({
      type: "",
      text: "",
    });

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!category.name.trim()) {

      setMessage({
        type: "error",
        text: "Please enter a name.",
      });

      return;

    }


    if (
      categoryType === "SUBCATEGORY" &&
      !category.parentCategory
    ) {

      setMessage({
        type: "error",
        text:
          "Please select a parent category.",
      });

      return;

    }


    try {

      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });


      // ==========================================
      // FORM DATA
      // ==========================================

      const formData =
        new FormData();


      formData.append(
        "name",
        category.name.trim()
      );


      formData.append(
        "description",
        category.description || ""
      );


      // ==========================================
      // SUBCATEGORY
      // ==========================================

      if (
        categoryType === "SUBCATEGORY" &&
        category.parentCategory
      ) {

        formData.append(
          "parentCategory",
          category.parentCategory
        );

      }


      // ==========================================
      // IMAGE
      // ==========================================

      if (category.image) {

        formData.append(
          "image",
          category.image
        );

      }


      console.log(
        "SUBMIT DATA:",
        {
          name:
            category.name,

          type:
            categoryType,

          parentCategory:
            category.parentCategory ||
            null,
        }
      );


      // ==========================================
      // CREATE
      // ==========================================

      const response =
        await createCategory(
          formData
        );


      console.log(
        "CREATE CATEGORY RESPONSE:",
        response
      );


      // ==========================================
      // SUCCESS
      // ==========================================

      setMessage({
        type: "success",

        text:
          response?.data?.message ||
          (
            categoryType ===
            "SUBCATEGORY"

              ? "Subcategory created successfully!"

              : "Category created successfully!"
          ),
      });


      // ==========================================
      // RESET
      // ==========================================

      setCategory({
        name: "",
        image: null,
        description: "",
        parentCategory: "",
      });

      setCategoryType(
        "CATEGORY"
      );

      setPreview("");


      // Reset file input

      if (
        e.target
      ) {
        e.target.reset();
      }


      // ==========================================
      // REFRESH MAIN CATEGORIES
      // ==========================================

      await loadCategories();

    }

    catch (error) {

      console.error(
        "CREATE CATEGORY ERROR:",
        error
      );


      setMessage({
        type: "error",

        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to create category.",
      });

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="add-category-page">

      <div className="category-card">


        {/* ====================================
            HEADER
        ==================================== */}

        <div className="card-header">

          <h2>
            Add Category
          </h2>

          <p>
            Create a category or
            subcategory.
          </p>

        </div>


        {/* ====================================
            MESSAGE
        ==================================== */}

        {message.text && (

          <div
            className={`alert-box ${message.type}`}
          >

            {message.text}

          </div>

        )}


        {/* ====================================
            FORM
        ==================================== */}

        <form
          className="category-form"
          onSubmit={handleSubmit}
        >


          {/* ==================================
              CATEGORY TYPE
          ================================== */}

          <div className="form-group">

            <label>
              Category Type *
            </label>


            <select
              value={categoryType}
              onChange={handleTypeChange}
            >

              <option value="CATEGORY">
                Main Category
              </option>

              <option value="SUBCATEGORY">
                Subcategory
              </option>

            </select>

          </div>


          {/* ==================================
              PARENT CATEGORY
          ================================== */}

          {categoryType === "SUBCATEGORY" && (

            <div className="form-group">

              <label>
                Parent Category *
              </label>


              <select
                name="parentCategory"
                value={
                  category.parentCategory
                }
                onChange={handleChange}
                required
              >

                <option value="">

                  {loadingCategories
                    ? "Loading categories..."
                    : categories.length === 0
                    ? "No parent categories found"
                    : "Select Parent Category"}

                </option>


                {categories.map(
                  (item) => (

                    <option
                      key={item._id}
                      value={item._id}
                    >

                      {item.name}

                    </option>

                  )
                )}

              </select>


              {/* DEBUG INFO */}

              {!loadingCategories &&
                categories.length === 0 && (

                  <small
                    style={{
                      color: "red",
                      display: "block",
                      marginTop: "6px",
                    }}
                  >
                    No main categories available.
                    Create a Main Category first.
                  </small>

                )}

            </div>

          )}


          {/* ==================================
              NAME
          ================================== */}

          <div className="form-group">

            <label htmlFor="name">

              {categoryType ===
              "SUBCATEGORY"

                ? "Subcategory Name *"

                : "Category Name *"}

            </label>


            <input
              type="text"
              id="name"
              name="name"
              value={category.name}
              onChange={handleChange}
              placeholder={
                categoryType ===
                "SUBCATEGORY"

                  ? "e.g. Gaming Laptops"

                  : "e.g. Laptops"
              }
              required
            />

          </div>


          {/* ==================================
              IMAGE
          ================================== */}

          <div className="form-group">

            <label>

              {categoryType ===
              "SUBCATEGORY"

                ? "Subcategory Image"

                : "Category Image"}

            </label>


            <div className="file-upload-wrapper">

              <input
                type="file"
                id="category-image-input"
                accept="image/*"
                className="file-input"
                onChange={
                  handleImageChange
                }
              />


              <label
                htmlFor="category-image-input"
                className="file-upload-btn"
              >

                Choose Image File

              </label>


              <span className="file-name-display">

                {category.image
                  ? category.image.name
                  : "No file selected"}

              </span>

            </div>


            {preview && (

              <div className="preview-wrapper">

                <img
                  src={preview}
                  alt="Preview"
                  className="category-preview"
                />


                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={
                    handleRemoveImage
                  }
                >

                  Remove

                </button>

              </div>

            )}

          </div>


          {/* ==================================
              DESCRIPTION
          ================================== */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>


            <textarea
              id="description"
              name="description"
              rows="4"
              value={
                category.description
              }
              onChange={handleChange}
              placeholder={
                categoryType ===
                "SUBCATEGORY"

                  ? "Subcategory description..."

                  : "Category description..."
              }
            />

          </div>


          {/* ==================================
              BUTTONS
          ================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={
                handleReset
              }
              disabled={loading}
            >

              Reset

            </button>


            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >

              {loading

                ? "Saving..."

                : categoryType ===
                  "SUBCATEGORY"

                ? "Create Subcategory"

                : "Create Category"}

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}


export default AddCategory;





