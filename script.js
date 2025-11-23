/* Clean interactions for separate project pages
   - Smooth scroll for anchor links
   - Gallery prev/next buttons for horizontal galleries (fixed height)
*/

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Setup gallery controls: for each .gallery-wrap, wire prev/next to scroll by one image
  document.querySelectorAll('.gallery-wrap').forEach(wrap => {
    const gallery = wrap.querySelector('.gallery');
    const prev = wrap.querySelector('.gallery-btn.prev');
    const next = wrap.querySelector('.gallery-btn.next');

    if (!gallery) return;

    // helper: scroll to next item by gallery width of one visible item
    const scrollByOne = (direction = 1) => {
      // find center of gallery + compute offset to next image center
      const items = Array.from(gallery.querySelectorAll('.gallery-item'));
      if (!items.length) return;
      // pick first fully-visible item as reference
      const rect = gallery.getBoundingClientRect();
      // compute distances to centers and pick nearest in direction
      const centers = items.map(it => {
        const r = it.getBoundingClientRect();
        return { el: it, center: r.left + r.width/2 };
      });
      const galleryCenter = rect.left + rect.width/2;
      // find current index nearest to center
      let nearestIndex = 0;
      let nearestDist = Infinity;
      centers.forEach((c, i) => {
        const d = Math.abs(c.center - galleryCenter);
        if (d < nearestDist) { nearestDist = d; nearestIndex = i; }
      });
      let targetIndex = nearestIndex + direction;
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex >= items.length) targetIndex = items.length - 1;
      const target = items[targetIndex];
      // scroll so target is centered
      const scrollLeft = target.offsetLeft - (gallery.clientWidth/2 - target.clientWidth/2);
      gallery.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => scrollByOne(-1));
    if (next) next.addEventListener('click', () => scrollByOne(1));

    // keyboard navigation when gallery focused
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByOne(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollByOne(1); }
    });

    // enable focus for accessibility
    gallery.setAttribute('tabindex', '0');
  });
});
