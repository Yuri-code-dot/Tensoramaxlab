const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});


// Character-scramble identity: symbols resolve into the lab name, then dissolve.
(() => {
  const lines = [...document.querySelectorAll(".morph-line")];
  const noise = document.querySelector(".morph-noise");
  if (!lines.length) return;
  const glyphs = "$&-##-+*;:!?/\\\\<>[]{}~=_%";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
  const targets = lines.map(el => el.dataset.text || el.textContent);
  let start = performance.now();
  const cycle = 5200;
  const settle = 0.64;
  function render(now) {
    const phase = reduced ? 1 : ((now - start) % cycle) / cycle;
    const dissolve = phase > .72 ? (phase - .72) / .28 : 0;
    lines.forEach((el, row) => {
      const target = targets[row];
      const progress = phase < settle ? phase / settle : 1;
      const revealCount = Math.floor(progress * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const settled = i < revealCount && phase < .72;
        out += settled ? target[i] : (Math.random() < (dissolve * .95 + .18) ? randomGlyph() : target[i]);
      }
      if (reduced) out = target;
      el.textContent = out;
    });
    if (noise) {
      if (!reduced) {
        let pattern = "";
        const width = window.innerWidth < 600 ? 38 : 72;
        for (let i = 0; i < width; i++) pattern += randomGlyph() + (i % 9 === 8 ? "\\n" : "");
        noise.textContent = pattern;
      } else noise.textContent = "";
    }
    if (!reduced) requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
