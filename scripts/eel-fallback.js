(function () {
  if (window.eel) return;

  const STORAGE_KEY = "fuzzy_gui_static_state_v1";
  const FIELD_NAMES = [
    "none",
    "sunflower",
    "dandelion",
    "mushroom",
    "blue flower",
    "clover",
    "strawberry",
    "spider",
    "bamboo",
    "pineapple",
    "pumpkin",
    "cactus",
    "rose",
    "pine tree",
    "mountain top",
    "pepper",
    "coconut",
    "stump",
  ];

  const DEFAULT_TASK_PRIORITY_ORDER = [
    "gather_pine_tree",
    "gather_sunflower",
    "gather_dandelion",
    "gather_mushroom",
    "gather_blue_flower",
    "gather_clover",
    "gather_strawberry",
    "gather_spider",
    "gather_bamboo",
    "gather_cactus",
    "gather_rose",
    "gather_pineapple",
    "gather_pumpkin",
    "gather_coconut",
    "gather_pepper",
    "gather_mountain_top",
    "gather_stump",
    "collect_wealth_clock",
    "collect_blueberry_dispenser",
    "collect_strawberry_dispenser",
    "collect_coconut_dispenser",
    "collect_royal_jelly_dispenser",
    "collect_treat_dispenser",
    "collect_ant_pass_dispenser",
    "collect_glue_dispenser",
    "collect_blue_booster",
    "collect_red_booster",
    "collect_mountain_booster",
    "collect_sticker_stack",
    "collect_sticker_printer",
    "kill_stump_snail",
    "kill_ladybug",
    "kill_rhinobeetle",
    "kill_scorpion",
    "kill_mantis",
    "kill_spider",
    "kill_werewolf",
    "kill_coconut_crab",
    "kill_king_beetle",
    "kill_tunnel_bear",
    "quest_polar_bear",
    "quest_brown_bear",
    "quest_black_bear",
    "quest_honey_bee",
    "quest_bucko_bee",
    "quest_riley_bee",
    "mondo_buff",
    "stinger_hunt",
    "auto_field_boost",
    "ant_challenge",
    "blender",
    "planters",
  ];

  // Default patterns (from default-settings/pattern-list.txt)
  const DEFAULT_PATTERNS = [
    "auryn",
    "bambe",
    "bambootiquev2",
    "bowl",
    "cornerxe_lol",
    "cornerxsnake",
    "diamonds",
    "e_lol",
    "fork",
    "kettle",
    "lines",
    "old e_lol",
    "skillet",
    "slimline",
    "snake",
    "spiral",
    "squares",
    "stationary",
    "supercat",
    "xsnake",
  ];

  // Default per-field settings (from default-settings/fields.txt)
  const DEFAULT_FIELDS_DATA = {
    "sunflower": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "m", width: 4, invert_lr: true, invert_fb: false, turn: "none", turn_times: 2, mins: 8, backpack: 95, return: "walk", start_location: "upper left", distance: 4 },
    "dandelion": { shift_lock: false, field_drift_compensation: false, shape: "e_lol", size: "m", width: 2, invert_lr: false, invert_fb: false, turn: "none", turn_times: 1, mins: 8, backpack: 100, return: "walk", start_location: "upper right", distance: 9 },
    "mushroom": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "m", width: 4, invert_lr: false, invert_fb: false, turn: "none", turn_times: 4, mins: 8, backpack: 95, return: "walk", start_location: "upper right", distance: 6 },
    "blue flower": { shift_lock: false, field_drift_compensation: false, shape: "e_lol", size: "m", width: 3, invert_lr: false, invert_fb: false, turn: "none", turn_times: 2, mins: 8, backpack: 95, return: "walk", start_location: "center", distance: 1 },
    "clover": { shift_lock: false, field_drift_compensation: false, shape: "diamonds", size: "s", width: 3, invert_lr: false, invert_fb: false, turn: "left", turn_times: 1, mins: 8, backpack: 95, return: "walk", start_location: "lower right", distance: 4, goo: false, goo_interval: 3 },
    "strawberry": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "m", width: "4", invert_lr: true, invert_fb: false, turn: "right", turn_times: "2", mins: "1", backpack: "95", return: "walk", start_location: "upper right", distance: "7" },
    "spider": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "m", width: 3, invert_lr: true, invert_fb: false, turn: "none", turn_times: 1, mins: 8, backpack: 95, return: "walk", start_location: "upper left", distance: 7 },
    "bamboo": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "m", width: 4, invert_lr: false, invert_fb: false, turn: "left", turn_times: 2, mins: 8, backpack: 95, return: "walk", start_location: "upper left", distance: 7, goo: false, goo_interval: 3 },
    "pineapple": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "m", width: 4, invert_lr: true, invert_fb: false, turn: "left", turn_times: 1, mins: 8, backpack: 95, return: "walk", start_location: "upper left", distance: 7 },
    "stump": { shift_lock: false, field_drift_compensation: false, shape: "squares", size: "s", width: 2, invert_lr: false, invert_fb: false, turn: "right", turn_times: 2, mins: 8, backpack: 95, return: "walk", start_location: "lower right", distance: 3 },
    "cactus": { shift_lock: false, field_drift_compensation: false, shape: "e_lol", size: "s", width: 3, invert_lr: false, invert_fb: false, turn: "none", turn_times: 1, mins: 8, backpack: 95, return: "walk", start_location: "center", distance: 1 },
    "pumpkin": { shift_lock: false, field_drift_compensation: false, shape: "cornerxe_lol", size: "s", width: 3, invert_lr: false, invert_fb: false, turn: "none", turn_times: 1, mins: 8, backpack: 95, return: "walk", start_location: "upper right", distance: 7 },
    "pine tree": { shift_lock: true, field_drift_compensation: false, shape: "skillet", size: "m", width: 1, invert_lr: false, invert_fb: false, turn: "left", turn_times: 4, mins: 10, backpack: 95, return: "walk", start_location: "upper left", distance: 8 },
    "rose": { shift_lock: false, field_drift_compensation: false, shape: "supercat", size: "m", width: 1, invert_lr: false, invert_fb: false, turn: "right", turn_times: 3, mins: 8, backpack: 95, return: "walk", start_location: "lower right", distance: 10, goo: false, goo_interval: 3 },
    "pepper": { shift_lock: false, field_drift_compensation: false, shape: "e_lol", size: "m", width: 2, invert_lr: false, invert_fb: false, turn: "left", turn_times: 2, mins: 8, backpack: 100, return: "walk", start_location: "upper right", distance: 3 },
    "coconut": { shift_lock: false, field_drift_compensation: false, shape: "cornerxsnake", size: "s", width: 3, invert_lr: false, invert_fb: false, turn: "right", turn_times: 4, mins: 8, backpack: 100, return: "walk", whirligig_slot: 1, start_location: "upper right", distance: 5 },
    "mountain top": { shift_lock: false, field_drift_compensation: false, shape: "diamonds", size: "s", width: 3, invert_lr: false, invert_fb: false, turn: "left", turn_times: 1, mins: 8, backpack: 95, return: "walk", use_whirlwig_fallback: false, start_location: "bottom", distance: 4, goo: false, goo_interval: 3 }
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultFieldSettings() {
    return {
      shift_lock: false,
      field_drift_compensation: false,
      shape: "none",
      size: "m",
      width: 3,
      invert_lr: false,
      invert_fb: false,
      turn: "none",
      turn_times: 1,
      mins: 10,
      backpack: 95,
      return: "rejoin",
      use_whirlwig_fallback: false,
      start_location: "center",
      distance: 5,
      goo: false,
      goo_interval: 3,
    };
  }

  function defaultProfileSettings() {
    return {
      // Defaults loaded from default-settings/settings.txt
      fields: ["pine tree", "sunflower", "dandelion", "pine tree", "sunflower"],
      fields_enabled: [true, false, false, false, false],
      planters_mode: 0,
      task_priority_order: deepClone(DEFAULT_TASK_PRIORITY_ORDER),
      start_keybind: "F1",
      pause_keybind: "F2",
      stop_keybind: "F3",
      macro_mode: "normal",
      blender_enable: false,
      blender: false,
      mondo_buff: false,
      stinger_hunt: false,
      auto_field_boost: false,
      ant_challenge: false,
      planters: false,
      // additional defaults from settings.txt
      manual_planters_collect_every: 1,
      manual_planters_collect_full: false,
      cycle1_1_planter: "none",
      cycle1_2_planter: "none",
      cycle1_3_planter: "none",
      cycle1_1_field: "none",
      cycle1_2_field: "none",
      cycle1_3_field: "none",
      mondo_buff_interrupt_gathering: true,
    };
  }

  function defaultFieldsData() {
    // Use predefined default field settings when available, falling back to generic defaults
    const fields = {};
    FIELD_NAMES.forEach((name) => {
      const key = String(name || "");
      if (DEFAULT_FIELDS_DATA[key]) {
        fields[key] = { ...defaultFieldSettings(), ...DEFAULT_FIELDS_DATA[key] };
      } else {
        fields[key] = defaultFieldSettings();
      }
    });
    return fields;
  }

  function defaultState() {
    return {
      general: {
        gui_theme: localStorage.getItem("gui_theme") || "purple",
        macro_mode: "normal",
      },
      currentProfile: "Default",
      profiles: {
        Default: defaultProfileSettings(),
      },
      fieldsData: defaultFieldsData(),
      patterns: deepClone(DEFAULT_PATTERNS),
      runState: 3,
      recentLogs: [],
      manualPlanterData: {
        planters: [null, null, null],
        fields: ["", "", ""],
        harvestTimes: [0, 0, 0],
      },
      autoPlanterData: {
        gather: false,
        planters: [],
      },
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return {
        ...defaultState(),
        ...parsed,
        general: { ...defaultState().general, ...(parsed.general || {}) },
        profiles: parsed.profiles || { Default: defaultProfileSettings() },
        fieldsData: { ...defaultFieldsData(), ...(parsed.fieldsData || {}) },
      };
    } catch (err) {
      return defaultState();
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.general && state.general.gui_theme) {
      localStorage.setItem("gui_theme", state.general.gui_theme);
    }
  }

  function getCurrentProfile(state) {
    const current = state.currentProfile || "Default";
    if (!state.profiles[current]) {
      state.profiles[current] = defaultProfileSettings();
    }
    return state.profiles[current];
  }

  function method(handler) {
    return function (...args) {
      const promise = Promise.resolve().then(() => handler(...args));
      const callable = () => promise;
      callable.then = promise.then.bind(promise);
      callable.catch = promise.catch.bind(promise);
      callable.finally = promise.finally.bind(promise);
      return callable;
    };
  }

  function normalizePatternName(name) {
    const clean = (name || "").replace(/\.[^/.]+$/, "").trim();
    return clean || "pattern";
  }

  const exposed = {};

  window.eel = {
    expose(fn, name) {
      const key = name || (fn && fn.name);
      if (key) exposed[key] = fn;
      return true;
    },

    loadSettings: method(() => {
      const state = loadState();
      return deepClone(getCurrentProfile(state));
    }),

    loadAllSettings: method(() => {
      const state = loadState();
      const profile = getCurrentProfile(state);
      return deepClone({ ...state.general, ...profile });
    }),

    saveProfileSetting: method((id, value) => {
      const state = loadState();
      const profile = getCurrentProfile(state);
      profile[id] = value;
      saveState(state);
      return true;
    }),

    saveGeneralSetting: method((id, value) => {
      const state = loadState();
      state.general[id] = value;
      if (id === "gui_theme") state.general.gui_theme = value;
      const profile = getCurrentProfile(state);
      if (id === "macro_mode") profile.macro_mode = value;
      saveState(state);
      return true;
    }),

    saveDictProfileSettings: method((data) => {
      const state = loadState();
      const profile = getCurrentProfile(state);
      Object.assign(profile, data || {});
      saveState(state);
      return true;
    }),

    saveField: method((fieldName, fieldData) => {
      const state = loadState();
      const key = String(fieldName || "").toLowerCase();
      state.fieldsData[key] = { ...defaultFieldSettings(), ...(fieldData || {}) };
      saveState(state);
      return true;
    }),

    loadFields: method(() => {
      const state = loadState();
      return deepClone(state.fieldsData);
    }),

    getPatterns: method(() => {
      const state = loadState();
      return deepClone(state.patterns || []);
    }),

    importPatterns: method((patterns) => {
      const state = loadState();
      const saved = [];
      const errors = [];
      const incoming = Array.isArray(patterns) ? patterns : [];
      incoming.forEach((item) => {
        try {
          const name = normalizePatternName(item && item.name);
          if (!state.patterns.includes(name)) {
            state.patterns.push(name);
          }
          saved.push(name);
        } catch (err) {
          errors.push(String(item && item.name ? item.name : "unknown"));
        }
      });
      saveState(state);
      return { saved, errors };
    }),

    resetFieldToDefault: method((fieldName) => {
      const state = loadState();
      const key = String(fieldName || "").toLowerCase();
      state.fieldsData[key] = defaultFieldSettings();
      saveState(state);
      return true;
    }),

    exportFieldSettings: method((fieldName) => {
      const state = loadState();
      const key = String(fieldName || "").toLowerCase();
      const payload = {
        metadata: {
          macro_version: "static-demo",
          export_date: new Date().toISOString(),
          field_name: key,
        },
        settings: state.fieldsData[key] || defaultFieldSettings(),
      };
      return JSON.stringify(payload, null, 2);
    }),

    importFieldSettings: method((fieldName, jsonText) => {
      const state = loadState();
      const key = String(fieldName || "").toLowerCase();
      try {
        const parsed = JSON.parse(jsonText);
        const settings = parsed.settings || parsed;
        state.fieldsData[key] = { ...defaultFieldSettings(), ...(settings || {}) };
        saveState(state);
        return {
          success: true,
          imported_from_field: parsed.metadata && parsed.metadata.field_name,
          macro_version: parsed.metadata && parsed.metadata.macro_version,
          missing_patterns: [],
        };
      } catch (err) {
        return { success: false };
      }
    }),

    clearBlender: method(() => true),
    clearAFB: method(() => true),
    clearManualPlanters: method(() => {
      const state = loadState();
      state.manualPlanterData = defaultState().manualPlanterData;
      saveState(state);
      return true;
    }),
    clearAutoPlanters: method(() => {
      const state = loadState();
      state.autoPlanterData.planters = [];
      saveState(state);
      return true;
    }),
    resetManualPlanterTimer: method(() => true),
    resetAutoPlanterTimer: method(() => true),
    getManualPlanterData: method(() => deepClone(loadState().manualPlanterData)),
    getAutoPlanterData: method(() => deepClone(loadState().autoPlanterData)),
    setAutoPlanterGather: method((value) => {
      const state = loadState();
      state.autoPlanterData.gather = !!value;
      saveState(state);
      return true;
    }),

    listProfiles: method(() => Object.keys(loadState().profiles || {})),
    getCurrentProfile: method(() => loadState().currentProfile || "Default"),
    switchProfile: method((profileName) => {
      const state = loadState();
      if (!state.profiles[profileName]) {
        return [false, `Profile '${profileName}' does not exist.`];
      }
      state.currentProfile = profileName;
      saveState(state);
      return [true, `Switched to '${profileName}'.`];
    }),
    createProfile: method((profileName) => {
      const state = loadState();
      const name = String(profileName || "").trim();
      if (!name) return [false, "Profile name is required."];
      if (state.profiles[name]) return [false, "Profile already exists."];
      state.profiles[name] = deepClone(defaultProfileSettings());
      saveState(state);
      return [true, `Created profile '${name}'.`];
    }),
    deleteProfile: method((profileName) => {
      const state = loadState();
      if (!state.profiles[profileName]) return [false, "Profile not found."];
      if (Object.keys(state.profiles).length <= 1) {
        return [false, "Cannot delete the last profile."];
      }
      delete state.profiles[profileName];
      if (state.currentProfile === profileName) {
        state.currentProfile = Object.keys(state.profiles)[0];
      }
      saveState(state);
      return [true, `Deleted profile '${profileName}'.`];
    }),
    duplicateProfile: method((sourceName, newName) => {
      const state = loadState();
      const target = String(newName || "").trim();
      if (!state.profiles[sourceName]) return [false, "Source profile not found."];
      if (!target) return [false, "New profile name is required."];
      if (state.profiles[target]) return [false, "Profile already exists."];
      state.profiles[target] = deepClone(state.profiles[sourceName]);
      saveState(state);
      return [true, `Duplicated '${sourceName}' as '${target}'.`];
    }),
    exportProfile: method((profileName) => {
      const state = loadState();
      const profile = state.profiles[profileName];
      if (!profile) return [false, "Profile not found."];
      const content = JSON.stringify({
        metadata: { profile_name: profileName, export_date: new Date().toISOString() },
        settings: profile,
      }, null, 2);
      return [true, content, `${profileName}.json`];
    }),
    importProfileContent: method((content, profileName) => {
      const state = loadState();
      const name = String(profileName || "").trim();
      if (!name) return [false, "Profile name is required."];
      try {
        const parsed = JSON.parse(content);
        const settings = parsed.settings || parsed;
        state.profiles[name] = { ...defaultProfileSettings(), ...(settings || {}) };
        saveState(state);
        return [true, `Imported profile '${name}'.`];
      } catch (err) {
        return [false, "Invalid profile JSON."];
      }
    }),

    getRunState: method(() => Number(loadState().runState || 3)),
    start: method(() => {
      const state = loadState();
      state.runState = 2;
      saveState(state);
      return true;
    }),
    stop: method(() => {
      const state = loadState();
      state.runState = 3;
      saveState(state);
      return true;
    }),
    pause: method(() => {
      const state = loadState();
      state.runState = 6;
      saveState(state);
      return true;
    }),
    resume: method(() => {
      const state = loadState();
      state.runState = 2;
      saveState(state);
      return true;
    }),
    update: method(() => true),
    updateFromHash: method(() => false),

    getRecentLogs: method(() => deepClone(loadState().recentLogs || [])),
    clearRecentLogs: method(() => {
      const state = loadState();
      state.recentLogs = [];
      saveState(state);
      return true;
    }),

    exportDebugZip: method(() => [false, "Not available in static demo mode."]),

    openLink: method((url) => {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return true;
    }),
  };
})();
