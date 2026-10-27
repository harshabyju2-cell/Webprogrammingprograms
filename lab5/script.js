const items = [...document.querySelectorAll(".item")];
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
const lbCount = document.getElementById("lbCount");
const playBtn = document.getElementById("play");
const DELAY = 3000;
let index = 0, timer = null, lastFocus = null;
 
function show(n) {
  index = (n + items.length) % items.length;
  const img = items[index].querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = items[index].dataset.title;
  lbCount.textContent = `${index + 1} / ${items.length}`;
  lbImg.classList.remove("fade");
  void lbImg.offsetWidth; // restart the fade animation
  lbImg.classList.add("fade");
}
function startAuto() {
  stopAuto();
  timer = setInterval(() => show(index + 1), DELAY);
  playBtn.textContent = "Pause";
  playBtn.setAttribute("aria-pressed", "true");
}
function stopAuto() {
  clearInterval(timer);
  timer = null;
  playBtn.textContent = "Auto-play";
  playBtn.setAttribute("aria-pressed", "false");
}
function move(step) {
  show(index + step);
  if (timer) startAuto(); // restart the countdown after manual change
}
function openBox(n, auto) {
  lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.classList.add("lock");
  show(n);
  if (auto) startAuto();
  document.getElementById("close").focus();
}
function closeBox() {
  stopAuto();
  lb.hidden = true;
  document.body.classList.remove("lock");
  if (lastFocus) lastFocus.focus();
}
 
items.forEach((el, n) => el.addEventListener("click", () => openBox(n, false)));
document.getElementById("startShow").addEventListener("click", () => openBox(0, true));
document.getElementById("next").addEventListener("click", () => move(1));
document.getElementById("prev").addEventListener("click", () => move(-1));
document.getElementById("close").addEventListener("click", closeBox);
playBtn.addEventListener("click", () => (timer ? stopAuto() : startAuto()));
lb.addEventListener("click", (e) => { if (e.target === lb) closeBox(); });
 
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "ArrowRight") move(1);
  else if (e.key === "ArrowLeft") move(-1);
  else if (e.key === "Escape") closeBox();
});
 
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
  touchX = null;
});