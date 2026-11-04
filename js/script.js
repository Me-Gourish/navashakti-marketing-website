
/* =========================================
   NAVASHAKTI - PRODUCT DETAILS POPUP
   Product images + descriptions + quotation
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const detailsModal = document.querySelector(".product-details-modal");

    if (!detailsModal) {
        console.error("Product details modal not found in HTML.");
        return;
    }

    const detailsTitle = document.getElementById("productDetailsTitle");
    const detailsIntro = document.getElementById("productDetailsIntro");
    const detailsDescription = document.getElementById("productDetailsDescription");
    const detailsGrid = document.getElementById("productDetailsGrid");
    const detailsQuoteButton = document.getElementById("productDetailsQuote");

    const productDetails = {

        "Green Boards": {
            id: "green_board",
            intro: "Reliable writing surfaces for classrooms and educational institutions.",
            description: "Green boards provide a comfortable writing surface for everyday teaching. Explore the available board dimensions, surface options and frame configurations.",
            features: [
                {
                    title: "Available Dimensions",
                    description: "Multiple standard sizes are available. Custom dimensions can also be requested.",
                    image: "assets/products/green_board/dimensions.jpg"
                },
                {
                    title: "Writing Surface",
                    description: "A classroom-friendly green writing surface designed for regular use.",
                    image: "assets/products/green_board/surface.jpg"
                },
                {
                    title: "Frame Options",
                    description: "Explore the available frame and finishing options.",
                    image: "assets/products/green_board/frame.jpg"
                },
                {
                    title: "Usage",
                    description: "Suitable for schools, colleges, classrooms and training spaces.",
                    image: "assets/products/green_board/usage.jpg"
                }
            ]
        },

        "Magnetic Green Boards": {
            id: "magnetic_green_board",
            intro: "A practical combination of writing and magnetic display functionality.",
            description: "Magnetic green boards allow users to write on the board and display learning materials using suitable magnets.",
            features: [
                {
                    title: "Available Dimensions",
                    description: "Different dimensions to suit classrooms and institutional requirements.",
                    image: "assets/products/magnetic_green_board/dimensions.jpg"
                },
                {
                    title: "Magnetic Surface",
                    description: "A magnetic writing surface for displaying teaching materials.",
                    image: "assets/products/magnetic_green_board/surface.jpg"
                },
                {
                    title: "Frame Options",
                    description: "Frame and finishing options for different installation requirements.",
                    image: "assets/products/magnetic_green_board/frame.jpg"
                },
                {
                    title: "Usage",
                    description: "Useful for classrooms, learning centres and presentation spaces.",
                    image: "assets/products/magnetic_green_board/usage.jpg"
                }
            ]
        },

        "White Boards": {
            id: "white_board",
            intro: "Clean and versatile writing surfaces for modern learning and working environments.",
            description: "White boards support teaching, planning, presentations and collaborative discussions in educational and professional spaces.",
            features: [
                {
                    title: "Available Dimensions",
                    description: "Different board sizes for classrooms, offices and meeting rooms.",
                    image: "assets/products/white_board/dimensions.jpg"
                },
                {
                    title: "Writing Surface",
                    description: "A smooth white surface designed for use with suitable whiteboard markers.",
                    image: "assets/products/white_board/surface.jpg"
                },
                {
                    title: "Frame Options",
                    description: "Available frame and finishing configurations.",
                    image: "assets/products/white_board/frame.jpg"
                },
                {
                    title: "Usage",
                    description: "Suitable for schools, offices, conference rooms and training centres.",
                    image: "assets/products/white_board/usage.jpg"
                }
            ]
        },

        "Notice Boards": {
            id: "notice_board",
            intro: "An organised display solution for announcements, notices and information.",
            description: "Notice boards provide a dedicated space to display important messages, circulars, announcements and other information.",
            features: [
                {
                    title: "Available Dimensions",
                    description: "Multiple dimensions to suit different wall spaces and requirements.",
                    image: "assets/products/notice_board/dimensions.jpg"
                },
                {
                    title: "Board Surface",
                    description: "Display surface options for pinning notices and information.",
                    image: "assets/products/notice_board/surface.jpg"
                },
                {
                    title: "Frame Options",
                    description: "Different frame and finishing options.",
                    image: "assets/products/notice_board/frame.jpg"
                },
                {
                    title: "Usage",
                    description: "Suitable for schools, colleges, offices and public spaces.",
                    image: "assets/products/notice_board/usage.jpg"
                }
            ]
        },

        "Smart Boards": {
            id: "smart_board",
            intro: "Interactive digital display solutions for modern teaching and presentations.",
            description: "Smart boards support technology-enabled learning and presentations. Specifications depend on the selected model.",
            features: [
                {
                    title: "Display",
                    description: "Explore the display size and resolution options available for the selected model.",
                    image: "assets/products/smart_board/display.jpg"
                },
                {
                    title: "Technology",
                    description: "Interactive display features and supported technology.",
                    image: "assets/products/smart_board/technology.jpg"
                },
                {
                    title: "Connectivity",
                    description: "Explore the available connectivity and input options.",
                    image: "assets/products/smart_board/connectivity.jpg"
                },
                {
                    title: "Installation",
                    description: "Installation and setup requirements depend on the selected configuration.",
                    image: "assets/products/smart_board/installation.jpg"
                }
            ]
        },

        "Board Stands": {
            id: "board_stand",
            intro: "Practical stand solutions for flexible board placement and positioning.",
            description: "Board stands provide an alternative to wall-mounted installations. Available configurations and dimensions can be discussed based on your requirements.",
            features: [
                {
                    title: "Available Dimensions",
                    description: "Stand dimensions and height options based on the board requirements.",
                    image: "assets/products/board_stands/dimensions.jpg"
                },
                {
                    title: "Material",
                    description: "Explore the material and finishing options available.",
                    image: "assets/products/board_stands/material.jpg"
                },
                {
                    title: "Configurations",
                    description: "Different stand configurations to suit your board requirements.",
                    image: "assets/products/board_stands/configuration.jpg"
                },
                {
                    title: "Mobility",
                    description: "Explore available mobility and positioning options.",
                    image: "assets/products/board_stands/mobility.jpg"
                }
            ]
        }

    };

    let activeProductName = "";

    // OPEN PRODUCT DETAILS

    function openProductDetails(productName) {

        const product = productDetails[productName];

        if (!product) {
            console.warn("Product details not configured:", productName);
            return;
        }

        activeProductName = productName;

        detailsTitle.textContent = productName;
        detailsIntro.textContent = product.intro;
        detailsDescription.textContent = product.description;

        detailsGrid.innerHTML = "";

        product.features.forEach(feature => {

            const card = document.createElement("article");
            card.className = "product-spec-card";

            const image = document.createElement("img");
            image.src = feature.image;
            image.alt = `${productName} - ${feature.title}`;
            image.loading = "lazy";

            // Hide a missing image without hiding its description.
            image.addEventListener("error", () => {
                image.style.display = "none";
            });

            const heading = document.createElement("h3");
            heading.textContent = feature.title;

            const description = document.createElement("p");
            description.textContent = feature.description;

            card.append(image, heading, description);
            detailsGrid.appendChild(card);
        });

        detailsModal.hidden = false;
        document.body.classList.add("modal-open");
    }

    // CLOSE PRODUCT DETAILS

    function closeProductDetails() {
        detailsModal.hidden = true;
        document.body.classList.remove("modal-open");
    }

    // PRODUCT CARD CLICK

    document.querySelectorAll(".product-card").forEach(card => {

        card.addEventListener("click", event => {

            const heading = card.querySelector("h3");

            if (!heading) return;

            const productName = heading.textContent.trim();

            if (!productDetails[productName]) return;

            event.preventDefault();
            openProductDetails(productName);
        });

    });

    // CLOSE BUTTONS AND BACKDROP

    detailsModal.querySelectorAll("[data-close-product-details]").forEach(button => {
        button.addEventListener("click", closeProductDetails);
    });

    detailsModal.addEventListener("click", event => {

        if (event.target.classList.contains("product-details-backdrop")) {
            closeProductDetails();
        }

    });

    // ESCAPE KEY

    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && !detailsModal.hidden) {
            closeProductDetails();
        }

    });

    // MOVE FROM PRODUCT DETAILS TO QUOTATION

    if (detailsQuoteButton) {

        detailsQuoteButton.addEventListener("click", () => {

            const product = productDetails[activeProductName];

            if (!product) return;

            closeProductDetails();

            // Open the existing quotation popup.
            const quotationTrigger = document.querySelector(".open-quotation");

            if (quotationTrigger) {
                quotationTrigger.click();
            } else {
                const quotationModal = document.getElementById("quotationModal");

                if (quotationModal) {
                    quotationModal.hidden = false;
                    document.body.classList.add("modal-open");
                }
            }

            // Select the product in the existing multi-select dropdown.
            const productButton = document.querySelector(
                `[data-product="${product.id}"]`
            );

            if (productButton) {
                const isAlreadySelected =
                    productButton.classList.contains("selected");

                if (!isAlreadySelected) {
                    productButton.click();
                }
            }

        });

    }

});
