// Books
export { BookDetails } from "./books/BookDetails";
export { BookListContainer } from "./books/BookListContainer";

// Carousels — client components (accept optional data props; fall back to static)
export { PublisherCarousel } from "./carousel/PublisherCarousel";
export { HeroCarousel } from "./carousel/HeroCarousel";
export { CategoryCarousel } from "./carousel/CategoryCarousel";
export { BookCarousel } from "./carousel/BookCarousel";
export { AuthorCarousel } from "./carousel/AuthorCarousel";

// Carousels — RSC wrappers (fetch from DB, pass real data to client components)
export { HeroCarouselServer } from "./carousel/HeroCarouselServer";
export { CategoryCarouselServer } from "./carousel/CategoryCarouselServer";
export { BookCarouselServer } from "./carousel/BookCarouselServer";
export { AuthorCarouselServer } from "./carousel/AuthorCarouselServer";
export { PublisherCarouselServer } from "./carousel/PublisherCarouselServer";

// Footer
export { Footer } from "./Footer/Footer";

// Navbar
export { Navbar } from "./navbar/Navbar";

// Promotion
export { AppPromoSection } from "./promotion/AppPromoSection";
