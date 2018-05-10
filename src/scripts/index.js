import "swiper/dist/css/swiper.css";
import "styles/index.scss";
import "lazysizes";
import {
  Swiper,
  Navigation,
  Pagination,
  Lazy
} from "swiper/dist/js/swiper.esm.js";

Swiper.use([Navigation, Pagination, Lazy]);
new Swiper(".swiper-container", {
  spaceBetween: 32,
  slidesPerView: 3,
  breakpoints: {
    767: {
      slidesPerView: 1
    },
    1199: {
      slidesPerView: 2
    }
  },
  preloadImages: false,
  lazy: true,
  pagination: {
    el: ".swiper-pagination",
    type: "bullets"
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});
