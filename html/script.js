const htmlInput = document.getElementById('html');
const cssInput = document.getElementById('css');
const jsInput = document.getElementById('js');
const output = document.getElementById('output');
const runBtn = document.getElementById('run');
const themeBtn = document.getElementById('toggleTheme');
const body = document.getElementById('body');

function updatePreview() {
  const html = htmlInput.value;
  const css = cssInput.value;
  const js = jsInput.value;

  const doc = `
    <html>
      <head><style>${css}</style></head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;
  output.srcdoc = doc;

  localStorage.setItem("editor-html", html);
  localStorage.setItem("editor-css", css);
  localStorage.setItem("editor-js", js);
}

htmlInput.value = localStorage.getItem("editor-html") || "<h1>Hello</h1>";
cssInput.value = localStorage.getItem("editor-css") || "h1 { color: green; }";
jsInput.value = localStorage.getItem("editor-js") || "console.log('Hello!');";

runBtn.addEventListener("click", updatePreview);

themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("bg-light", "text-dark");
    body.classList.add("bg-dark", "text-light");
    themeBtn.textContent = "☀️ Light Mode";
  } else {
    body.classList.remove("bg-dark", "text-light");
    body.classList.add("bg-light", "text-dark");
    themeBtn.textContent = "🌙 Dark Mode";
  }
});

updatePreview();

// Drag-to-resize logic
const resizers = document.querySelectorAll(".resizer");

resizers.forEach(resizer => {
  let prevPanel = resizer.previousElementSibling;
  let nextPanel = resizer.nextElementSibling;
  let startY, startHeightPrev, startHeightNext;

  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startY = e.clientY;
    startHeightPrev = prevPanel.offsetHeight;
    startHeightNext = nextPanel.offsetHeight;

    const onMouseMove = (e) => {
      const dy = e.clientY - startY;
      const containerHeight = resizer.parentElement.clientHeight;
      const newHeightPrev = ((startHeightPrev + dy) / containerHeight) * 100;
      const newHeightNext = ((startHeightNext - dy) / containerHeight) * 100;

      prevPanel.style.flex = `0 0 ${newHeightPrev}%`;
      nextPanel.style.flex = `0 0 ${newHeightNext}%`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
});
