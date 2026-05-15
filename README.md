# Fuzzy-Macro-Interactive-GUI
This project will be used on the official fuzzy macro website as a way for users to get a "feel" of how the macro looks and works.

[Fuzzy Macro Website](https://www.fuzzymacro.com/)

## Running locally

The demo is static HTML, CSS, and JavaScript. Open it through a local web server so relative paths and `fetch()` (for example `version.txt`) work correctly.

From the repository root:

**Python 3** (usually available on Linux and macOS):

```bash
cd /path/to/Fuzzy-Macro-Interactive-Demo
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/) in your browser. Use Ctrl+C in the terminal to stop the server.

**Node** (if you prefer):

```bash
cd /path/to/Fuzzy-Macro-Interactive-Demo
npx --yes serve -p 8080
```

If `./eel.js` is missing, the bundled `scripts/eel-fallback.js` still provides a mock backend for the interactive demo.
