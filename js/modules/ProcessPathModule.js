const SVG_NS = "http://www.w3.org/2000/svg";
const TURN_RADIUS = 80;
const START_AT = 0.85;
const END_AT = 0.55;
const EASE = 0.14;

const clamp = (value) => Math.min(1, Math.max(0, value));

const createPath = (className) => {
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", className);
  return path;
};

const buildPath = (points, bounds, cols) => {
  const marks = [];
  let length = 0;
  let d = "";

  const lineTo = (from, to) => {
    d += ` L ${to.x} ${to.y}`;
    length += Math.hypot(to.x - from.x, to.y - from.y);
  };

  const turn = (from, to) => {
    const right = from.x > bounds.mid;
    const edge = right ? bounds.turnRight : bounds.turnLeft;
    const dir = right ? 1 : -1;
    const sweep = right ? 1 : 0;
    const r = Math.max(0, Math.min(TURN_RADIUS, (to.y - from.y) / 2, Math.abs(edge - from.x)));
    const inner = edge - dir * r;

    lineTo(from, { x: inner, y: from.y });
    d += ` A ${r} ${r} 0 0 ${sweep} ${edge} ${from.y + r}`;
    d += ` L ${edge} ${to.y - r}`;
    d += ` A ${r} ${r} 0 0 ${sweep} ${inner} ${to.y}`;
    length += Math.PI * r + (to.y - from.y - 2 * r);
    lineTo({ x: inner, y: to.y }, to);
  };

  const first = points[0];
  const lead = cols > 1 ? { x: bounds.left, y: first.y } : { x: first.x, y: first.y };
  d = `M ${lead.x} ${lead.y}`;
  lineTo(lead, first);
  marks.push(length);

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    if (cols > 1 && Math.abs(from.y - to.y) > 2) turn(from, to);
    else lineTo(from, to);
    marks.push(length);
  }

  if (cols > 1 && points.length > 1) {
    const last = points[points.length - 1];
    const before = points[points.length - 2];
    const leftward = Math.abs(last.y - before.y) <= 2 ? last.x < before.x : last.x > bounds.mid;
    lineTo(last, { x: leftward ? bounds.left : bounds.right, y: last.y });
  }

  return { d: d.trim(), marks, length };
};

function setup(root) {
  const list = root.querySelector(".processPathListJS");
  const steps = list ? [...list.querySelectorAll(":scope > .process-step")] : [];
  const dots = steps.map((step) => step.querySelector(".process-step__dot"));
  if (!steps.length || dots.some((dot) => !dot)) return;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "process-path__svg");
  svg.setAttribute("aria-hidden", "true");
  const track = createPath("process-path__track");
  const line = createPath("process-path__line");
  svg.append(track, line);
  list.prepend(svg);
  root.classList.add("is-ready");

  let marks = [];
  let total = 0;
  let firstY = 0;
  let lastY = 0;
  let current = 0;
  let target = 0;
  let frame = 0;

  const paint = () => {
    line.style.strokeDashoffset = String(total * (1 - current));
    const head = current * total + 0.5;
    steps.forEach((step, index) => step.classList.toggle("is-on", head >= marks[index]));
  };

  const measure = () => {
    const box = list.getBoundingClientRect();
    const span = Math.max(1, (START_AT - END_AT) * window.innerHeight + (lastY - firstY));
    target = clamp((START_AT * window.innerHeight - (box.top + firstY)) / span);
  };

  const tick = () => {
    frame = 0;
    measure();
    const gap = target - current;
    current = Math.abs(gap) < 0.0005 ? target : current + gap * EASE;
    paint();
    if (current !== target) frame = window.requestAnimationFrame(tick);
  };

  const request = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };

  const layout = () => {
    const cols = Math.max(1, parseInt(getComputedStyle(list).getPropertyValue("--path-cols"), 10) || 1);
    steps.forEach((step, index) => {
      const row = Math.floor(index / cols);
      const pos = index % cols;
      step.style.setProperty("--col", String(row % 2 ? cols - pos : pos + 1));
      step.style.setProperty("--row", String(row + 1));
    });

    const box = list.getBoundingClientRect();
    const points = dots.map((dot) => {
      const rect = dot.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top };
    });

    const left = -box.left;
    const right = document.documentElement.clientWidth - box.left;
    const bounds = { left, right, mid: box.width / 2, turnLeft: 0, turnRight: box.width };
    const path = buildPath(points, bounds, cols);
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    track.setAttribute("d", path.d);
    line.setAttribute("d", path.d);
    line.style.strokeDasharray = `${path.length} ${path.length}`;
    marks = path.marks;
    total = path.length;
    firstY = points[0].y;
    lastY = points[points.length - 1].y;
    measure();
    paint();
    request();
  };

  let resizeFrame = 0;
  const relayout = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(layout);
  };
  new ResizeObserver(relayout).observe(list);

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", relayout);
  layout();
}

export default function ProcessPathModule() {
  document.querySelectorAll(".processPathJS").forEach(setup);
}
