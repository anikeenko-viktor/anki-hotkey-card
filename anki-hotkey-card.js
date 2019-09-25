"use strict";

const codeString = {
    "KeyA": "A",
    "KeyB": "B",
    "KeyC": "C",
    "KeyD": "D",
    "KeyE": "E",
    "KeyF": "F",
    "KeyG": "G",
    "KeyH": "H",
    "KeyI": "I",
    "KeyJ": "J",
    "KeyK": "K",
    "KeyL": "L",
    "KeyM": "M",
    "KeyN": "N",
    "KeyO": "O",
    "KeyP": "P",
    "KeyQ": "Q",
    "KeyR": "R",
    "KeyS": "S",
    "KeyT": "T",
    "KeyU": "U",
    "KeyV": "V",
    "KeyW": "W",
    "KeyX": "X",
    "KeyY": "Y",
    "KeyZ": "Z",

    "MetaLeft": {
        string: "⌘",
        order: 1,
    },
    "AltLeft": {
        string: "⌥",
        order: 2,
    },
    "ControlLeft": {
        string: "⌃",
        order: 20,
    },
    "ControlRight": {
        string: "⌃",
        order: 20,
    },
    "ShiftLeft": {
        string: "⇧",
        order: 10,
    },
    "Tab": "⇪",
    "Backspace": "⌫",
    "Enter": "Enter", //↩

    "F1": "F1",
    "F2": "F2",
    "F3": "F3",
    "F4": "F4",
    "F5": "F5",
    "F6": "F6",
    "F7": "F7",
    "F8": "F8",
    "F9": "F9",
    "F10": "F10",
    "F11": "F11",
    "F12": "F12",

    "IntlBackslash": "`",
    "Backquote": "`",

    "Comma": ",",
    "Period": ".",
    "Slash": "/",
    "Semicolon": ";",
    "Quote": "'",
    "Backslash": "\\",
    "BracketLeft": "[",
    "BracketRight": "]",

    "Digit1": "1",
    "Digit2": "2",
    "Digit3": "3",
    "Digit4": "4",
    "Digit5": "5",
    "Digit6": "6",
    "Digit7": "7",
    "Digit8": "8",
    "Digit9": "9",
    "Digit0": "0",

    "Minus": "-",
    "Equal": "=",

    "Escape": "Esc",
};

function getHotkeyText(keys) {
    return Object.keys(keys)
        .sort((a, b) => (codeString[b].order || 0) - (codeString[a].order || 0))
        .map(code => (codeString[code] && codeString[code].string) || codeString[code] || code).join('');
}

document.hotkey = () => {
    const hotkeyDiv = document.getElementById("hotkey");
    const input = document.createElement("input");
    input.setAttribute("id", "hotkey-input");

    const inputHidden = document.createElement("input");
    inputHidden.setAttribute("type", "hidden");

    let kbd = null;
    let keys = {};

    input.onkeydown = e => {
        e.preventDefault();

        if (e.code === "Enter") {
            document.dispatchEvent(new CustomEvent("enter"));
            return;
        }

        // debug
        if (!e.repeat) {
            console.log(e);
        }

        keys[e.code] = { down: true };

        if (!kbd) {
            kbd = document.createElement("kbd");
            hotkeyDiv.insertBefore(kbd, input);
        }

        kbd.innerText = getHotkeyText(keys);
    };

    input.onkeyup = e => {
        e.preventDefault();

        if (e.code in keys) {
            keys[e.code].up = true;
        }

        const allUp = Object.values(keys).every(key => key.up);
        const isMetaUp = e.key === "Meta";

        if (allUp || isMetaUp) {
            if (inputHidden.textContent) {
                inputHidden.textContent += " ";
            }
            inputHidden.textContent += getHotkeyText(keys);
            document.dispatchEvent(new CustomEvent("hotkey_up", {
                detail: inputHidden.textContent,
            }));

            kbd = null;
            keys = {};
        }
    };

    hotkeyDiv.appendChild(input);
    hotkeyDiv.appendChild(inputHidden);
};