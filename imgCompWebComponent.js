// Custom element class
class ImageComparison extends HTMLElement {
  // Constructor
  constructor() {
    // Superconstructor
    super();

    // Custom element dataset
    //console.log(this.dataset.image1);

    // HTML template
    const template = document.createElement("template");
    template.innerHTML = `
    <div class="img-comp__container">
        <div class="img-comp__image">
            <img src="${this.dataset.image1}" alt="image">
        </div>
        <div class="img-comp__image img-comp__image--overlay">
            <img src="${this.dataset.image2}" alt="image">
        </div>
    </div>
    `;

    // Create some CSS to apply to the shadow DOM
    const style = document.createElement("style");
    style.textContent = `
    .img-comp__container {
        --container-width: 600px;
        --container-height: auto;
        box-sizing: border-box;
        position: relative;
        max-width: 600px;
        aspect-ratio: 3/2;
        margin: 0 auto;
        border: 2px solid rgba(0, 0, 0, 0.8);
    }

    .img-comp__image {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #484848;
    }

    .img-comp__image::after {
        content: "";
        opacity: 0;
        transition: opacity 250ms ease;

    }

    .img-comp__image:hover::after {
        position: absolute;
        color: white;
        font-size: 0.75rem;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding-inline: 1em;
        padding-block: 0.5em;
        opacity: 1;
    }

    .img-comp__image:not(.img-comp__image--overlay):hover::after {
        content: "colored";
        top: 50%;
        transform: translateY(-50%);
        right: 5%;

    }

    .img-comp__image--overlay:hover::after {
        content: "grayscale";
        top: 50%;
        transform: translateY(-50%);
        left: 5%;
    }

    .img-comp__image:hover img {
        opacity: 0.5;
    }

    .img-comp__image img {
        display: block;
        width: var(--container-width);
        height: var(--container-height);
        object-fit: cover;
        transition: opacity 250ms ease;
    }

    .img-comp__image--overlay img {
        filter: grayscale(1);
    }

    .img-comp__slider {
        position: absolute;
        cursor: ew-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        background-color: gainsboro;
        border: 2px solid rgba(0, 0, 0, 0.8);
        opacity: 0.9;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .img-comp__slider::before {
        content: "";
        position: absolute;
        width: 4px;
        background-color: rgba(0, 0, 0, 0.8);
        height: calc((var(--container-height)/2) - (25px / 2));
        bottom: calc((-1*(var(--container-height)/2)) + (25px / 2));
        left: calc(50% - 2px);
    }


    .img-comp__slider::after {
        content: "";
        position: absolute;
        width: 4px;
        background-color: rgba(0, 0, 0, 0.8);
        height: calc((var(--container-height)/2) - (25px / 2));
        top: calc((-1*(var(--container-height)/2)) + (25px / 2));
        left: calc(50% - 2px);
    }`;

    // Create Shadow DOM and append Template content and CSS Style to it
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(style, template.content.cloneNode(true));

    // Do the setup
    this.imageCompSetup();
  }

  // Setup method
  imageCompSetup() {
    // HTML elements
    const imageContainer = this.shadowRoot.querySelector(
      ".img-comp__container"
    );
    const overlayImageDiv = this.shadowRoot.querySelector(
      ".img-comp__image--overlay"
    );

    // Helper vars
    let moving = false;
    let imageContainerWidth = imageContainer.getBoundingClientRect().width;
    let sliderPosRatio = 0.5;

    // Start with ImageDiv at 50% of the container
    overlayImageDiv.style.width = overlayImageDiv.offsetWidth / 2 + "px";

    // Create silder
    const slider = document.createElement("DIV");
    slider.setAttribute("class", "img-comp__slider");
    slider.innerHTML = "&#11020;";
    slider.style.left = overlayImageDiv.offsetWidth + "px";
    overlayImageDiv.parentElement.appendChild(slider);

    // Pointer eventlisteners
    slider.addEventListener("pointerdown", slideStart);
    window.addEventListener("pointerup", slideStop);

    // Start slide
    function slideStart(e) {
      e.preventDefault();
      moving = true;
      window.addEventListener("pointermove", slideMove);
    }

    // Stop slide
    function slideStop() {
      moving = false;
    }

    // Slider move
    function slideMove(e) {
      // Guard clause
      if (!moving) return false;
      let newPos = e.clientX - imageContainer.getBoundingClientRect().left;
      // Dont position slider outside the image
      if (newPos < 0) {
        newPos = 0;
      } else if (newPos > imageContainer.getBoundingClientRect().width - 4) {
        newPos = imageContainer.getBoundingClientRect().width - 4;
      }
      // Set new slider position
      slider.style.left = newPos + "px";
      overlayImageDiv.style.width = newPos + "px";
      // Update slider position ratio
      sliderPosRatio = newPos / imageContainerWidth;
    }

    // Resize Observer
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        // New container width
        imageContainerWidth = entry.target.getBoundingClientRect().width;
        slider.style.left = sliderPosRatio * imageContainerWidth + "px";
        overlayImageDiv.style.width =
          sliderPosRatio * imageContainerWidth + "px";
        // Set image container width and height custom css properties
        entry.target.style.setProperty(
          "--container-width",
          imageContainerWidth + "px"
        );
        entry.target.style.setProperty(
          "--container-height",
          imageContainer.getBoundingClientRect().height + "px"
        );
      });
    });

    // Observe
    observer.observe(imageContainer);
  }
}

// Define custom element
customElements.define("img-comparison", ImageComparison);
