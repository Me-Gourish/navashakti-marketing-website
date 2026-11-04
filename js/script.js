
/* =========================================================
   NAVASHAKTI MARKETING
   Product Details + Quotation + Google Apps Script
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const APPS_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbwjR-VfGibxGAraZ0Jx6H2QBO7_yfFUpdbw7W51GVBxTXTNLAOOj2dh1YT7q1KBc-WWHA/exec";

    const productNames = [
        "Green Boards",
        "Magnetic Green Boards",
        "White Boards",
        "Notice Boards",
        "Smart Boards",
        "Board Stands"
    ];

    /* =====================================================
       PRODUCT INFORMATION — TEXT ONLY
    ===================================================== */

    const productInfo = {

        "Green Boards": {
            intro: "A dependable writing surface for everyday classroom teaching and learning.",
            details: [
                ["Dimensions", "Standard and custom sizes may be available. Share your required width and height for confirmation."],
                ["Surface / Material", "Green writing surface intended for chalk use. Exact surface construction should be confirmed for the selected product."],
                ["Frame Options", "Frame material, border profile and finish are subject to the available model."],
                ["Typical Usage", "Classrooms, schools, colleges, coaching centres and training spaces."]
            ]
        },

        "Magnetic Green Boards": {
            intro: "A practical combination of chalk writing and magnetic display functionality.",
            details: [
                ["Dimensions", "Standard and custom sizes may be available. Share your required width and height for confirmation."],
                ["Surface / Material", "Green chalk-writing surface with magnetic display functionality."],
                ["Frame Options", "Frame material, border profile and finish depend on the selected model."],
                ["Typical Usage", "Classrooms and learning spaces that need writing and display areas."]
            ]
        },

        "White Boards": {
            intro: "A reusable writing surface for lessons, planning, presentations and collaboration.",
            details: [
                ["Dimensions", "Standard and custom sizes may be available."],
                ["Surface / Material", "White dry-erase writing surface. Surface grade and finish depend on the selected product."],
                ["Frame Options", "Frame material, border profile and finish depend on the selected model."],
                ["Typical Usage", "Classrooms, offices, meeting rooms and training spaces."]
            ]
        },

        "Notice Boards": {
            intro: "A dedicated display area for notices, schedules, announcements and updates.",
            details: [
                ["Dimensions", "Standard and custom sizes may be available."],
                ["Surface / Material", "Pin-up display surface. Exact core, fabric or covering material depends on the selected product."],
                ["Frame Options", "Frame material, border profile and finish depend on the selected model."],
                ["Typical Usage", "Schools, colleges, offices and institutions."]
            ]
        },

        "Smart Boards": {
            intro: "Interactive digital display solutions for modern teaching and presentations.",
            details: [
                ["Dimensions", "Screen size and overall dimensions depend on the selected make and model."],
                ["Display / Technology", "Interactive display features, operating system and connectivity are model-specific."],
                ["Mounting / Installation", "Installation requirements depend on the selected model and site."],
                ["Typical Usage", "Interactive classrooms, training rooms and meeting spaces."]
            ]
        },

        "Board Stands": {
            intro: "Practical stand solutions for positioning boards in different working and learning spaces.",
            details: [
                ["Dimensions", "Stand height, width and board compatibility depend on the selected model."],
                ["Material", "Construction material and load capacity depend on the selected product."],
                ["Configurations", "Fixed or movable configurations and available finishes depend on the model."],
                ["Typical Usage", "Classrooms, offices, training rooms and presentations."]
            ]
        }
    };


    /* =====================================================
       HTML ELEMENT REFERENCES
    ===================================================== */

    const productModal =
        document.getElementById("productDetailsModal");

    const productModalTitle =
        document.getElementById("productDetailsTitle");

    const productModalIntro =
        document.getElementById("productDetailsIntro");

    const productModalGrid =
        document.getElementById("productDetailsGrid");

    const productQuoteButton =
        document.getElementById("productDetailsQuote");

    const quotationModal =
        document.getElementById("quotationModal");

    const quotationForm =
        document.getElementById("quotationForm");

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");

    const customerEmail =
        document.getElementById("customerEmail");

    const additionalRequirements =
        document.getElementById("additionalRequirements");

    const dropdownToggle =
        document.getElementById("productDropdownToggle");

    const dropdownMenu =
        document.getElementById("productDropdownMenu");

    const dropdownLabel =
        document.getElementById("dropdownLabel");

    const productSearch =
        document.getElementById("productSearch");

    const selectedProductsContainer =
        document.getElementById("selectedProducts");

    const selectedProductDetails =
        document.getElementById("selectedProductDetails");

    const productSelectionError =
        document.getElementById("productSelectionError");

    const quotationStatus =
        document.getElementById("quotationStatus");

    const submitButton =
        quotationForm?.querySelector('[type="submit"]');


    if (
        !productModal ||
        !quotationModal ||
        !quotationForm ||
        !dropdownMenu ||
        !dropdownToggle
    ) {
        console.error(
            "Navashakti: required popup or quotation form elements are missing."
        );
        return;
    }


    /* =====================================================
       APPLICATION STATE
    ===================================================== */

    const selectedProducts = new Set();

    let activeProductName = "";
    let lastProductFocus = null;
    let lastQuotationFocus = null;

    let submissionPending = false;
    let activeRequestId = "";

    let submissionTimer = null;
    let submissionFrame = null;
    let submissionForm = null;


    /* =====================================================
       COMMON HELPERS
    ===================================================== */

    function syncBodyScroll() {
        const isAnyModalOpen =
            !productModal.hidden || !quotationModal.hidden;

        document.body.classList.toggle(
            "modal-open",
            isAnyModalOpen
        );
    }


    function setStatus(message, isError = false) {
        quotationStatus.textContent = message;

        quotationStatus.classList.toggle(
            "status-error",
            isError
        );
    }


    function escapeAttribute(value) {
        return value.replace(/["\\]/g, "\\$&");
    }


    /* =====================================================
       PRODUCT DETAILS POPUP
    ===================================================== */

    function openProductDetails(productName, card) {

        const product = productInfo[productName];

        if (!product) return;

        activeProductName = productName;
        lastProductFocus = card || document.activeElement;

        productModalTitle.textContent = productName;
        productModalIntro.textContent = product.intro;

        productModalGrid.replaceChildren();

        product.details.forEach(([label, description]) => {

            const item = document.createElement("article");
            item.className = "product-details-item";

            const heading = document.createElement("strong");
            heading.textContent = label;

            const paragraph = document.createElement("p");
            paragraph.textContent = description;

            item.append(heading, paragraph);

            productModalGrid.append(item);
        });

        productModal.hidden = false;

        syncBodyScroll();

        productModal
            .querySelector(".product-details-close")
            ?.focus();
    }


    function closeProductDetails(restoreFocus = true) {

        if (productModal.hidden) return;

        productModal.hidden = true;

        syncBodyScroll();

        if (
            restoreFocus &&
            lastProductFocus &&
            typeof lastProductFocus.focus === "function"
        ) {
            lastProductFocus.focus();
        }
    }


    document
        .querySelectorAll("#products .product-card")
        .forEach(card => {

            card.addEventListener("click", event => {

                const productName =
                    card.querySelector("h3")?.textContent.trim();

                if (!productInfo[productName]) return;

                event.preventDefault();

                openProductDetails(productName, card);
            });
        });


    productModal
        .querySelectorAll("[data-close-product-details]")
        .forEach(control => {

            control.addEventListener("click", () => {
                closeProductDetails();
            });
        });


    /* =====================================================
       QUOTATION POPUP
    ===================================================== */

    function updateDropdownState(isOpen) {

        dropdownMenu.hidden = !isOpen;

        dropdownToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        if (isOpen) {
            productSearch?.focus();
        }
    }


    function openQuotationModal(
        productToPreselect = "",
        returnFocusTarget = document.activeElement
    ) {

        lastQuotationFocus = returnFocusTarget;

        quotationModal.hidden = false;

        syncBodyScroll();

        setStatus("");

        productSelectionError.hidden = true;

        updateDropdownState(false);

        productSearch.value = "";

        dropdownMenu
            .querySelectorAll("button[data-product]")
            .forEach(option => {
                option.hidden = false;
            });

        if (productToPreselect) {
            addProduct(productToPreselect);
        }

        requestAnimationFrame(() => {

            if (productToPreselect) {

                const selector =
                    `[data-product-card="${escapeAttribute(productToPreselect)}"] input`;

                selectedProductDetails
                    .querySelector(selector)
                    ?.focus();

            } else {
                customerName.focus();
            }
        });
    }


    function closeQuotationModal() {

        if (submissionPending || quotationModal.hidden) {
            return;
        }

        updateDropdownState(false);

        quotationModal.hidden = true;

        syncBodyScroll();

        if (
            lastQuotationFocus &&
            typeof lastQuotationFocus.focus === "function"
        ) {
            lastQuotationFocus.focus();
        }
    }


    // Header and hero quotation buttons.

    document
        .querySelectorAll(".open-quotation")
        .forEach(trigger => {

            trigger.addEventListener("click", event => {

                event.preventDefault();

                openQuotationModal();
            });
        });


    // Quotation popup close buttons and backdrop.

    quotationModal
        .querySelectorAll("[data-close-quotation]")
        .forEach(control => {

            control.addEventListener("click", closeQuotationModal);
        });


    // Product popup quotation button.

    productQuoteButton?.addEventListener("click", () => {

        const productToQuote = activeProductName;

        const focusTarget = lastProductFocus;

        closeProductDetails(false);

        openQuotationModal(
            productToQuote,
            focusTarget
        );
    });


    /* =====================================================
       MULTI-SELECT PRODUCT DROPDOWN
    ===================================================== */

    function getProductOption(productName) {

        return Array.from(
            dropdownMenu.querySelectorAll("button[data-product]")
        ).find(option => option.dataset.product === productName);
    }


    function addProduct(productName) {

        if (
            !productNames.includes(productName) ||
            selectedProducts.has(productName)
        ) {
            return;
        }

        selectedProducts.add(productName);

        renderSelectedProducts();
    }


    function removeProduct(productName) {

        selectedProducts.delete(productName);

        renderSelectedProducts();
    }


    /* =====================================================
       PRODUCT QUANTITY / DIMENSION INPUTS
    ===================================================== */

    function createProductInput(
        productName,
        fieldName,
        labelText,
        inputType,
        placeholder
    ) {

        const label = document.createElement("label");

        label.textContent = labelText;

        const input = document.createElement("input");

        input.type = inputType;

        input.dataset.field = fieldName;

        input.dataset.product = productName;

        input.placeholder = placeholder;

        input.required = true;

        input.autocomplete = "off";

        if (inputType === "number") {

            input.min = "1";

            input.step = "1";

            input.value = "1";

            input.inputMode = "numeric";

        } else {

            input.maxLength = 35;
        }

        label.append(input);

        return label;
    }


    /* =====================================================
       RENDER SELECTED PRODUCTS
    ===================================================== */

    function renderSelectedProducts() {

        selectedProductsContainer.replaceChildren();

        selectedProductDetails.replaceChildren();

        productNames.forEach(productName => {

            const option = getProductOption(productName);

            if (!option) return;

            const isSelected =
                selectedProducts.has(productName);

            option.classList.toggle(
                "selected",
                isSelected
            );

            option.setAttribute(
                "aria-pressed",
                String(isSelected)
            );
        });


        // Update dropdown label.

        if (selectedProducts.size === 0) {

            dropdownLabel.textContent =
                "Choose your products";

        } else {

            dropdownLabel.textContent =
                `${selectedProducts.size} product${selectedProducts.size === 1 ? "" : "s"} selected`;
        }


        // Build selected-product chips and detail cards.

        selectedProducts.forEach(productName => {

            const chip = document.createElement("span");

            chip.className = "selected-product-chip";

            const chipText = document.createElement("span");

            chipText.textContent = productName;

            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.className = "remove-product";

            removeButton.textContent = "×";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${productName}`
            );

            removeButton.addEventListener("click", () => {
                removeProduct(productName);
            });

            chip.append(chipText, removeButton);

            selectedProductsContainer.append(chip);


            // Individual product details card.

            const card = document.createElement("section");

            card.className = "selected-product-card";

            card.dataset.productCard = productName;

            const heading = document.createElement("h4");

            heading.textContent = productName;

            const fields = document.createElement("div");

            fields.className = "product-requirement-grid";


            fields.append(

                createProductInput(
                    productName,
                    "quantity",
                    "Quantity",
                    "number",
                    "Enter quantity"
                ),

                createProductInput(
                    productName,
                    "width",
                    "Width",
                    "text",
                    "e.g. 8 ft"
                ),

                createProductInput(
                    productName,
                    "height",
                    "Height",
                    "text",
                    "e.g. 4 ft"
                )

            );

            card.append(heading, fields);

            selectedProductDetails.append(card);
        });


        productSelectionError.hidden =
            selectedProducts.size > 0;
    }


    /* =====================================================
       DROPDOWN EVENTS
    ===================================================== */

    dropdownToggle.addEventListener("click", () => {

        updateDropdownState(dropdownMenu.hidden);
    });


    dropdownMenu
        .querySelectorAll("button[data-product]")
        .forEach(option => {

            option.addEventListener("click", () => {

                const productName = option.dataset.product;

                if (selectedProducts.has(productName)) {

                    removeProduct(productName);

                } else {

                    addProduct(productName);
                }

                productSearch.focus();
            });
        });


    // Product search.

    productSearch.addEventListener("input", () => {

        const searchText =
            productSearch.value.trim().toLowerCase();

        dropdownMenu
            .querySelectorAll("button[data-product]")
            .forEach(option => {

                option.hidden =
                    !option.dataset.product
                        .toLowerCase()
                        .includes(searchText);
            });
    });


    // Close dropdown when clicking outside.

    document.addEventListener("click", event => {

        if (!event.target.closest(".multi-select")) {
            updateDropdownState(false);
        }
    });


    /* =====================================================
       GOOGLE APPS SCRIPT SUBMISSION
    ===================================================== */

    function ensureSubmissionFrame() {

        if (submissionFrame) {
            return submissionFrame;
        }

        submissionFrame = document.createElement("iframe");

        submissionFrame.name = "quotationSubmissionFrame";

        submissionFrame.title =
            "Quotation submission response";

        submissionFrame.tabIndex = -1;

        submissionFrame.setAttribute(
            "aria-hidden",
            "true"
        );

        submissionFrame.style.position = "absolute";

        submissionFrame.style.width = "1px";

        submissionFrame.style.height = "1px";

        submissionFrame.style.opacity = "0";

        submissionFrame.style.pointerEvents = "none";

        submissionFrame.style.left = "-9999px";

        document.body.append(submissionFrame);

        return submissionFrame;
    }


    function removeSubmissionForm() {

        if (submissionForm) {

            submissionForm.remove();

            submissionForm = null;
        }
    }


    /* =====================================================
       FINISH SUBMISSION
    ===================================================== */

    function finishSubmission(success, message = "") {

        if (!submissionPending) return;

        submissionPending = false;

        activeRequestId = "";

        window.clearTimeout(submissionTimer);

        submissionTimer = null;

        removeSubmissionForm();

        submitButton.disabled = false;

        submitButton.textContent =
            "Submit Quotation Request →";


        if (success) {

            setStatus(
                message ||
                "Thank you. Your quotation request has been received."
            );

            quotationForm.reset();

            selectedProducts.clear();

            renderSelectedProducts();

            updateDropdownState(false);

            productSearch.value = "";

            dropdownMenu
                .querySelectorAll("button[data-product]")
                .forEach(option => {
                    option.hidden = false;
                });

            window.setTimeout(() => {
                if (!quotationModal.hidden) {
                    closeQuotationModal();
                }
            }, 2300);


        } else {

            setStatus(
                message ||
                "We could not confirm your request. Please contact us on WhatsApp before submitting again.",
                true
            );
        }
    }


    /* =====================================================
       RECEIVE APPS SCRIPT CONFIRMATION
    ===================================================== */

    window.addEventListener("message", event => {

        if (!submissionPending) return;

        let response = event.data;

        if (typeof response === "string") {

            try {

                response = JSON.parse(response);

            } catch (error) {

                return;
            }
        }

        if (
            !response ||
            response.type !== "navashakti-enquiry"
        ) {
            return;
        }

        // Match confirmation to the current request.

        if (
            !response.requestId ||
            response.requestId !== activeRequestId
        ) {
            return;
        }

        finishSubmission(
            response.success === true,
            response.message || ""
        );
    });


    /* =====================================================
       COLLECT FORM DATA
    ===================================================== */

    function collectQuotationPayload() {

        const products = [];

        selectedProducts.forEach(productName => {

            const card =
                selectedProductDetails.querySelector(
                    `[data-product-card="${escapeAttribute(productName)}"]`
                );

            const quantity =
                card.querySelector('[data-field="quantity"]').value.trim();

            const width =
                card.querySelector('[data-field="width"]').value.trim();

            const height =
                card.querySelector('[data-field="height"]').value.trim();


            products.push({

                name: productName,

                quantity: Number(quantity),

                width: width,

                height: height,

                dimensions: `${width} × ${height}`

            });
        });


        return {

            type: "quotation-request",

            customer: {

                name: customerName.value.trim(),

                phone: customerPhone.value.trim(),

                email: customerEmail.value.trim()

            },

            products: products,

            additionalRequirements:
                additionalRequirements.value.trim(),

            submittedAt: new Date().toISOString(),

            source: "Navashakti Marketing Website"

        };
    }


    /* =====================================================
       VALIDATE AND SUBMIT FORM
    ===================================================== */

    quotationForm.addEventListener("submit", event => {

        event.preventDefault();

        setStatus("");

        productSelectionError.hidden = true;


        // Validate customer form fields.

        if (!quotationForm.reportValidity()) {
            return;
        }


        // Require at least one product.

        if (selectedProducts.size === 0) {

            productSelectionError.hidden = false;

            setStatus(
                "Please select at least one product.",
                true
            );

            dropdownToggle.focus();

            return;
        }


        // Validate individual product details.

        const incompleteProduct =
            [...selectedProducts].find(productName => {

                const card =
                    selectedProductDetails.querySelector(
                        `[data-product-card="${escapeAttribute(productName)}"]`
                    );

                const quantity = Number(
                    card.querySelector('[data-field="quantity"]').value
                );

                const width =
                    card.querySelector('[data-field="width"]').value.trim();

                const height =
                    card.querySelector('[data-field="height"]').value.trim();


                return (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    !width ||
                    !height
                );
            });


        if (incompleteProduct) {

            setStatus(
                `Please enter a valid quantity, width and height for ${incompleteProduct}.`,
                true
            );

            const card =
                selectedProductDetails.querySelector(
                    `[data-product-card="${escapeAttribute(incompleteProduct)}"]`
                );

            card.querySelector("input")?.focus();

            return;
        }


        // Validate Apps Script URL.

        if (
            !APPS_SCRIPT_URL ||
            !APPS_SCRIPT_URL.includes("/exec")
        ) {

            setStatus(
                "Google Apps Script URL is missing or invalid.",
                true
            );

            return;
        }


        // Prepare payload.

        const payload = collectQuotationPayload();

        activeRequestId =
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
                ? window.crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        payload.requestId = activeRequestId;


        // Create hidden iframe.

        const frame = ensureSubmissionFrame();


        // Create hidden POST form.

        submissionForm = document.createElement("form");

        submissionForm.method = "POST";

        submissionForm.action = APPS_SCRIPT_URL;

        submissionForm.target = frame.name;

        submissionForm.enctype =
            "application/x-www-form-urlencoded";

        submissionForm.style.display = "none";


        const payloadInput = document.createElement("input");

        payloadInput.type = "hidden";

        payloadInput.name = "payload";

        payloadInput.value = JSON.stringify(payload);

        submissionForm.append(payloadInput);

        document.body.append(submissionForm);


        // Lock submission while request is pending.

        submissionPending = true;

        submitButton.disabled = true;

        submitButton.textContent = "Sending Request...";

        setStatus(
            "Sending your quotation request. Please wait..."
        );


        // Timeout if no confirmation arrives.

        submissionTimer = window.setTimeout(() => {

            finishSubmission(
                false,
                "We could not confirm the submission. Please check your email or contact us on WhatsApp before submitting again."
            );

        }, 30000);


        // Send the request.

        try {

            submissionForm.submit();

        } catch (error) {

            console.error(
                "Navashakti quotation submission error:",
                error
            );

            finishSubmission(
                false,
                "The request could not be sent. Please try again or contact us on WhatsApp."
            );
        }
    });


    /* =====================================================
       KEYBOARD / ACCESSIBILITY
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        if (!dropdownMenu.hidden) {

            updateDropdownState(false);

            dropdownToggle.focus();

        } else if (!quotationModal.hidden) {

            closeQuotationModal();

        } else if (!productModal.hidden) {

            closeProductDetails();
        }
    });


    /* =====================================================
       SECTION REVEAL ANIMATIONS
    ===================================================== */

    const revealTargets = document.querySelectorAll(
        ".products-section, .about-section, .services-section, .coming-soon, .contact-section"
    );


    if (
        "IntersectionObserver" in window &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        const revealObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        revealObserver.unobserve(entry.target);
                    }
                });

            },
            {
                threshold: 0.08
            }
        );


        revealTargets.forEach(element => {

            element.classList.add("reveal-section");

            revealObserver.observe(element);
        });
    }


    // Initial state.

    renderSelectedProducts();

});
