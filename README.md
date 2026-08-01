# The ChocoCraze Frontend

Standalone, production-oriented static frontend for a premium homemade chocolate brand. The folder is intentionally isolated from the surrounding WordPress install so it can be moved into a separate project, converted into a theme, or used as an Elementor/ACF design reference.

## Open Locally

Open `index.html` in a browser, or serve the folder with any static server.

## Structure

- `index.html` is the immersive home page.
- `pages/` contains all requested inner pages: About, Products, Categories, Product Detail, Gift Hampers, Occasions, Gallery, Testimonials, FAQ, Blog, Contact, Cart, Checkout, Wishlist, My Account, 404, Privacy and Terms.
- `assets/css/styles.css` contains design tokens, layout primitives, responsive rules and components.
- `assets/js/app.js` contains guarded progressive enhancement for animation and interaction libraries.
- `assets/images/` contains portable project imagery.
- `components/`, `layouts/` and `partials/` document reusable HTML patterns for WordPress conversion.

## Library Strategy

The HTML uses deferred CDN libraries for GSAP, ScrollTrigger, SplitText, Flip, Swiper, Lenis, Lottie, Three.js, CountUp, Motion, Anime.js, Vanilla Tilt, LightGallery, Isotope, Matter.js and Lucide icons. The site remains usable if a library fails to load because `app.js` guards each enhancement.

For a final production deployment, pin CDN versions to the exact approved versions, self-host critical libraries when possible, and include Subresource Integrity hashes.

## WordPress/WooCommerce Mapping

- Product cards map to WooCommerce product loops.
- Product Detail maps to a single product template with gallery, sticky purchase panel, tabs, related products, upsells and cross-sells.
- Gift hamper options can be implemented with WooCommerce product add-ons or ACF repeater fields.
- Occasion cards can become taxonomy archives or ACF-managed landing pages.
- Contact form can be wired to Contact Form 7, Gravity Forms or a custom REST endpoint.
- Cart, Checkout, Wishlist and My Account pages are styled shells for WooCommerce template overrides.

## Accessibility and Performance Notes

- Semantic landmarks, skip links, labelled inputs, focus-visible states and reduced-motion support are included.
- Images are local and lazy loaded except the hero.
- Motion is progressive enhancement and disabled for reduced-motion users.
- Layout uses responsive CSS Grid, Flexbox, `clamp()`, logical properties and container queries.

