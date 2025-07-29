// DOM elements
const htmlInput = document.getElementById('html');
const cssInput = document.getElementById('css');
const jsInput = document.getElementById('js');
const genericInput = document.getElementById('generic');

const outputIframe = document.getElementById('output');
const rawOutput = document.getElementById('raw-output');

const htmlEditors = document.getElementById('html-editors');
const singleEditor = document.getElementById('single-editor');
const languageSelect = document.getElementById('language');
const runBtn = document.getElementById('run');
const themeBtn = document.getElementById('toggleTheme');
const body = document.getElementById('body');
const langLabel = document.getElementById('lang-label');

// Load inputs from storage
htmlInput.value = localStorage.getItem("editor-html") || "<h1>Hello</h1>";
cssInput.value = localStorage.getItem("editor-css") || "h1 { color: blue; }";
jsInput.value = localStorage.getItem("editor-js") || "console.log('Welcome!');";
genericInput.value = localStorage.getItem("editor-generic") || "// Your code here";

// Dark mode toggle
themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  body.classList.toggle("bg-light", !isDark);
  body.classList.toggle("text-dark", !isDark);
  body.classList.toggle("bg-dark", isDark);
  body.classList.toggle("text-light", isDark);
  themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// Set layout for selected language
function updateUIForLanguage(lang) {
  if (lang === "html") {
    htmlEditors.classList.remove('hidden');
    singleEditor.classList.add('hidden');
    outputIframe.classList.remove('hidden');
    rawOutput.classList.add('hidden');
  } else {
    htmlEditors.classList.add('hidden');
    singleEditor.classList.remove('hidden');
    outputIframe.classList.add('hidden');
    rawOutput.classList.remove('hidden');
    langLabel.textContent = `${lang.toUpperCase()} Code`;
  }
}

// Detect language change
languageSelect.addEventListener("change", (e) => {
  updateUIForLanguage(e.target.value);
});

// Update preview for HTML
function runHtmlPreview() {
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
  outputIframe.srcdoc = doc;

  localStorage.setItem("editor-html", html);
  localStorage.setItem("editor-css", css);
  localStorage.setItem("editor-js", js);
}

// Initialize Pyodide for Python
let pyodide = null;
async function loadPyodideIfNeeded() {
  if (!pyodide) {
    pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" });
  }
}

// Run Python code
async function runPython(code) {
  await loadPyodideIfNeeded();
  try {
    const result = await pyodide.runPythonAsync(code);
    rawOutput.textContent = `Python Output:\n\n${result}`;
  } catch (err) {
    rawOutput.textContent = `Python Error:\n\n${err}`;
  }
}

// Fallback for other languages
function runNotSupported(lang, code) {
  rawOutput.textContent = ` Execution for "${lang}" is not yet implemented.\n\nYour Code:\n\n${code}`;
}

// Run button logic
runBtn.addEventListener("click", async () => {
  const lang = languageSelect.value;
  const code = genericInput.value.trim();

  if (lang === "html") {
    runHtmlPreview();
  } else {
    localStorage.setItem("editor-generic", code);
    updateUIForLanguage(lang);

    if (lang === "python") {
      await runPython(code);
    } else {
      runNotSupported(lang, code);
    }
  }
});

// Initial preview setup
updateUIForLanguage(languageSelect.value);
runBtn.click();
