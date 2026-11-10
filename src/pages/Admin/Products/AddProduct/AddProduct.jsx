import { useEffect, useRef, useState } from "react";

import "./AddProduct.css";

import { createProduct } from "../../../../services/productService";
import { getCategories } from "../../../../services/categoryService";
import { getBrands } from "../../../../services/brandService";

import { toast } from "react-toastify";

const AddProduct = () => {
    // =====================================================
    // STATES
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const [subcategories, setSubcategories] = useState([]);

    const [brands, setBrands] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);

    const fileInputRef = useRef(null);

    // =====================================================
    // EMPTY OBJECTS
    // =====================================================

    const emptyRefurbishedDetails = {
        grade: "",
        batteryHealth: "",
        warrantyMonths: "",
        testingStatus: "",
    };

    const emptyRentalDetails = {
        isAvailableForRent: false,
        monthlyRent: "",
        securityDeposit: "",
        minimumRentalMonths: 3,
        gst: "",
        availableQuantity: 1,
        basicSoftwareInstalled: true,
        includedItems: [
            "LAPTOP",
            "CHARGING_ADAPTER",
            "BACKPACK",
        ],
        notes: "",
    };

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",

        // CHANGE (1/5): Added hsnCode to form state.
        // HSN code is used on tax invoices. Optional field.
        hsnCode: "",

        category: "",

        subcategory: "",

        brand: "",

        // PRODUCT TYPE
        productType: "NEW",

        // REFURBISHED
        refurbishedDetails: {
            ...emptyRefurbishedDetails,
        },

        // RENTAL
        rental: {
            ...emptyRentalDetails,
        },

        // DESCRIPTION
        shortDescription: "",

        description: "",

        // PRICING
        // NOTE: sellingPrice removed.
        // retailPrice  = PERSONAL customer price (required)
        // wholesalePrice = BUSINESS / CORPORATE customer price (optional)
        purchasePrice: "",

        retailPrice: "",

        wholesalePrice: "",

        mrp: "",

        discount: "",

        gst: "",

        // IMAGES
        images: [],
    });

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        loadCategories();
        loadBrands();

        return () => {
            previewImages.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {
        try {
            const res = await getCategories();

            console.log("CATEGORY API RESPONSE:", res.data);

            const categoryData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.categories)
                ? res.data.categories
                : Array.isArray(res.data?.data?.categories)
                ? res.data.data.categories
                : [];

            console.log("ALL CATEGORIES:", categoryData);

            setCategories(categoryData);
        } catch (error) {
            console.error("CATEGORY ERROR:", error);

            setCategories([]);

            toast.error("Failed to load categories");
        }
    };

    // =====================================================
    // LOAD BRANDS
    // =====================================================

    const loadBrands = async () => {
        try {
            const res = await getBrands();

            console.log("BRAND API RESPONSE:", res.data);

            const brandData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.brands)
                ? res.data.brands
                : Array.isArray(res.data?.data?.brands)
                ? res.data.data.brands
                : [];

            console.log("ALL BRANDS:", brandData);

            setBrands(brandData);
        } catch (error) {
            console.error("BRAND ERROR:", error);

            setBrands([]);

            toast.error("Failed to load brands");
        }
    };

    // =====================================================
    // GET PARENT CATEGORIES
    // =====================================================

    const getParentCategories = () => {
        return categories.filter(
            (category) => !category.parentCategory
        );
    };

    // =====================================================
    // GET SUBCATEGORIES
    // =====================================================

    const getSubcategoriesByParent = (parentCategoryId) => {
        if (!parentCategoryId) {
            return [];
        }

        return categories.filter((category) => {
            const parent = category.parentCategory;

            if (!parent) {
                return false;
            }

            const parentId =
                typeof parent === "object"
                    ? parent?._id
                    : parent;

            return (
                String(parentId) ===
                String(parentCategoryId)
            );
        });
    };

    // =====================================================
    // CATEGORY CHANGE
    // =====================================================

    const handleCategoryChange = (e) => {
        const parentCategoryId = e.target.value;

        console.log(
            "SELECTED PARENT CATEGORY:",
            parentCategoryId
        );

        setFormData((previous) => ({
            ...previous,

            category: parentCategoryId,

            subcategory: "",
        }));

        if (!parentCategoryId) {
            setSubcategories([]);

            return;
        }

        const children =
            getSubcategoriesByParent(
                parentCategoryId
            );

        console.log(
            "FOUND SUBCATEGORIES:",
            children
        );

        setSubcategories(children);
    };

    // =====================================================
    // SUBCATEGORY CHANGE
    // =====================================================

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;

        console.log(
            "SELECTED SUBCATEGORY:",
            subcategoryId
        );

        setFormData((previous) => ({
            ...previous,

            subcategory: subcategoryId,
        }));
    };

    // =====================================================
    // NORMAL INPUT CHANGE
    // (also handles hsnCode because the input's
    //  name attribute is "hsnCode")
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,

            [name]: value,
        }));
    };

    // =====================================================
    // PRODUCT TYPE CHANGE
    // =====================================================

    const handleProductTypeChange = (e) => {
        const productType = e.target.value;

        console.log(
            "PRODUCT TYPE:",
            productType
        );

        setFormData((previous) => ({
            ...previous,

            productType,

            // REFURBISHED DATA
            refurbishedDetails:
                productType === "REFURBISHED"
                    ? previous.refurbishedDetails
                    : {
                        ...emptyRefurbishedDetails,
                    },

            // RENTAL DATA
            rental:
                productType === "RENTAL"
                    ? {
                        ...previous.rental,

                        isAvailableForRent:
                            true,
                    }
                    : previous.rental,
        }));
    };

    // =====================================================
    // REFURBISHED CHANGE
    // =====================================================

    const handleRefurbishedChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,

            refurbishedDetails: {
                ...previous.refurbishedDetails,

                [name]: value,
            },
        }));
    };

    // =====================================================
    // RENTAL CHANGE
    // IMPORTANT
    // Supports:
    // handleRentalChange("monthlyRent", value)
    // handleRentalChange("basicSoftwareInstalled", true)
    // =====================================================

    const handleRentalChange = (
        name,
        value
    ) => {
        setFormData((previous) => ({
            ...previous,

            rental: {
                ...previous.rental,

                [name]: value,
            },
        }));
    };

    // =====================================================
    // RENTAL INCLUDED ITEM
    // =====================================================

    const handleRentalItemChange = (item) => {
        setFormData((previous) => {
            const currentItems =
                previous.rental.includedItems || [];

            const exists =
                currentItems.includes(item);

            const updatedItems = exists
                ? currentItems.filter(
                    (value) => value !== item
                )
                : [
                    ...currentItems,
                    item,
                ];

            return {
                ...previous,

                rental: {
                    ...previous.rental,

                    includedItems:
                        updatedItems,
                },
            };
        });
    };

    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {
        const files = Array.from(
            e.target.files || []
        );

        if (files.length === 0) {
            setFormData((previous) => ({
                ...previous,

                images: [],
            }));

            previewImages.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            setPreviewImages([]);

            return;
        }

        // MAX 5
        if (files.length > 5) {
            toast.error(
                "You can upload maximum 5 images"
            );

            e.target.value = "";

            return;
        }

        // IMAGE TYPE
        const invalidFile = files.find(
            (file) =>
                !file.type.startsWith("image/")
        );

        if (invalidFile) {
            toast.error(
                "Only image files are allowed"
            );

            e.target.value = "";

            return;
        }

        // IMAGE SIZE
        const oversizedFile = files.find(
            (file) =>
                file.size >
                5 * 1024 * 1024
        );

        if (oversizedFile) {
            toast.error(
                "Each image must be less than 5MB"
            );

            e.target.value = "";

            return;
        }

        // REVOKE OLD PREVIEWS
        previewImages.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        // SAVE FILES
        setFormData((previous) => ({
            ...previous,

            images: files,
        }));

        // CREATE PREVIEWS
        const preview = files.map(
            (file) =>
                URL.createObjectURL(file)
        );

        setPreviewImages(preview);
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!formData.name.trim()) {
            toast.error(
                "Please enter product name"
            );

            return;
        }

        if (!formData.category) {
            toast.error(
                "Please select category"
            );

            return;
        }

        if (!formData.brand) {
            toast.error(
                "Please select brand"
            );

            return;
        }

        if (!formData.productType) {
            toast.error(
                "Please select product type"
            );

            return;
        }

        // =================================================
        // CHANGE (2/5): HSN CODE VALIDATION
        // HSN code is optional. If entered, it must be
        // 4, 6 or 8 digits (same rule as backend Joi
        // validation in product.validation.js).
        // =================================================

        const hsnCode = formData.hsnCode.trim();

        if (
            hsnCode &&
            !/^\d{4}(\d{2}(\d{2})?)?$/.test(hsnCode)
        ) {
            toast.error(
                "HSN code must be 4, 6 or 8 digits"
            );

            return;
        }

        // =================================================
        // REFURBISHED VALIDATION
        // =================================================

        if (
            formData.productType ===
            "REFURBISHED"
        ) {
            const details =
                formData.refurbishedDetails;

            if (!details.grade) {
                toast.error(
                    "Please select refurbished grade"
                );

                return;
            }

            if (
                details.batteryHealth === ""
            ) {
                toast.error(
                    "Please enter battery health"
                );

                return;
            }

            const batteryHealth =
                Number(
                    details.batteryHealth
                );

            if (
                !Number.isFinite(
                    batteryHealth
                ) ||
                batteryHealth < 0 ||
                batteryHealth > 100
            ) {
                toast.error(
                    "Battery health must be between 0 and 100"
                );

                return;
            }

            if (
                details.warrantyMonths === ""
            ) {
                toast.error(
                    "Please enter warranty months"
                );

                return;
            }

            const warrantyMonths =
                Number(
                    details.warrantyMonths
                );

            if (
                !Number.isFinite(
                    warrantyMonths
                ) ||
                warrantyMonths < 0
            ) {
                toast.error(
                    "Warranty months cannot be negative"
                );

                return;
            }

            if (!details.testingStatus) {
                toast.error(
                    "Please select testing status"
                );

                return;
            }
        }

        // =================================================
        // RENTAL VALIDATION
        // =================================================

        if (
            formData.productType ===
            "RENTAL"
        ) {
            const monthlyRent =
                Number(
                    formData.rental
                        .monthlyRent || 0
                );

            const securityDeposit =
                Number(
                    formData.rental
                        .securityDeposit || 0
                );

            const minimumRentalMonths =
                Number(
                    formData.rental
                        .minimumRentalMonths || 0
                );

            const rentalGst =
                Number(
                    formData.rental.gst || 0
                );

            const availableQuantity =
                Number(
                    formData.rental
                        .availableQuantity || 0
                );

            if (
                !Number.isFinite(
                    monthlyRent
                ) ||
                monthlyRent <= 0
            ) {
                toast.error(
                    "Please enter valid monthly rent"
                );

                return;
            }

            if (
                !Number.isFinite(
                    securityDeposit
                ) ||
                securityDeposit < 0
            ) {
                toast.error(
                    "Security deposit cannot be negative"
                );

                return;
            }

            if (
                !Number.isInteger(
                    minimumRentalMonths
                ) ||
                minimumRentalMonths < 3
            ) {
                toast.error(
                    "Minimum rental period must be at least 3 months"
                );

                return;
            }

            if (
                !Number.isFinite(
                    rentalGst
                ) ||
                rentalGst < 0 ||
                rentalGst > 100
            ) {
                toast.error(
                    "Rental GST must be between 0 and 100"
                );

                return;
            }

            if (
                !Number.isInteger(
                    availableQuantity
                ) ||
                availableQuantity <= 0
            ) {
                toast.error(
                    "Available rental quantity must be greater than 0"
                );

                return;
            }
        }

        // =================================================
        // PRICE VALIDATION
        // retailPrice  = required (PERSONAL customer price)
        // wholesalePrice = optional (BUSINESS/CORPORATE price)
        // =================================================

        if (
            formData.retailPrice === ""
        ) {
            toast.error(
                "Please enter retail price"
            );

            return;
        }

        if (
            formData.mrp === ""
        ) {
            toast.error(
                "Please enter MRP"
            );

            return;
        }

        const purchasePrice =
            Number(
                formData.purchasePrice || 0
            );

        const retailPrice =
            Number(
                formData.retailPrice || 0
            );

        const wholesalePrice =
            formData.wholesalePrice === ""
                ? null
                : Number(
                    formData.wholesalePrice
                );

        const mrp =
            Number(
                formData.mrp || 0
            );

        const discount =
            Number(
                formData.discount || 0
            );

        const gst =
            Number(
                formData.gst || 0
            );

        if (
            !Number.isFinite(
                purchasePrice
            ) ||
            purchasePrice < 0
        ) {
            toast.error(
                "Purchase price cannot be negative"
            );

            return;
        }

        if (
            !Number.isFinite(
                retailPrice
            ) ||
            retailPrice < 0
        ) {
            toast.error(
                "Retail price cannot be negative"
            );

            return;
        }

        if (
            wholesalePrice !== null &&
            (
                !Number.isFinite(
                    wholesalePrice
                ) ||
                wholesalePrice < 0
            )
        ) {
            toast.error(
                "Wholesale / Corporate price cannot be negative"
            );

            return;
        }

        if (
            !Number.isFinite(mrp) ||
            mrp < 0
        ) {
            toast.error(
                "MRP cannot be negative"
            );

            return;
        }

        if (
            !Number.isFinite(
                discount
            ) ||
            discount < 0 ||
            discount > 100
        ) {
            toast.error(
                "Discount must be between 0 and 100"
            );

            return;
        }

        if (
            !Number.isFinite(gst) ||
            gst < 0 ||
            gst > 100
        ) {
            toast.error(
                "GST must be between 0 and 100"
            );

            return;
        }

        // =================================================
        // CREATE PRODUCT
        // =================================================

        try {
            setLoading(true);

            const data =
                new FormData();

            // =================================================
            // BASIC
            // =================================================

            data.append(
                "name",
                formData.name.trim()
            );

            // =================================================
            // CHANGE (3/5): SEND HSN CODE TO BACKEND
            // Sent as a plain text field in multipart
            // FormData. Backend reads it from req.body.hsnCode
            // and saves it in product.service.js.
            // =================================================

            data.append(
                "hsnCode",
                hsnCode
            );

            data.append(
                "category",
                formData.category
            );

            // =================================================
            // SUBCATEGORY
            // =================================================

            if (
                formData.subcategory
            ) {
                data.append(
                    "subcategory",
                    formData.subcategory
                );
            }

            // =================================================
            // PRODUCT TYPE
            // =================================================

            data.append(
                "productType",
                formData.productType
            );

            // =================================================
            // REFURBISHED
            // =================================================

            if (
                formData.productType ===
                "REFURBISHED"
            ) {
                const refurbishedDetails = {
                    grade:
                        formData
                            .refurbishedDetails
                            .grade,

                    batteryHealth:
                        Number(
                            formData
                                .refurbishedDetails
                                .batteryHealth
                        ),

                    warrantyMonths:
                        Number(
                            formData
                                .refurbishedDetails
                                .warrantyMonths
                        ),

                    testingStatus:
                        formData
                            .refurbishedDetails
                            .testingStatus,
                };

                data.append(
                    "refurbishedDetails",
                    JSON.stringify(
                        refurbishedDetails
                    )
                );
            }

            // =================================================
            // RENTAL
            // =================================================

            const isRental =
                formData.productType ===
                "RENTAL";

            const rentalData = {
                isAvailableForRent:
                    isRental
                        ? true
                        : formData.rental
                            .isAvailableForRent ===
                          true,

                monthlyRent:
                    Number(
                        formData.rental
                            .monthlyRent || 0
                    ),

                securityDeposit:
                    Number(
                        formData.rental
                            .securityDeposit || 0
                    ),

                minimumRentalMonths:
                    Math.max(
                        Number(
                            formData.rental
                                .minimumRentalMonths ||
                                3
                        ),
                        3
                    ),

                gst:
                    Number(
                        formData.rental
                            .gst || 0
                    ),

                availableQuantity:
                    Number(
                        formData.rental
                            .availableQuantity ||
                            0
                    ),

                basicSoftwareInstalled:
                    formData.rental
                        .basicSoftwareInstalled ===
                    true,

                includedItems:
                    Array.isArray(
                        formData.rental
                            .includedItems
                    )
                        ? formData.rental
                            .includedItems
                        : [],

                notes:
                    formData.rental
                        .notes
                        ?.trim() || "",
            };

            data.append(
                "rental",
                JSON.stringify(
                    rentalData
                )
            );

            // =================================================
            // BRAND
            // =================================================

            data.append(
                "brand",
                formData.brand
            );

            // =================================================
            // DESCRIPTION
            // =================================================

            data.append(
                "shortDescription",
                formData.shortDescription.trim()
            );

            data.append(
                "description",
                formData.description.trim()
            );

            // =================================================
            // PRICING
            // retailPrice = PERSONAL price (required)
            // wholesalePrice = BUSINESS/CORPORATE price (optional, null if not set)
            // =================================================

            const pricing = {
                purchasePrice,

                retailPrice,

                wholesalePrice,

                mrp,

                discount,

                gst,
            };

            data.append(
                "pricing",
                JSON.stringify(
                    pricing
                )
            );

            // =================================================
            // IMAGES
            // =================================================

            formData.images.forEach(
                (image) => {
                    data.append(
                        "images",
                        image
                    );
                }
            );

            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "======================================"
            );

            console.log(
                "CREATE PRODUCT"
            );

            console.log(
                "======================================"
            );

            console.log(
                "Product Name:",
                formData.name
            );

            console.log(
                "HSN Code:",
                hsnCode
            );

            console.log(
                "Parent Category:",
                formData.category
            );

            console.log(
                "Subcategory:",
                formData.subcategory
            );

            console.log(
                "Product Type:",
                formData.productType
            );

            console.log(
                "Refurbished Details:",
                formData.refurbishedDetails
            );

            console.log(
                "Rental:",
                rentalData
            );

            console.log(
                "Brand:",
                formData.brand
            );

            console.log(
                "Pricing:",
                pricing
            );

            console.log(
                "Images:",
                formData.images
            );

            for (
                const [key, value]
                of data.entries()
            ) {
                console.log(
                    "FORM DATA:",
                    key,
                    value
                );
            }

            // =================================================
            // API CALL
            // =================================================

            const response =
                await createProduct(
                    data
                );

            console.log(
                "======================================"
            );

            console.log(
                "CREATE PRODUCT SUCCESS:",
                response.data
            );

            console.log(
                "======================================"
            );

            // =================================================
            // SUCCESS
            // =================================================

            toast.success(
                isRental
                    ? "Rental Product Added Successfully"
                    : formData.productType ===
                      "REFURBISHED"
                    ? "Refurbished Product Added Successfully"
                    : "New Product Added Successfully"
            );

            // =================================================
            // RESET
            // =================================================

            setFormData({
                name: "",

                // CHANGE (4/5): Reset hsnCode after
                // successful product creation.
                hsnCode: "",

                category: "",

                subcategory: "",

                brand: "",

                productType: "NEW",

                refurbishedDetails: {
                    ...emptyRefurbishedDetails,
                },

                rental: {
                    ...emptyRentalDetails,
                },

                shortDescription: "",

                description: "",

                purchasePrice: "",

                retailPrice: "",

                wholesalePrice: "",

                mrp: "",

                discount: "",

                gst: "",

                images: [],
            });

            // =================================================
            // RESET PREVIEWS
            // =================================================

            previewImages.forEach(
                (url) => {
                    URL.revokeObjectURL(url);
                }
            );

            setPreviewImages([]);

            // =================================================
            // RESET SUBCATEGORY
            // =================================================

            setSubcategories([]);

            // =================================================
            // RESET FILE INPUT
            // =================================================

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    "";
            }
        } catch (error) {
            console.error(
                "======================================"
            );

            console.error(
                "CREATE PRODUCT ERROR"
            );

            console.error(
                "======================================"
            );

            console.error(error);

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            console.error(
                "BACKEND MESSAGE:",
                error.response?.data?.message
            );

            console.error(
                "BACKEND ERRORS:",
                error.response?.data?.errors
            );

            let backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to add product";

            if (
                Array.isArray(
                    error.response?.data?.errors
                ) &&
                error.response.data.errors
                    .length > 0
            ) {
                backendMessage =
                    error.response.data.errors.join(
                        ", "
                    );
            }

            toast.error(
                backendMessage
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
  <main className="apx-page">
    <section className="apx-card">
      <header className="apx-header">
        <div className="apx-header-content">
          <div className="apx-header-icon" aria-hidden="true">
            +
          </div>

          <div>
            <span className="apx-eyebrow">PRODUCT MANAGEMENT</span>
            <h1 className="apx-title">Add a product</h1>
            <p className="apx-subtitle">
              Add product details, pricing, and inventory information.
            </p>
          </div>
        </div>
      </header>

      <form className="apx-form" onSubmit={handleSubmit}>
        {/* BASIC INFORMATION */}
        <section className="apx-section">
          <div className="apx-section-heading">
            <div>
              <h2>Basic information</h2>
              <p>Set up the product identity and classification.</p>
            </div>
            <span className="apx-required-note">
              <span>*</span> Required
            </span>
          </div>

          <div className="apx-grid">
            <div className="apx-field apx-field-span-2">
              <label htmlFor="apx-product-name">
                Product name <span className="apx-required">*</span>
              </label>
              <input
                id="apx-product-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. MacBook Pro 14-inch"
                required
              />
            </div>

            <div className="apx-field">
              <label htmlFor="apx-category">
                Category <span className="apx-required">*</span>
              </label>
              <select
                id="apx-category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select category</option>
                {getParentCategories().map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="apx-field">
              <label htmlFor="apx-subcategory">Subcategory</label>
              <select
                id="apx-subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
                disabled={!formData.category || subcategories.length === 0}
              >
                <option value="">
                  {!formData.category
                    ? "Select a category first"
                    : subcategories.length === 0
                    ? "No subcategories available"
                    : "Select subcategory"}
                </option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {formData.category && subcategories.length === 0 && (
                <small>This category has no subcategories.</small>
              )}
            </div>

            <div className="apx-field">
              <label htmlFor="apx-brand">
                Brand <span className="apx-required">*</span>
              </label>
              <select
                id="apx-brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="apx-field">
              <label htmlFor="apx-product-type">
                Product type <span className="apx-required">*</span>
              </label>
              <select
                id="apx-product-type"
                name="productType"
                value={formData.productType}
                onChange={handleProductTypeChange}
                required
              >
                <option value="NEW">New product</option>
                <option value="REFURBISHED">Refurbished product</option>
                <option value="RENTAL">Rental product</option>
              </select>
            </div>

            <div className="apx-field">
              <label htmlFor="apx-hsn">HSN code</label>
              <input
                id="apx-hsn"
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
                placeholder="e.g. 84713010"
                maxLength={8}
                inputMode="numeric"
              />
              <small>Optional · 4, 6, or 8 digits</small>
            </div>
          </div>
        </section>

        {/* REFURBISHED DETAILS */}
        {formData.productType === "REFURBISHED" && (
          <section className="apx-section apx-section-tinted">
            <div className="apx-section-heading">
              <div>
                <h2>Refurbished details</h2>
                <p>Describe the product’s condition and testing.</p>
              </div>
            </div>

            <div className="apx-grid">
              <div className="apx-field">
                <label htmlFor="apx-grade">
                  Grade <span className="apx-required">*</span>
                </label>
                <select
                  id="apx-grade"
                  name="grade"
                  value={formData.refurbishedDetails.grade}
                  onChange={handleRefurbishedChange}
                  required
                >
                  <option value="">Select grade</option>
                  <option value="A+">A+ — Excellent</option>
                  <option value="A">A — Very good</option>
                  <option value="B">B — Good</option>
                  <option value="C">C — Fair</option>
                </select>
              </div>

              <div className="apx-field">
                <label htmlFor="apx-battery">
                  Battery health (%) <span className="apx-required">*</span>
                </label>
                <input
                  id="apx-battery"
                  type="number"
                  name="batteryHealth"
                  value={formData.refurbishedDetails.batteryHealth}
                  onChange={handleRefurbishedChange}
                  min="0"
                  max="100"
                  placeholder="e.g. 85"
                  required
                />
              </div>

              <div className="apx-field">
                <label htmlFor="apx-warranty">
                  Warranty (months) <span className="apx-required">*</span>
                </label>
                <input
                  id="apx-warranty"
                  type="number"
                  name="warrantyMonths"
                  value={formData.refurbishedDetails.warrantyMonths}
                  onChange={handleRefurbishedChange}
                  min="0"
                  placeholder="e.g. 6"
                  required
                />
              </div>

              <div className="apx-field">
                <label htmlFor="apx-testing">
                  Testing status <span className="apx-required">*</span>
                </label>
                <select
                  id="apx-testing"
                  name="testingStatus"
                  value={formData.refurbishedDetails.testingStatus}
                  onChange={handleRefurbishedChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="TESTED">Tested</option>
                  <option value="NOT_TESTED">Not tested</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* RENTAL DETAILS */}
        {formData.productType === "RENTAL" && (
          <section className="apx-section apx-section-tinted">
            <div className="apx-section-heading">
              <div>
                <h2>Rental details</h2>
                <p>Configure rental pricing, availability, and inclusions.</p>
              </div>
            </div>

            <div className="apx-grid">
              <div className="apx-field">
                <label htmlFor="apx-monthly-rent">
                  Monthly rent <span className="apx-required">*</span>
                </label>
                <input
                  id="apx-monthly-rent"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.rental.monthlyRent}
                  onChange={(e) =>
                    handleRentalChange("monthlyRent", e.target.value)
                  }
                  placeholder="Enter monthly rent"
                  required
                />
              </div>

              <div className="apx-field">
                <label htmlFor="apx-deposit">Security deposit</label>
                <input
                  id="apx-deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.rental.securityDeposit}
                  onChange={(e) =>
                    handleRentalChange("securityDeposit", e.target.value)
                  }
                  placeholder="Enter deposit"
                />
              </div>

              <div className="apx-field">
                <label htmlFor="apx-minimum-months">
                  Minimum rental period (months)
                </label>
                <input
                  id="apx-minimum-months"
                  type="number"
                  min="3"
                  step="1"
                  value={formData.rental.minimumRentalMonths}
                  onChange={(e) =>
                    handleRentalChange(
                      "minimumRentalMonths",
                      e.target.value
                    )
                  }
                />
                <small>Minimum rental period is 3 months.</small>
              </div>

              <div className="apx-field">
                <label htmlFor="apx-rental-gst">Rental GST (%)</label>
                <input
                  id="apx-rental-gst"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.rental.gst}
                  onChange={(e) =>
                    handleRentalChange("gst", e.target.value)
                  }
                  placeholder="e.g. 18"
                />
              </div>

              <div className="apx-field">
                <label htmlFor="apx-quantity">
                  Available quantity <span className="apx-required">*</span>
                </label>
                <input
                  id="apx-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.rental.availableQuantity}
                  onChange={(e) =>
                    handleRentalChange("availableQuantity", e.target.value)
                  }
                  required
                />
              </div>

              <div className="apx-field apx-field-switch">
                <span className="apx-label">Basic software</span>
                <label className="apx-switch-row">
                  <input
                    type="checkbox"
                    checked={formData.rental.basicSoftwareInstalled}
                    onChange={(e) =>
                      handleRentalChange(
                        "basicSoftwareInstalled",
                        e.target.checked
                      )
                    }
                  />
                  <span>Software is installed</span>
                </label>
              </div>

              <div className="apx-field apx-field-span-2">
                <span className="apx-label">Included items</span>
                <div className="apx-check-grid">
                  {[
                    "LAPTOP",
                    "CHARGING_ADAPTER",
                    "BACKPACK",
                    "MOUSE",
                    "LAPTOP_BAG",
                  ].map((item) => (
                    <label className="apx-check-card" key={item}>
                      <input
                        type="checkbox"
                        checked={formData.rental.includedItems.includes(item)}
                        onChange={() => handleRentalItemChange(item)}
                      />
                      <span>{item.replaceAll("_", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="apx-field apx-field-span-2">
                <label htmlFor="apx-rental-notes">Rental notes</label>
                <textarea
                  id="apx-rental-notes"
                  value={formData.rental.notes}
                  onChange={(e) =>
                    handleRentalChange("notes", e.target.value)
                  }
                  rows={3}
                  placeholder="Add any rental-specific notes..."
                />
              </div>
            </div>
          </section>
        )}

        {/* DESCRIPTION */}
        <section className="apx-section">
          <div className="apx-section-heading">
            <div>
              <h2>Description</h2>
              <p>Help customers understand what this product offers.</p>
            </div>
          </div>

          <div className="apx-stack">
            <div className="apx-field">
              <label htmlFor="apx-short-description">Short description</label>
              <textarea
                id="apx-short-description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Write a brief product summary..."
              />
            </div>

            <div className="apx-field">
              <label htmlFor="apx-description">Full description</label>
              <textarea
                id="apx-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Add product specifications, features, and other details..."
              />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="apx-section">
          <div className="apx-section-heading">
            <div>
              <h2>Pricing</h2>
              <p>Set customer pricing and applicable taxes.</p>
            </div>
          </div>

          <div className="apx-grid">
            <div className="apx-field">
              <label htmlFor="apx-purchase-price">Purchase price</label>
              <input
                id="apx-purchase-price"
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="apx-field">
              <label htmlFor="apx-retail-price">
                Retail price <span className="apx-required">*</span>
              </label>
              <input
                id="apx-retail-price"
                type="number"
                name="retailPrice"
                value={formData.retailPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Personal customer price"
                required
              />
            </div>

            <div className="apx-field">
              <label htmlFor="apx-wholesale-price">
                Wholesale / corporate price
              </label>
              <input
                id="apx-wholesale-price"
                type="number"
                name="wholesalePrice"
                value={formData.wholesalePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Business customer price"
              />
              <small>Leave blank if not applicable.</small>
            </div>

            <div className="apx-field">
              <label htmlFor="apx-mrp">
                MRP <span className="apx-required">*</span>
              </label>
              <input
                id="apx-mrp"
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="apx-field">
              <label htmlFor="apx-discount">Discount (%)</label>
              <input
                id="apx-discount"
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="apx-field">
              <label htmlFor="apx-gst">Product GST (%)</label>
              <input
                id="apx-gst"
                type="number"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
              />
            </div>
          </div>
        </section>

        {/* IMAGES */}
        <section className="apx-section">
          <div className="apx-section-heading">
            <div>
              <h2>Product images</h2>
              <p>Upload up to five images, with a maximum size of 5 MB each.</p>
            </div>
          </div>

          <div className="apx-upload-area">
            <input
              ref={fileInputRef}
              id="apx-product-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="apx-product-images" className="apx-upload-label">
              <span className="apx-upload-icon" aria-hidden="true">
                ↑
              </span>
              <span className="apx-upload-copy">
                <strong>Choose images to upload</strong>
                <small>PNG, JPG, or other image formats · Up to 5 images</small>
              </span>
              <span className="apx-browse-button">Browse files</span>
            </label>
          </div>

          {previewImages.length > 0 && (
            <div className="apx-image-preview">
              {previewImages.map((image, index) => (
                <div className="apx-preview-item" key={`${image}-${index}`}>
                  <img src={image} alt={`Product preview ${index + 1}`} />
                  <span className="apx-preview-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ACTIONS */}
        <footer className="apx-actions">
          <p>Review the product information before saving.</p>
          <button type="submit" className="apx-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="apx-spinner" aria-hidden="true" />
                Saving product…
              </>
            ) : (
              <>
                <span aria-hidden="true">+</span>
                {formData.productType === "RENTAL"
                  ? "Create rental product"
                  : formData.productType === "REFURBISHED"
                  ? "Create refurbished product"
                  : "Create product"}
              </>
            )}
          </button>
        </footer>
      </form>
    </section>
  </main>
);
};

export default AddProduct;