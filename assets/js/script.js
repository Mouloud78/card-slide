import cardsData from "../data/data.js";

class Carousel {
  constructor(containerSelector, cardsData, config = {}) {
    this.container = document.querySelector(containerSelector);
    this.track = this.container.querySelector(".carousel-track");
    this.paginationContainer = this.container.querySelector(
      ".carousel-pagination"
    );
    this.prevBtn = this.container.querySelector(".carousel-btn.prev");
    this.nextBtn = this.container.querySelector(".carousel-btn.next");

    this.cardsData = cardsData;
    this.slidesPerView = config.slidesPerView || 1;
    this.autoPlayDelay = config.autoPlayDelay || 5000;
    this.autoPlay = config.autoPlay ?? true;

    this.currentIndex = 1; // commence à 1 à cause du clone au début (dernier clone)
    this.timer = null;

    this.init();
  }

  createCard(card) {
    const article = document.createElement("article");
    article.classList.add("card");
    article.innerHTML = `
      <figure class="card-image">
        <img src="${card.image}" alt="${card.tag} image" />
        <figcaption class="card-tag">${card.tag}</figcaption>
      </figure>
      <div class="card-content">
        <h3 class="card-title">${card.title}</h3>
        <p class="card-text">${card.text}</p>
        <footer class="card-footer">
          <address class="card-profile">
            <img src="${card.profileImage}" alt="image user" />
            <div class="card-profile-info">
              <span class="card-profile-name">${card.profileName}</span>
              <span class="card-profile-role">${card.profileRole}</span>
            </div>
          </address>
          <a href="#" class="card-button">Read More</a>
        </footer>
      </div>
    `;
    return article;
  }

  populateCards() {
    this.track.innerHTML = "";

    // Clone dernière carte et insérer au début
    const lastCardClone = this.createCard(
      this.cardsData[this.cardsData.length - 1]
    );
    lastCardClone.classList.add("clone");
    this.track.appendChild(lastCardClone);

    // Cartes réelles
    this.cardsData.forEach((card) => {
      const cardEl = this.createCard(card);
      this.track.appendChild(cardEl);
    });

    // Clone première carte et insérer à la fin
    const firstCardClone = this.createCard(this.cardsData[0]);
    firstCardClone.classList.add("clone");
    this.track.appendChild(firstCardClone);

    // Met à jour la liste des cartes (après ajout clones)
    this.cards = this.track.children;
  }

  updatePagination() {
    this.paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(this.cardsData.length / this.slidesPerView);

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.classList.add("carousel-pagination-button");
      if (i === this.currentIndex - 1) {
        // -1 car currentIndex commence à 1
        dot.classList.add("active");
      }
      dot.addEventListener("click", () => {
        this.goToSlide(i + 1); // +1 car index 0 = clone dernière
        this.resetAutoplay();
      });
      this.paginationContainer.appendChild(dot);
    }
  }

  updateSlidePosition(animate = true) {
    const cardWidth = this.cards[0].offsetWidth + 20; // +20 si margin-right : ajuste au besoin
    const offset = this.currentIndex * cardWidth * this.slidesPerView;

    if (animate) {
      this.track.style.transition = "transform 0.4s ease";
    } else {
      this.track.style.transition = "none";
    }

    this.track.style.transform = `translateX(-${offset}px)`;

    this.updatePagination();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlidePosition();
  }

  nextSlide() {
    this.currentIndex++;
    this.updateSlidePosition();
  }

  prevSlide() {
    this.currentIndex--;
    this.updateSlidePosition();
  }

  resetAutoplay() {
    if (!this.autoPlay) return;
    clearInterval(this.timer);
    this.timer = setInterval(() => this.nextSlide(), this.autoPlayDelay);
  }

  attachEvents() {
    this.nextBtn.addEventListener("click", () => {
      this.nextSlide();
      this.resetAutoplay();
    });

    this.prevBtn.addEventListener("click", () => {
      this.prevSlide();
      this.resetAutoplay();
    });

    window.addEventListener("resize", () => {
      this.updateSlidePosition(false); // false = sans animation pour resize
    });

    // Écoute la fin de transition pour reset la position si on est sur un clone
    this.track.addEventListener("transitionend", () => {
      if (this.cards[this.currentIndex].classList.contains("clone")) {
        if (this.currentIndex === 0) {
          // On est sur clone dernière carte -> aller à la vraie dernière
          this.currentIndex = this.cards.length - 2;
        } else if (this.currentIndex === this.cards.length - 1) {
          // On est sur clone première carte -> aller à la vraie première
          this.currentIndex = 1;
        }
        this.updateSlidePosition(false); // reset position sans animation
      }
    });
  }

  init() {
    this.populateCards();
    this.attachEvents();

    // Positionne au début (sur la vraie première carte, index = 1)
    this.updateSlidePosition(false);

    if (this.autoPlay) {
      this.timer = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }
  }
}

// ----------------------
// 🚀 Initialisation
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  new Carousel(".carousel-container", cardsData, {
    autoPlayDelay: 5000,
    slidesPerView: 1,
    autoPlay: true,
  });
});
