const rootNode = document.querySelector(".embla");
const viewportNode = rootNode.querySelector(".embla__viewport");

const prevButtonNode = rootNode.querySelector(".embla__prev");
const nextButtonNode = rootNode.querySelector(".embla__next");

const embla = EmblaCarousel(viewportNode);

prevButtonNode.addEventListener("click", embla.scrollPrev, false);
nextButtonNode.addEventListener("click", embla.scrollNext, false);

const mainView = document.getElementById("mainView");
const imageView = document.getElementById("imageView");
const navbar = document.getElementById("navbar");

let lastIndex = 0;

embla.on("select", () => {
  lastIndex = embla.selectedScrollSnap();
  addCrossPageTransitions();
});

async function animateIfPossible(callback) {
  if (document.startViewTransition) {
    let transition = document.startViewTransition(await callback);
    return transition.finished;
  } else {
    await callback();
  }
}

async function viewImage(element) {
  document
    .querySelector('meta[name="viewport"]')
    .setAttribute(
      "content",
      "width=device-width, initial-scale=1, user-scalable=yes",
    );
  history.pushState({}, "", "");
  removeCrossPageTransitions();
  const ogImage = element.querySelector("img");
  ogImage.style.setProperty("view-transition-name", "imageView");
  animateIfPossible(async () => {
    const imageViewImage = document.getElementById("imageViewImage");
    navbar.hidden = true;
    imageViewImage.src = ogImage.src;
    await imageViewImage.decode();
    mainView.hidden = true;
    imageView.hidden = false;
    adjustImageViewSize();
  });
}

window.addEventListener("popstate", () => {
  closeImageView();
});

window.addEventListener("resize", () => {
  if (!imageView.hidden) {
    adjustImageViewSize();
  }
});

function adjustImageViewSize() {
  const imageViewImage = document.getElementById("imageViewImage");
  const imgRatio = imageViewImage.naturalWidth / imageViewImage.naturalHeight;
  if (imageView.clientWidth / imageView.clientHeight > imgRatio) {
    imageViewImage.classList.remove("w-full");
    imageViewImage.classList.remove("h-auto");
    imageViewImage.classList.add("h-full");
    imageViewImage.classList.add("w-auto");
  } else {
    imageViewImage.classList.remove("h-full");
    imageViewImage.classList.remove("w-auto");
    imageViewImage.classList.add("w-full");
    imageViewImage.classList.add("h-auto");
  }
}

function closeImageView() {
  document
    .querySelector('meta[name="viewport"]')
    .setAttribute(
      "content",
      "width=device-width, initial-scale=1, user-scalable=no",
    );
  animateIfPossible(() => {
    navbar.hidden = false;
    mainView.hidden = false;
    imageView.hidden = true;
    embla.reInit({
      startIndex: lastIndex,
    });
  }).then(() => {
    const emblaSlidesImgs = document.querySelectorAll(".embla__slide img");
    emblaSlidesImgs.forEach((img) => {
      img.style.removeProperty("view-transition-name");
    });
    addCrossPageTransitions();
  });
}

function removeCrossPageTransitions() {
  const elements = document.querySelectorAll("[crosspagetransition]");
  elements.forEach((element) => {
    element.style.removeProperty("view-transition-name");
  });
}

function addCrossPageTransitions() {
  const elements = document.querySelectorAll("[crosspagetransition]");
  elements.forEach((element) => {
    element.style.removeProperty("view-transition-name");
    const name = element.getAttribute("crosspagetransition");
    element.style.setProperty("view-transition-name", name);
  });
  if (lastIndex !== 0) {
    document
      .querySelectorAll(".embla__slide img")[0]
      .style.removeProperty("view-transition-name");
  } else {
    document
      .querySelectorAll(".embla__slide img")[0]
      .style.setProperty("view-transition-name", "{{ 'img-' + page }}");
  }
}
