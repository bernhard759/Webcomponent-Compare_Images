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
        <img class="img-comp__image" src="${this.dataset.image1}" alt="image">
        <img class="img-comp__image img-comp__image--overlay" src="${this.dataset.image2}" alt="image">
    </div>
    `;

    // Create some CSS to apply to the shadow DOM
    const style = document.createElement("style");
    style.textContent = `
    .img-comp__container {
        box-sizing: content-box;
        position: relative;
        max-width: 600px;
        aspect-ratio: 3/2;
        margin: 0 auto;
        border: 2px solid rgba(0, 0, 0, 0.8);
        overflow: hidden;
    }

    .img-comp__image {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #484848;
        object-fit: cover;
        object-position: left;
    }

    .img-comp__image--overlay {
      filter: grayscale(1);
      width: var(--slider-pos, 50%);
    }

    .img-comp__slider {
        position: absolute;
        inset: 0;
        background-color: transparent;
        pointer-events: none;
    }

    .img-comp__slider::before {
        content: "";
        position: absolute;
        width: 4px;
        background-color: rgba(0, 0, 0, 0.8);
        top: 0;
        bottom: 0;
        left: var(--slider-pos, 50%);
        transform: translateX(-50%);
    }

    .img-comp__slider::after {
        content: "\\2B0C";
        pointer-events: all;
        cursor: ew-resize;
        position: absolute;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background-color: gainsboro;
        border: 2px solid rgba(0, 0, 0, 0.8);
        top: 50%;
        left: var(--slider-pos, 50%);
        transform: translate(-50%, -50%);
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
    const overlayImg = this.shadowRoot.querySelector(
      ".img-comp__image--overlay"
    );

    // Helper vars
    let moving = false;

    // Create silder
    const slider = document.createElement("DIV");
    slider.setAttribute("class", "img-comp__slider");
    overlayImg.parentElement.appendChild(slider);

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
      if (!moving) return;
      const newPos =
        (Math.max(
          0,
          Math.min(
            e.clientX - imageContainer.getBoundingClientRect().left,
            imageContainer.getBoundingClientRect().width
          )
        ) /
          imageContainer.getBoundingClientRect().width) *
        100;
      // Set new slider position
      imageContainer.style.setProperty("--slider-pos", `${newPos}%`);
    }
  }
}

// Define custom element
customElements.define("img-comparison", ImageComparison);
