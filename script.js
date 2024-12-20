//ui refs:

const image = document.getElementById("source");
const txtMessage = document.getElementById("txtMessage");
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const resultsDiv = document.getElementById("results");
const slider = document.getElementById("speedSlider");
const sliderLabel = document.getElementById("sliderLabel");
const lowPowerCheckbox = document.getElementById("lowPowerCheckbox");
const bloomSlider = document.getElementById("bloom");
const signSelect = document.getElementById("signSelect");
const measurementsDiv = document.getElementById("measurements");

const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

const drawingToolRadiusChoice = document.getElementById("drawing-tool-radius");
const penRB = document.getElementById("pen");
const eraserRB = document.getElementById("eraser");
const clearScreenButton = document.getElementById("clear-drawing-button");
const invertScreenButton = document.getElementById("invert-drawing-button");
const copyDrawingDataButton = document.getElementById("copy-drawing-button");

const drawingResultsSection = document.getElementById("drawing-results");

lowPowerCheckbox.addEventListener("change", () => {
	lowPower = lowPowerCheckbox.checked;
});

copyDrawingDataButton.addEventListener("click", () => {
	copyDrawingDataToClipboard();
});

clearScreenButton.addEventListener("click", () => {
	displayBuffer = getBlankScreen();
	updateDrawingDataSection();
});

invertScreenButton.addEventListener("click", () => {
	displayBuffer = invertDisplayBuffer();
	updateDrawingDataSection();
});

drawingResultsSection.addEventListener("paste", (event) => {
	// Get the pasted data
	const displayBufferBackup = [];
	displayBuffer.forEach((element) => {
		displayBufferBackup.push(element);
	});
	const str = event.clipboardData.getData("text/plain");

	//attempt to convert pasted data to new displaybuffer.
	try {
		const openingBracketIndex = str.indexOf("[");
		const closingBracketIndex = str.lastIndexOf("]");
		if (openingBracketIndex !== -1 && closingBracketIndex !== -1) {
			const columnData = str.substring(openingBracketIndex + 1, closingBracketIndex).split(",");

			displayBuffer = Array(columnData.length).fill(0);
			columnData.forEach((element, index) => {
				const number = parseInt(element, 16);
				displayBuffer[index] = number;
			});
		}
	} catch (ex) {
		alert(`Unable to create new displayBuffer: ${ex}`);
		displayBuffer = displayBufferBackup;
	}
});

penRB.addEventListener("change", () => {
	drawingTool.pen = true;
});

eraserRB.addEventListener("change", () => {
	drawingTool.pen = false;
});

drawingToolRadiusChoice.addEventListener("change", () => {
	drawingTool.radius = drawingToolRadiusChoice.value;
});

let lowPower = false;
let drawingMode = false;
let drawingTool = { x: 0, y: 0, radius: 20, pen: true, visible: false, down: false };

tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		tabContents.forEach((tabContent) => tabContent.classList.remove("active"));
		tabs.forEach((tab) => tab.classList.remove("active"));
		tab.classList.add("active");
		const target = document.querySelector(tab.dataset.tabTarget);
		target.classList.add("active");

		drawingMode = target.id === "drawing-mode";
	});
});

//data (stored by column, LtoR, BtoT):
const smallFontNumbers = [
	[0x7fc, 0xffe, 0x1c07, 0x1803, 0x1803, 0x1c07, 0xffe, 0x7fc], // 0
	[0x0, 0x0, 0xc00, 0x1fff, 0x1fff, 0x1fff, 0x0, 0x0], // 1
	[0xc0f, 0xc1f, 0x183f, 0x1873, 0x18e3, 0x18c3, 0x1fc3, 0xf83], // 2
	[0x802, 0x1c07, 0x1803, 0x18c3, 0x18c3, 0x1de7, 0xffe, 0x73c], // 3
	[0xf8, 0x1f8, 0x398, 0x718, 0xe18, 0x1fff, 0x1fff, 0x18], // 4
	[0x1fc2, 0x1fc7, 0x1983, 0x1983, 0x1983, 0x19c7, 0x18fe, 0x7c], // 5
	[0x1fc, 0x7fe, 0xf67, 0x1cc3, 0x18c3, 0x18e7, 0x7e, 0x7c], // 6
	[0x1800, 0x1800, 0x180f, 0x187f, 0x19ff, 0x1ff0, 0x1f80, 0x1e00], // 7
	[0x77c, 0xffe, 0x1de7, 0x18c3, 0x18c3, 0x1de7, 0xffe, 0x77c], // 8
	[0x780, 0x1fe3, 0x1ce3, 0x1863, 0x1867, 0x1cde, 0xffc, 0x7f0], // 9
];

const mediumFontNumbers = [
	[0x3ffc, 0x7ffe, 0x7ffe, 0xf00f, 0xe007, 0xe007, 0xf00f, 0x7ffe, 0x7ffe, 0x3ffc], // 0
	[0x0, 0x0, 0x7000, 0x7000, 0xffff, 0xffff, 0xffff, 0x0, 0x0, 0x0], // 1
	[0x701f, 0x703f, 0xf07f, 0xe0ff, 0xe1e7, 0xe1c7, 0xe3c7, 0xf787, 0xff07, 0x7e07], // 2
	[0x6006, 0xf00f, 0xf00f, 0xe007, 0xe387, 0xe387, 0xf7cf, 0xffff, 0x7ffe, 0x3c7c], // 3
	[0x3f8, 0x7f8, 0xf38, 0x1e38, 0x3c38, 0x7838, 0xffff, 0xffff, 0xffff, 0x38], // 4
	[0xff86, 0xff8f, 0xff8f, 0xe707, 0xe707, 0xe707, 0xe78f, 0xe7ff, 0xe3fe, 0x1fc], // 5
	[0x7fc, 0x1ffe, 0x3fcf, 0x7d87, 0xf387, 0xe387, 0xe387, 0xe3cf, 0x1fe, 0xfc], // 6
	[0xe000, 0xe000, 0xe000, 0xe01f, 0xe1ff, 0xe7ff, 0xffe0, 0xfe00, 0xf800, 0xf000], // 7
	[0x3efc, 0x7ffe, 0xf7cf, 0xe387, 0xe387, 0xe387, 0xe387, 0xf7cf, 0x7ffe, 0x3efc], // 8
	[0x3f00, 0x7f80, 0xf3c7, 0xe1c7, 0xe1c7, 0xe1cf, 0xe1be, 0xf3fc, 0x7ff8, 0x3fe0], // 9
];

const mediumFontNumbersLow = [
	[0x3ffc, 0x4002, 0x4002, 0x8001, 0x8001, 0x8001, 0x8001, 0x4002, 0x4002, 0x3ffc], // 0
	[0x0, 0x0, 0x4000, 0x8001, 0x8001, 0xffff, 0x1, 0x1, 0x0, 0x0], // 1
	[0x401e, 0x4021, 0x8041, 0x8041, 0x8081, 0x8081, 0x8101, 0x8101, 0x4201, 0x3c01], // 2
	[0x6006, 0x8001, 0x8001, 0x8001, 0x8001, 0x8101, 0x8101, 0x8281, 0x4442, 0x383c], // 3
	[0x3e0, 0x410, 0x810, 0x1010, 0x2010, 0x4010, 0x8010, 0xffff, 0x10, 0x10], // 4
	[0xf802, 0x8401, 0x8401, 0x8401, 0x8401, 0x8401, 0x8401, 0x8401, 0x8202, 0x1fc], // 5
	[0x7fc, 0x1902, 0x2201, 0x4201, 0x8201, 0x8201, 0x8201, 0x201, 0x102, 0xfc], // 6
	[0x8000, 0x8000, 0x8000, 0x8000, 0x800f, 0x8030, 0x81c0, 0x8600, 0x9800, 0x6000], // 7
	[0x3c7c, 0x4282, 0x8101, 0x8101, 0x8101, 0x8101, 0x8101, 0x8101, 0x4282, 0x3c7c], // 8
	[0x3f00, 0x4080, 0x8040, 0x8041, 0x8041, 0x8041, 0x8042, 0x8044, 0x4098, 0x3fe0], // 9
];

const largeFontNumbers = [
	[0x1ffff8, 0x7ffffc, 0x7ffffc, 0xfc003f, 0xf0001f, 0xf0001f, 0xfc003f, 0x7ffffc, 0x7ffffc, 0x1ffff8], // 0
	[0x0, 0x0, 0x7c0000, 0x7c0000, 0xffffff, 0xffffff, 0xffffff, 0x0, 0x0, 0x0], // 1
	[0x7c00ff, 0x7c01ff, 0xfc07ff, 0xf00fff, 0xf03f1f, 0xf03e1f, 0xf07e1f, 0xf8f81f, 0xfff01f, 0x7fc01f], // 2
	[0x70001c, 0xfc003f, 0xfc003f, 0xf0001f, 0xf0781f, 0xf0781f, 0xf8fe3f, 0xffffff, 0x7ffffc, 0x1f87f8], // 3
	[0x7fe0, 0x1ffe0, 0x3f1e0, 0xfc1e0, 0x1f81e0, 0x7e01e0, 0xffffff, 0xffffff, 0xffffff, 0x1e0], // 4
	[0xfff81c, 0xfff83f, 0xfff83f, 0xf1f01f, 0xf1f01f, 0xf1f01f, 0xf1f83f, 0xf1ffff, 0xf07ffc, 0x3ff8], // 5
	[0x1fff8, 0xffffc, 0x1ffe3f, 0x7fb81f, 0xfc781f, 0xf0781f, 0xf0781f, 0xf07e3f, 0x3ffc, 0xff8], // 6
	[0xf00000, 0xf00000, 0xf00000, 0xf000ff, 0xf03fff, 0xf1ffff, 0xffff00, 0xffc000, 0xfe0000, 0xfc0000], // 7
	[0x1fcff8, 0x7ffffc, 0xf9fe3f, 0xf0781f, 0xf0781f, 0xf0781f, 0xf0781f, 0xf9fe3f, 0x7ffffc, 0x1fcff8], // 8
	[0x1ff000, 0x3ffc00, 0xfc7e0f, 0xf81e0f, 0xf81e0f, 0xf81e3f, 0xf81dfe, 0xfc7ff8, 0x3ffff0, 0x1fff80], // 9
];

const largeFontNumbersLow = [
	[0x3ffffc, 0x400002, 0x400002, 0x800001, 0x800001, 0x800001, 0x800001, 0x400002, 0x400002, 0x3ffffc], // 0
	[0x0, 0x0, 0x0, 0x400001, 0x400001, 0xffffff, 0x1, 0x1, 0x0, 0x0], // 1
	[0x7, 0x300019, 0x400061, 0x800081, 0x800101, 0x800201, 0x800401, 0x801801, 0x406001, 0x3f8001], // 2
	[0x30000c, 0x400002, 0x800001, 0x800001, 0x800001, 0x801001, 0x801001, 0x402802, 0x204404, 0x1f83f8], // 3
	[0x1f80, 0x6040, 0x18040, 0x60040, 0x180040, 0x600040, 0x800040, 0xffffff, 0x40, 0x40], // 4
	[0xffe002, 0x802001, 0x802001, 0x802001, 0x802001, 0x802001, 0x802001, 0x802001, 0x801002, 0xffc], // 5
	[0x3fff8, 0xc1004, 0x102002, 0x202001, 0x402001, 0x402001, 0x802001, 0x802002, 0x1004, 0xff8], // 6
	[0x800000, 0x800000, 0x800000, 0x800000, 0x8000ff, 0x801f00, 0x80e000, 0x810000, 0x820000, 0x7c0000], // 7
	[0x3fc7fc, 0x402802, 0x801001, 0x801001, 0x801001, 0x801001, 0x801001, 0x801001, 0x402802, 0x3fc7fc], // 8
	[0x1ff000, 0x200800, 0x400401, 0x800401, 0x800402, 0x800402, 0x800404, 0x400408, 0x200830, 0x1fffc0], // 9
];

const smallGlyphs = [
	[0xf, 0x12, 0x22, 0x12, 0xf], // 0
	[0x3f, 0x29, 0x29, 0x29, 0x16], // 1
	[0x1e, 0x21, 0x21, 0x21, 0x21], // 2
	[0x3f, 0x21, 0x21, 0x21, 0x1e], // 3
	[0x3f, 0x29, 0x29, 0x21, 0x1], // 4
	[0x3f, 0x28, 0x28, 0x20, 0x20], // 5
	[0x1e, 0x21, 0x21, 0x29, 0xe], // 6
	[0x3f, 0x8, 0x8, 0x8, 0x3f], // 7
	[0x0, 0x21, 0x3f, 0x21, 0x0], // 8
	[0x2, 0x1, 0x1, 0x1, 0x3e], // 9
	[0x3f, 0x8, 0x8, 0x14, 0x23], // A
	[0x3f, 0x1, 0x1, 0x1, 0x1], // B
	[0x3f, 0x10, 0xc, 0x10, 0x3f], // C
	[0x3f, 0x10, 0x8, 0x4, 0x3f], // D
	[0x1e, 0x21, 0x21, 0x21, 0x1e], // E
	[0x3f, 0x28, 0x28, 0x28, 0x10], // F
	[0x1e, 0x21, 0x21, 0x22, 0x1d], // G
	[0x3f, 0x24, 0x24, 0x2a, 0x11], // H
	[0x11, 0x29, 0x29, 0x29, 0x6], // I
	[0x20, 0x20, 0x3f, 0x20, 0x20], // J
	[0x3e, 0x1, 0x1, 0x1, 0x3e], // K
	[0x30, 0xc, 0x3, 0xc, 0x30], // L
	[0x3e, 0x1, 0x6, 0x1, 0x3e], // M
	[0x21, 0x12, 0xc, 0x12, 0x21], // N
	[0x30, 0x8, 0x7, 0x8, 0x30], // O
	[0x23, 0x25, 0x29, 0x29, 0x31], // P
	[0x1e, 0x23, 0x25, 0x29, 0x1e], // Q
	[0x0, 0x20, 0x3f, 0x0, 0x0], // R
	[0x23, 0x25, 0x29, 0x29, 0x11], // S
	[0x21, 0x21, 0x29, 0x29, 0x16], // T
	[0x6, 0xa, 0x12, 0x3f, 0x2], // U
	[0x39, 0x29, 0x29, 0x29, 0x26], // V
	[0x1e, 0x29, 0x29, 0x29, 0x6], // W
	[0x20, 0x20, 0x27, 0x28, 0x30], // X
	[0x16, 0x29, 0x29, 0x29, 0x16], // Y
	[0x10, 0x28, 0x29, 0x29, 0x1e], // Z
];

const mediumGlyphs = [
	[0x1f, 0x24, 0x44, 0x24, 0x1f], // 0
	[0x7f, 0x49, 0x49, 0x49, 0x36], // 1
	[0x3e, 0x41, 0x41, 0x41, 0x41], // 2
	[0x7f, 0x41, 0x41, 0x41, 0x3e], // 3
	[0x7f, 0x49, 0x49, 0x41, 0x1], // 4
	[0x7f, 0x48, 0x48, 0x40, 0x40], // 5
	[0x3e, 0x41, 0x41, 0x49, 0xe], // 6
	[0x7f, 0x8, 0x8, 0x8, 0x7f], // 7
	[0x0, 0x41, 0x7f, 0x41, 0x0], // 8
	[0x2, 0x1, 0x1, 0x1, 0x7e], // 9
	[0x7f, 0x8, 0x8, 0x14, 0x63], // A
	[0x7f, 0x1, 0x1, 0x1, 0x1], // B
	[0x7f, 0x30, 0x1c, 0x30, 0x7f], // C
	[0x7f, 0x10, 0x8, 0x4, 0x7f], // D
	[0x3e, 0x41, 0x41, 0x41, 0x3e], // E
	[0x7f, 0x48, 0x48, 0x48, 0x30], // F
	[0x3e, 0x41, 0x41, 0x42, 0x3d], // G
	[0x7f, 0x44, 0x44, 0x4a, 0x31], // H
	[0x31, 0x49, 0x49, 0x49, 0x6], // I
	[0x40, 0x40, 0x7f, 0x40, 0x40], // J
	[0x7e, 0x1, 0x1, 0x1, 0x7e], // K
	[0x70, 0xc, 0x3, 0xc, 0x70], // L
	[0x7e, 0x1, 0x6, 0x1, 0x7e], // M
	[0x63, 0x14, 0x8, 0x14, 0x63], // N
	[0x70, 0x8, 0x7, 0x8, 0x70], // O
	[0x43, 0x45, 0x49, 0x51, 0x61], // P
	[0x3e, 0x45, 0x49, 0x51, 0x3e], // Q
	[0x0, 0x40, 0x7f, 0x0, 0x0], // R
	[0x47, 0x49, 0x49, 0x51, 0x31], // S
	[0x41, 0x41, 0x49, 0x49, 0x36], // T
	[0xe, 0x32, 0x42, 0x7f, 0x2], // U
	[0x71, 0x51, 0x51, 0x51, 0x4e], // V
	[0x3e, 0x51, 0x51, 0x51, 0xe], // W
	[0x40, 0x40, 0x47, 0x48, 0x70], // X
	[0x36, 0x49, 0x49, 0x49, 0x36], // Y
	[0x30, 0x48, 0x49, 0x49, 0x3e], // Z
];

const signModels = [
	/*{ name: '8"', width: 17.067, height: 8.4, ledDiameter: 0.157, margin: 0.2, pitchX: 0.667, pitchY: 0.667, ledsX: 26, ledsY: 13 },*/
	{ name: '10"', width: 21.1, height: 10.4, ledDiameter: 0.157, margin: 0.2, pitchX: 0.667, pitchY: 0.667, ledsX: 32, ledsY: 16 },
	{ name: '12"', width: 25.1, height: 12.4, ledDiameter: 0.188, margin: 0.2, pitchX: 0.8, pitchY: 0.8, ledsX: 32, ledsY: 16 },
	{ name: '14"', width: 29.1, height: 14.4, ledDiameter: 0.13, margin: 0.2, pitchX: 0.9333, pitchY: 0.9333, ledsX: 32, ledsY: 16 },
	{ name: '18"', width: 28.5, height: 19, ledDiameter: 0.157, margin: 0.2, pitchX: 0.92, pitchY: 0.809, ledsX: 32, ledsY: 24 },
];

//ui wiring:
bloomSlider.addEventListener("input", (e) => {
	bloomFactor = parseInt(e.target.value);
	updateSelectedObject(signSelect.selectedIndex);
});

signSelect.addEventListener("change", () => updateSelectedObject(signSelect.selectedIndex));

function updateSelectedObject(index) {
	signSelect.selectedIndex = Math.max(0, index);
	selectedModel = signModels[signSelect.selectedIndex];
	updateMeasurementInputs();
	fitScreenToCanvas(selectedModel.width, selectedModel.height, camera);
}

function updateMeasurementInputs() {
	//clear existing inputs
	measurementsDiv.innerHTML = "";

	//create text boxes for each property of the selected model
	Object.keys(selectedModel).forEach((key) => {
		if (key !== "name") {
			const inputWrapper = document.createElement("div");
			const label = document.createElement("label");
			label.textContent = `${key}: `;
			label.classList.add("subheading");
			const input = document.createElement("input");

			//set input type and initial value
			input.type = "number";
			input.value = selectedModel[key];
			input.classList.add("subheading");

			//ensure integer input for ledsX and ledsY
			if (key === "ledsX" || key === "ledsY") {
				input.step = "1"; //enforce integer step
				input.addEventListener("input", (e) => {
					const value = parseInt(e.target.value, 10);
					if (!isNaN(value)) {
						selectedModel[key] = value;
					}
				});
			} else {
				input.step = "0.01"; //default step for other numeric inputs
				input.addEventListener("input", (e) => {
					const value = parseFloat(e.target.value);
					if (!isNaN(value)) {
						selectedModel[key] = value;
					}
				});
			}

			inputWrapper.appendChild(label);
			inputWrapper.appendChild(input);
			measurementsDiv.appendChild(inputWrapper);
		}
	});
}

function fitScreenToCanvas(objectWidthInInches, objectHeightInInches, camera) {
	const zoomX = canvas.width / objectWidthInInches;
	const zoomY = canvas.height / objectHeightInInches;
	camera.zoom = Math.min(zoomX, zoomY);
}

function draw(ctx, camera) {
	const topLeft = { x: -selectedModel.width / 2, y: -selectedModel.height / 2 };
	const topLeftPixels = worldToCanvas(topLeft.x, topLeft.y);
	const boardWidthPixels = selectedModel.width * camera.zoom;
	const boardHeightPixels = selectedModel.height * camera.zoom;
	const ledRadiusPixels = (selectedModel.ledDiameter / 2) * camera.zoom;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(topLeftPixels.x, topLeftPixels.y, boardWidthPixels, boardHeightPixels);

	const ledOnColor = "#FFB343";
	const ledOffColor = "#1B1B1B";
	const bloom = `#FFBF00${bloomFactor.toString().padStart(2, "0")}`;

	//draw centerlines if we are in drawing mode
	if (drawingMode) {
		const boardCenterX = topLeftPixels.x + boardWidthPixels / 2;
		const boardCenterY = topLeftPixels.y + boardHeightPixels / 2;
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.setLineDash([5, 15]);
		ctx.moveTo(boardCenterX, topLeftPixels.y);
		ctx.lineTo(boardCenterX, topLeftPixels.y + boardHeightPixels);
		ctx.moveTo(topLeftPixels.x, boardCenterY);
		ctx.lineTo(topLeftPixels.x + boardWidthPixels, boardCenterY);
		ctx.stroke();
	}

	for (let column = selectedModel.ledsX - 1; column >= 0; column--) {
		const bits = getBits(displayBuffer[column]);
		var xPosition = topLeft.x + selectedModel.margin + column * selectedModel.pitchX;

		//provide for the two boards placed together in 18" sign
		if (selectedModel.name == '18"' && column > 15) {
			xPosition -= 0.378;
		}

		//traverse the column from bottom to top
		for (let row = selectedModel.ledsY - 1; row >= 0; row--) {
			//draw each LED
			const pos = worldToCanvas(xPosition, topLeft.y + selectedModel.margin + row * selectedModel.pitchY);
			const ledOn = bits[selectedModel.ledsY - 1 - row] == 1;
			ctx.fillStyle = ledOn ? ledOnColor : ledOffColor;
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, ledRadiusPixels, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	//second pass: add bloom effect
	for (let column = selectedModel.ledsX - 1; column >= 0; column--) {
		const bits = getBits(displayBuffer[column]);
		//traverse the column from bottom to top
		for (let row = selectedModel.ledsY - 1; row >= 0; row--) {
			//draw each LED
			const pos = worldToCanvas(topLeft.x + selectedModel.margin + column * selectedModel.pitchX, topLeft.y + selectedModel.margin + row * selectedModel.pitchY);
			const ledOn = bits[selectedModel.ledsY - 1 - row] == 1;

			if (ledOn) {
				ctx.fillStyle = bloom;
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, ledRadiusPixels * 10, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
			}
		}
	}

	//draw drawing tool UI if needed
	drawDrawingTool();
}

function worldToCanvas(worldX, worldY) {
	const canvasX = (worldX - camera.x) * camera.zoom + canvas.width / 2;
	const canvasY = (worldY - camera.y) * camera.zoom + canvas.height / 2;
	return { x: canvasX, y: canvasY };
}

function canvasToWorld(canvasX, canvasY) {
	const worldX = (canvasX - canvas.width / 2) / camera.zoom + camera.x;
	const worldY = (canvasY - canvas.height / 2) / camera.zoom + camera.y;
	return { x: worldX, y: worldY };
}

function canvasRadiusToWorldRadius(canvasRadius) {
	return canvasRadius / camera.zoom;
}

// Populate the select element with options
signModels.forEach((model, index) => {
	const option = document.createElement("option");
	option.value = index;
	option.textContent = model.name;
	signSelect.appendChild(option);
});

function getBlankScreen() {
	return Array(selectedModel.ledsX).fill(0);
}

function convertImageToData(imgElement, digitsOnly = true) {
	let output = "";
	const map = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	//create a temporary canvas to recover pixel information
	const tempCanvas = document.createElement("canvas");
	tempCanvas.width = imgElement.width;
	tempCanvas.height = imgElement.height;
	const tempCtx = tempCanvas.getContext("2d");

	//draw the image onto the canvas
	tempCtx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

	//get the pixel data
	const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
	const pixels = imageData.data;

	let columns = [];
	let glyphIndex = 0;
	let columnData;

	for (let x = 0; x < imgElement.width; x++) {
		columnData = 0;

		//check the first pixel in the column to detect a red separator
		const offset = (imgElement.width * 0 + x) * 4;
		const r = pixels[offset];
		const g = pixels[offset + 1];
		const b = pixels[offset + 2];

		if (r > 128 && g < 128 && b < 128) {
			//red separator detected, process the current glyph
			if (columns.length > 0) {
				if (digitsOnly) {
					output += `[${columns.join(", ")}], // ${glyphIndex}\n`;
				} else {
					output += `[${columns.join(", ")}], // ${map[glyphIndex]}\n`;
				}

				columns = [];
				glyphIndex++;
			}
		} else {
			//process this column as part of the current glyph
			for (let y = 0; y < imgElement.height; y++) {
				const pixelOffset = (imgElement.width * y + x) * 4;
				const red = pixels[pixelOffset];
				const green = pixels[pixelOffset + 1];
				const blue = pixels[pixelOffset + 2];

				if (red < 128 && green < 128 && blue < 128) {
					//black pixel detected, set the corresponding bit
					columnData |= 1 << (imgElement.height - 1 - y);
				}
			}
			columns.push(`0x${columnData.toString(16)}`);
		}
	}

	//push the final glyph data if any columns remain
	if (columns.length > 0) {
		if (digitsOnly) {
			output += `[${columns.join(", ")}], // ${glyphIndex}\n`;
		} else {
			output += `[${columns.join(", ")}], // ${map[glyphIndex]}\n`;
		}
	}

	resultsDiv.innerText = output;
}

function getBits(columnData) {
	const bits = [];
	// Force columnData to be unsigned
	columnData >>>= 0;

	for (let i = 0; i < 24; i++) {
		bits.push((columnData & (1 << i)) === 0 ? 0 : 1);
	}
	return bits;
}

function isBitSet(number, position) {
	// Force number to be unsigned
	return ((number >>> 0) & (1 << position)) !== 0;
}

function setBit(number, position) {
	// Force number to be unsigned
	return (number >>> 0) | (1 << position);
}

function unsetBit(number, position) {
	// Force number to be unsigned
	return (number >>> 0) & ~(1 << position);
}

function drawMessage(message) {
	const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const glyphs = selectedModel.name === '8"' ? smallGlyphs : mediumGlyphs;
	const glyphHeight = selectedModel.name === '8"' ? 6 : 7;
	const maxLetters = selectedModel.name === '8"' ? 4 : 5;
	const maxWords = selectedModel.name === '18"' ? 3 : 2;
	const gap = 1;
	//split message into words.
	var words = message.toUpperCase().split(" ");

	displayBuffer = getBlankScreen();

	//truncate words to max allowed
	if (words.length >= maxWords) {
		words = words.slice(0, maxWords);
	}

	var currentY = Math.floor(selectedModel.ledsY / 2 - ((glyphHeight + gap) * words.length) / 2) + 1;

	words.reverse().forEach((word) => {
		//truncate each word to the max allowed letters
		if (word.length > maxLetters) {
			word = word.slice(0, maxLetters);
		}

		//center words horizontally
		var currentX = selectedModel.ledsX / 2 - (word.length * 6) / 2;

		for (const letter of word) {
			const glyphIndex = map.indexOf(letter);
			if (glyphIndex >= 0) {
				for (let x = 0; x < 6; x++) {
					let columnData = glyphs[glyphIndex][x];
					const displayColumnIndex = currentX + x;
					for (let y = 0; y < glyphHeight; y++) {
						if (isBitSet(columnData, y)) {
							displayBuffer[displayColumnIndex] = setBit(displayBuffer[currentX + x], currentY + y);
						}
					}
				}

				currentX += 6;
			}
		}
		currentY += glyphHeight + gap;
	});
}

function drawNumber(number) {
	let numbers;

	if (lowPower) {
		numbers = selectedModel.name == '18"' ? largeFontNumbersLow : mediumFontNumbersLow;
	} else {
		numbers = selectedModel.name == '18"' ? largeFontNumbers : mediumFontNumbers;
	}

	const offset = 10;

	displayBuffer = getBlankScreen();

	//get each digit from the number
	const num = Math.max(0, Math.min(number, 999));
	var stringDigits = num.toString().split("");
	var digits = stringDigits.map(Number);

	//try to center the number with the following hack that shows less 'wobble' than true centering with variable width glyphs
	var currentX = Math.round(selectedModel.ledsX / 2 - offset / 2);
	var gap = 2;
	if (digits.length == 2) {
		currentX = Math.round(selectedModel.ledsX / 2 - offset) - 1;
		gap = 3;
	} else if (digits.length == 3) {
		currentX = -1; //1 + Math.round(selectedModel.ledsX / 2 - (offset * 3) / 2);
		gap = 1;
	}

	for (const digit of digits) {
		var width = offset;

		for (let x = 0; x < width; x++) {
			if (currentX + x >= 0) {
				displayBuffer[currentX + x] = numbers[digit][x];
			}
		}
		currentX += width + gap;
	}
}

function drawDrawingTool() {
	if (!drawingMode || !drawingTool.visible) return;

	ctx.beginPath();
	ctx.moveTo(drawingTool.x, drawingTool.y);
	ctx.fillStyle = drawingTool.down ? "#FF000088" : "#00FFFF88";
	ctx.ellipse(drawingTool.x, drawingTool.y, drawingTool.radius, drawingTool.radius, 0, 0, 2 * Math.PI);
	ctx.fill();
}

function updateLedsInRadius(worldX, worldY, worldRadius) {
	for (let column = 0; column < selectedModel.ledsX; column++) {
		for (let row = 0; row < selectedModel.ledsY; row++) {
			// Calculate the world position of the current LED
			const ledWorldX = -selectedModel.width / 2 + selectedModel.margin + column * selectedModel.pitchX;
			const ledWorldY = -selectedModel.height / 2 + selectedModel.margin + row * selectedModel.pitchY;

			// Calculate the distance between the LED and the drawing tool center
			const distance = Math.sqrt(Math.pow(worldX - ledWorldX, 2) + Math.pow(worldY - ledWorldY, 2));

			// Check if the LED is within the radius
			if (distance <= worldRadius) {
				const bitMask = 1 << (selectedModel.ledsY - 1 - row);
				if (drawingTool.pen) {
					// Set the bit
					displayBuffer[column] |= bitMask;
				} else {
					// Unset the bit
					displayBuffer[column] &= ~bitMask;
				}
			}
		}
	}
	updateDrawingDataSection();
}

function updateDrawingDataSection() {
	let result = "[";
	displayBuffer.forEach((columnData) => {
		const unsignedNumber = columnData >>> 0; // Force unsigned
		result += `0x${unsignedNumber.toString(16)}, `;
	});
	const lastComma = result.lastIndexOf(",");
	result = result.slice(0, lastComma);
	drawingResultsSection.value = result + "]";
}

function invertDisplayBuffer() {
	console.log("Display Buffer Length:", displayBuffer.length);
	// Create a new buffer for the inverted result
	return displayBuffer.map((column, index) => {
		console.log("INDEX", index);
		// Invert all bits and force the result to be unsigned
		const inverted = ~column >>> 0;

		// Debugging: Log the column and its inversion
		console.log(`Column ${index}: Original: ${column.toString(2).padStart(32, "0")} Inverted: ${inverted.toString(2).padStart(32, "0")}`);

		return inverted;
	});
}

function isLEDLit(x, y) {
	if (x < 0 || x >= displayBuffer.length || y < 0 || y > 15) {
		throw new Error("Invalid position");
	}

	// get the 16-bit number at column x
	const column = array[x];

	// check if the bit at position y is set
	return (column >> y) & (1 === 1);
}

function copyDrawingDataToClipboard() {
	const textToCopy = drawingResultsSection.value;

	navigator.clipboard
		.writeText(textToCopy)
		.then(() => {
			alert("Data copied to clipboard");
		})
		.catch((err) => {
			alert("Failed to copy: ", err);
		});
}

function updateDrawingToolPosition(e) {
	var rect = canvas.getBoundingClientRect();
	drawingTool.x = e.clientX - rect.left;
	drawingTool.y = e.clientY - rect.top;
}

function drawOnCanvas() {
	if (!drawingMode || !drawingTool.down) return;
	let worldPosition = canvasToWorld(drawingTool.x, drawingTool.y);
	let worldRadius = canvasRadiusToWorldRadius(drawingTool.radius);
	updateLedsInRadius(worldPosition.x, worldPosition.y, worldRadius);
}

//canvas drawing logic
canvas.onmousedown = function (e) {
	if (drawingMode) {
		if (e.button === 0) {
			drawingTool.down = true;
		}

		updateDrawingToolPosition(e);
		drawOnCanvas();
	}
};
canvas.onmousemove = function (e) {
	if (drawingMode) {
		// important: correct mouse position:
		updateDrawingToolPosition(e);
		drawOnCanvas();
	}
};

canvas.onmouseenter = function (e) {
	if (drawingMode) {
		drawingTool.visible = true;
	}
};

canvas.onmouseleave = function (e) {
	drawingTool.visible = false;
};

window.addEventListener("mouseup", (event) => {
	if (event.button === 0) {
		drawingTool.down = false;
	}
});

window.addEventListener("load", function () {
	//set UI defaults and wire up event handlers
	sliderLabel.innerHTML = slider.value; // Display the default slider value

	slider.oninput = function () {
		sliderLabel.innerHTML = this.value;
		drawNumber(slider.value);
	};

	txtMessage.addEventListener("input", (e) => {
		drawMessage(txtMessage.value);
	});

	//initialize
	signSelect.selectedIndex = 1;
	selectedModel = signModels[signSelect.selectedIndex];
	bloomFactor = bloomSlider.value;

	displayBuffer = getBlankScreen();

	drawNumber(slider.value);

	updateSelectedObject(1);
	updateDrawingDataSection();

	if (drawingTool.pen) {
		penRB.checked = true;
	} else {
		eraserRB.checked = true;
	}

	this.setInterval(() => {
		draw(ctx, camera);
	}, 50);
});

//convert image to data once it loads
image.addEventListener("load", (e) => {
	convertImageToData(image, true);
});

//vars:
const camera = {
	x: 0,
	y: 0,
	zoom: 0,
};

let bloomFactor;
let selectedModel;
let displayBuffer;
