class Carousel {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.track = this.container.querySelector(".carousel-track");
    this.cards = this.track.querySelectorAll(".card:not(.clone)");
    this.prevBtn = this.container.querySelector(".carousel-btn.prev");
    this.nextBtn = this.container.querySelector(".carousel-btn.next");
    this.pagination = this.container.querySelector(".carousel-pagination");

    this.cardWidth = this.cards[0].offsetWidth + 20; // include margin
    this.totalSlides = this.cards.length;
    this.currentIndex = 0;
    this.autoPlayInterval = options.autoplay || 5000;

    this.init();
  }

  init() {
    this.cloneSlides();
    this.createPagination();
    this.goToSlide(this.currentIndex);
    this.attachEvents();
    this.startAutoplay();
  }

  cloneSlides() {
    const first = this.cards[0].cloneNode(true);
    const last = this.cards[this.cards.length - 1].cloneNode(true);
    first.classList.add("clone");
    last.classList.add("clone");

    this.track.appendChild(first);
    this.track.prepend(last);

    this.cards = this.track.querySelectorAll(".card");
  }

  attachEvents() {
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.prevBtn.addEventListener("click", () => this.prevSlide());

    this.paginationButtons.forEach((btn, index) =>
      btn.addEventListener("click", () => this.goToSlide(index))
    );

    this.container.addEventListener("mouseenter", () => this.stopAutoplay());
    this.container.addEventListener("mouseleave", () => this.startAutoplay());
  }

  createPagination() {
    this.pagination.innerHTML = "";
    this.paginationButtons = [];

    for (let i = 0; i < this.totalSlides; i++) {
      const btn = document.createElement("div");
      btn.classList.add("carousel-pagination-button");
      if (i === 0) btn.classList.add("active");
      this.pagination.appendChild(btn);
      this.paginationButtons.push(btn);
    }
  }

  updatePagination() {
    this.paginationButtons.forEach((btn) => btn.classList.remove("active"));
    if (this.paginationButtons[this.currentIndex]) {
      this.paginationButtons[this.currentIndex].classList.add("active");
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.track.style.transition = "transform 0.4s ease";
    const offset = (index + 1) * this.cardWidth;
    this.track.style.transform = `translateX(-${offset}px)`;
    this.updatePagination();
  }

  nextSlide() {
    if (this.currentIndex >= this.totalSlides - 1) {
      this.goToSlide(this.currentIndex + 1);
      setTimeout(() => {
        this.track.style.transition = "none";
        this.currentIndex = 0;
        const offset = (this.currentIndex + 1) * this.cardWidth;
        this.track.style.transform = `translateX(-${offset}px)`;
        this.updatePagination();
      }, 400);
    } else {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex <= 0) {
      this.goToSlide(this.currentIndex - 1);
      setTimeout(() => {
        this.track.style.transition = "none";
        this.currentIndex = this.totalSlides - 1;
        const offset = (this.currentIndex + 1) * this.cardWidth;
        this.track.style.transform = `translateX(-${offset}px)`;
        this.updatePagination();
      }, 400);
    } else {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(
      () => this.nextSlide(),
      this.autoPlayInterval
    );
  }

  stopAutoplay() {
    clearInterval(this.autoplayTimer);
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new Carousel(".carousel-container", {
    autoplay: 5000,
  });
});
