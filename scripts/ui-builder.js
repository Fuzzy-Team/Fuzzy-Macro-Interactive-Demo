//use javascript to add html elements
//avoids repetition of building the same elements

//commonly used
const slotArray = [1, 2, 3, 4, 5, 6, 7];

const FUZZY_DOCS_ROOT = "https://fuzzy-team.gitbook.io/fuzzy-macro";
const fuzzyDocsRegistry = Object.freeze({
  root: FUZZY_DOCS_ROOT,
  gettingStarted: `${FUZZY_DOCS_ROOT}/getting-started/readme`,
  systemDisplaySettings: `${FUZZY_DOCS_ROOT}/system-settings/display-settings`,
  importantSettings: `${FUZZY_DOCS_ROOT}/macro-settings/important-settings`,
  runningTheMacro: `${FUZZY_DOCS_ROOT}/macro-settings/running-the-macro`,
  macroSettings: `${FUZZY_DOCS_ROOT}/macro-settings/important-settings`,
  discordSetup: `${FUZZY_DOCS_ROOT}/discord-setup`,
  discordWebhook: `${FUZZY_DOCS_ROOT}/discord-setup/discord-webhook-setup`,
  discordBot: `${FUZZY_DOCS_ROOT}/discord-setup/discord-bot-setup`,
  streamSetup: `${FUZZY_DOCS_ROOT}/discord-setup/stream-setup`,
  commonFixes: `${FUZZY_DOCS_ROOT}/common-fixes/terminal-permissions`,
});

function resolveDocsUrl(docRef) {
  if (!docRef) return "";
  if (typeof docRef !== "string") return "";
  if (/^https?:\/\//i.test(docRef)) return docRef;
  return fuzzyDocsRegistry[docRef] || fuzzyDocsRegistry.root;
}

function escapeAttribute(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function openDocsLink(link) {
  if (!link) return;
  try {
    if (window.eel && typeof eel.openLink === "function") {
      eel.openLink(link);
      return;
    }
  } catch (error) {
    console.warn("Falling back to browser navigation for docs link", error);
  }
  window.open(link, "_blank", "noopener,noreferrer");
}

function handleHelpIconClick(event, element) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const target = element || (event ? event.currentTarget : null);
  if (!target || !target.dataset.docUrl) return;
  openDocsLink(target.dataset.docUrl);
}

function buildHelpIcon(config = {}) {
  const tooltip = config.tooltip || config.helpText || "";
  const docUrl = resolveDocsUrl(config.docs);
  if (!tooltip && !docUrl) return "";

  const tooltipBody = tooltip
    ? `<span class="help-tooltip-copy">${tooltip}</span>`
    : `<span class="help-tooltip-copy">Open the GitBook documentation for this section.</span>`;
  const tooltipLink = docUrl
    ? '<span class="help-tooltip-link">Open GitBook docs</span>'
    : "";
  const label = config.label || "Open help";

  return `
    <button
      type="button"
      class="help-icon-button"
      aria-label="${escapeAttribute(label)}"
      ${docUrl ? `data-doc-url="${escapeAttribute(docUrl)}"` : ""}
      onclick="handleHelpIconClick(event, this)">
      <span class="help-icon-glyph">?</span>
      <span class="help-tooltip-bubble">${tooltipBody}${tooltipLink}</span>
    </button>
  `;
}

window.openDocsLink = openDocsLink;
window.handleHelpIconClick = handleHelpIconClick;
window.buildHelpIcon = buildHelpIcon;

//id: id of input element
/*
    type property: the type of input element
    checkbox:
    type: {
        name: "checkbox",
        triggerFunction: "saveData()"
    }
    dropdown:
    type: {
        name: "dropdown",
        data: ["a","b","c"],
        triggerFunction: "saveData()",
        length: 13 //in rem units, defaults to 10 if not included
    }
    textbox:
    type: {
        name: "textbox",
        length: 13, //in rem units, defaults to 10 if not included
        triggerFunction: "saveData()",
        inputType: "float", //restrict the input values to only certain characters. Options are: string, float, int
        inputLimit: 5 //restrict the maximum number of characters allowed. If set to 0 or not included, no limit 
    }
    button:
    type: {
        name: "button",
        triggerFunction: "func()",
        text: "reset" //button text
        length: 10, //in rem units, defaults to 5 if not included
    }
*/

//create option elements in a already existing dropdown
//id: id of dropdown element
//data: array of values to set
function setDropdownData(id, data) {
  //create the html (normalize data-value to match buildInput processing)
  let html = "";
  data.forEach((x) => {
    let value = x;
    let display = x;
    // support objects of the form { label: "Visible", value: "internal" }
    if (x && typeof x === "object") {
      if (x.hasOwnProperty("value")) value = x.value;
      if (x.hasOwnProperty("label")) display = x.label;
    }
    if (typeof value === "string") {
      value = stripHTMLTags(value);
      try {
        value = value.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "");
      } catch (e) {
        // If the unicode regex isn't supported, fall back to a simpler remove-emojis step
        value = value.replace(/[^\w\s\-\.,]/g, "");
      }
      value = value.trim().toLowerCase();
    }
    html += `<div class = "option" data-value = "${value}">${display}</div>`;
  });
  //add it to the element
  const container = document.getElementById(id);
  if (container && container.children[1] && container.children[1].children[0]) {
    container.children[1].children[0].innerHTML = html;
  }
}

function buildInput(id, type) {
  if (type.name == "checkbox") {
    return `<label class="checkbox-container" style="margin-top: 0.6rem;">
                    <input type="checkbox" id = ${id} onchange="${type.triggerFunction}">
                    <span class="checkmark"></span>
                </label>`;
  } else if (type.name == "dropdown") {
    let html = `
        <div data-onchange="${type.triggerFunction
      }" id = ${id} class="custom-select poppins-regular" style="width: ${type.length ? type.length : 10
      }rem; margin-top: 0.6rem;">
            <div class="select-area">
                <div class = "value" data-value="none">None</div>
                <div class = "chevron">></div>
            </div>
            <div class="select-menu-relative">
                <div class="select-menu" style="display: none;">
        `;
    for (let i = 0; i < type.data.length; i++) {
      const x = type.data[i];
      let value = x;
      let display = x;
      // allow {label, value} objects for visual-only label changes
      if (x && typeof x === "object") {
        if (x.hasOwnProperty("value")) value = x.value;
        if (x.hasOwnProperty("label")) display = x.label;
      }
      if ($.type(value) === "string") {
        value = stripHTMLTags(value);
        value = value.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ""); //remove emojis
        value = value.trim().toLowerCase(); //remove leading/trailing white space, also set to lowercase
      }
      html += `<div class = "option" data-value = "${value}">${display}</div>`;
    }
    html += `</div>
            </div>
        </div>`;
    return html;
  } else if (type.name == "textbox") {
    let html = `<input type="text" id="${id}" style="width: ${type.length ? type.length : 10
      }rem; margin-top: 0.6rem;" class="poppins-regular textbox" data-input-type="${type.inputType
      }" data-input-limit="${type.inputLimit ? type.inputLimit : 0
      }" onkeypress="return textboxRestriction(this, event)" onchange="${type.triggerFunction
      }">`;
    return html;
  } else if (type.name == "textbox_with_button") {
    // composite control: an input plus a button on the same line
    const inputId = type.inputId ? type.inputId : `${id}_input`;
    const inputWidth = type.inputWidth ? type.inputWidth : (type.length ? type.length : 12);
    const btnId = type.buttonId ? type.buttonId : `${id}_btn`;
    const btnText = type.buttonText ? type.buttonText : "Action";
    const btnFunc = type.buttonFunction ? type.buttonFunction : "";
    const inputOnchange = type.inputOnchange ? type.inputOnchange : (type.triggerFunction ? type.triggerFunction : "");

    // ensure button text doesn't wrap and has sensible padding
    const btnWidthStyle = type.buttonWidth ? `${type.buttonWidth}rem` : "auto";
    // set a consistent height for input and button so they align
    const controlHeight = type.controlHeight ? type.controlHeight : '2.2rem';
    const inputPadding = type.inputPadding ? type.inputPadding : '0.35rem 0.5rem';
    const buttonPadding = type.buttonPadding ? type.buttonPadding : '0.35rem 0.6rem';
    // remove extra top margin so the control lines up with the label text
    let html = `<div style="display:flex; align-items:center; gap:0.5rem; margin:0;">
            <input type="text" id="${inputId}" style="width: ${inputWidth}rem; height: ${controlHeight}; padding: ${inputPadding}; box-sizing: border-box; margin:0;" class="poppins-regular textbox" data-input-type="${type.inputType || 'string'}" data-input-limit="${type.inputLimit ? type.inputLimit : 0}" onkeypress="return textboxRestriction(this, event)" onchange="${inputOnchange}">
            <div id="${btnId}" class="purple-button" onclick="${btnFunc}" style="width: ${btnWidthStyle}; height: ${controlHeight}; display: inline-flex; white-space: nowrap; align-items: center; justify-content: center; padding: ${buttonPadding}; box-sizing: border-box; margin:0; cursor: pointer;">${btnText}</div>
          </div>`;
    return html;
  } else if (type.name == "button") {
    // fixed control height for buttons to align with inputs
    const singleBtnHeight = type.buttonHeight ? type.buttonHeight : '2.2rem';
    const singleBtnPadding = type.buttonPadding ? type.buttonPadding : '0 0.6rem';
    let html = `<div id = "${id}" class="purple-button" onclick="${type.triggerFunction
      }" style="width: ${type.length ? type.length : 'auto'}rem; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; height: ${singleBtnHeight}; padding: ${singleBtnPadding}; box-sizing: border-box; cursor: pointer;">${type.text
      }</div>`;
    return html;
  } else if (type.name == "keybind") {
    let html = `<div id="${id}" class="keybind-input poppins-regular" style="width: ${type.length ? type.length : 10
      }rem; margin-top: 0.6rem; padding: 0.5rem; border: 2px solid var(--primary); border-radius: 4px; background: var(--textbox-bg); color: #d2d3d2; cursor: pointer; text-align: center; user-select: none; font-size: 1rem; transition: all 0.2s ease;" onclick="startKeybindRecording('${id}')" data-recording="false" data-trigger-function="${type.triggerFunction
      }">
            <span class="keybind-display">Click to record</span>
        </div>`;
    return html;
  } else if (type.name == "draglist") {
    let html = `<div id="${id}" class="drag-list" data-onchange="${type.triggerFunction}" style="margin-top: 0.6rem;">
            <div class="drag-list-container" id="${id}-container">`;
    for (let i = 0; i < type.data.length; i++) {
      const item = type.data[i];
      html += `<div class="drag-item" data-id="${item.id}" draggable="true">
                <span class="drag-handle">⋮⋮</span>
                <span class="drag-text">${item.name}</span>
            </div>`;
    }
    html += `</div></div>`;
    return html;
  }
}

//parentElement: the parentElement to add the container to
//build a standard container for settings
//title: title of container
//settings: an array of objects
/*
[
    {
        id: "field-enable",
        title: "enable task",
        desc: "Enable gathering in field",
        type: input-type-object-here
    }
]
*/
function buildStandardContainer(parentElement, title, desc, settings, options = {}) {
  const safeTitle = typeof stripHTMLTags === "function" ? stripHTMLTags(title) : title;
  const sectionHelpIcon = buildHelpIcon({
    tooltip: options.helpText || desc,
    docs: options.docs,
    label: `${safeTitle} help`,
  });
  let out = `
        <div class = "poppins-medium standard-container" style="display: block; justify-items: unset; padding-top: 1rem;">
            <h2 id="${title.toLowerCase().replaceAll(" ", "-")}"><span class="section-title-text">${title}</span>${sectionHelpIcon}</h2>
            <p style = "font-weight:500; font-size:1rem;">${desc}</p>
            <div class="seperator"></div>
    `;
  //adjust padding right on the form based on the input type
  const inputPadding = {
    checkbox: "10%",
    dropdown: "5%",
    textbox: "5%",
    button: "5%",
    keybind: "5%",
    textbox_with_button: "5%",
    draglist: "5%",
  };

  //add each setting
  settings.forEach((e, i) => {
    //note: if i > 0, set a margin-top
    //if the control is a standalone button, vertically center the left text block
    const isSingleButton = e.type && e.type.name === 'button';
    const alignItems = isSingleButton ? 'center' : 'flex-start';
    const leftDivStyle = isSingleButton ? 'display:flex; flex-direction:column; justify-content:center;' : '';
    const settingHelpIcon = buildHelpIcon({
      tooltip: e.helpText || e.desc,
      docs: e.docs,
      label: `${typeof stripHTMLTags === "function" ? stripHTMLTags(e.title) : e.title} help`,
    });
    out += `
      <form style="display: flex; align-items:${alignItems}; justify-content: space-between; padding-right: ${inputPadding[e.type.name]
      }; ${i ? "margin-top:1rem" : ""};">
        <div style="width: 70%; ${leftDivStyle}">
          <div class="setting-label-row"><label>${e.title}</label>${settingHelpIcon}</div>
          <p>${e.desc}</p>
        </div>
        ${buildInput(e.id, e.type)}
      </form>
      `;
  });

  out += "</div>";
  parentElement.innerHTML += out;
}
