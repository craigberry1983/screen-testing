//ui refs:
const image = document.getElementById("source");
const txtMessage = document.getElementById("txtMessage");
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const resultsDiv = document.getElementById("results");
const slider = document.getElementById("speedSlider");
const sliderLabel = document.getElementById("sliderLabel");
const bloomSlider = document.getElementById("bloom");
const signSelect = document.getElementById("signSelect");
const measurementsDiv = document.getElementById("measurements");

//data:
const smallFontOffsets = [15, 7, 12, 13, 14, 13, 12, 12, 12, 12]; //8"
const mediumFontOffsets = [17, 9, 14, 15, 17, 15, 16, 15, 14, 14]; //12", 14"
const largeFontOffsets = [26, 12, 24, 23, 26, 23, 23, 23, 24, 24]; //18"

const smallFontNumbers = [
	[0x3f8, 0x7fc, 0xe0e, 0x1c07, 0x1803, 0x1803, 0x1803, 0x1c07, 0xe0e, 0x7fc, 0x1f0], // 0
	[0xc00, 0x1fff, 0x1fff], // 1
	[0xc07, 0xc1f, 0x1c3f, 0x187b, 0x1873, 0x18e3, 0x18e3, 0x1cc3, 0xfc3, 0x783], // 2
	[0xc, 0xc0e, 0xc0e, 0x1807, 0x1803, 0x1983, 0x1983, 0x1983, 0xfc6, 0x7fe, 0x78], // 3
	[0x38, 0x78, 0xf8, 0x1d8, 0x398, 0x718, 0xe18, 0x1c18, 0x1fff, 0x1fff, 0x18, 0x18], // 4
	[0x0, 0x1fc6, 0x1fc7, 0x1983, 0x1983, 0x1983, 0x1983, 0x1983, 0x18c6, 0x18fe, 0x38], // 5
	[0xfc, 0x3fe, 0x7e7, 0xcc3, 0xcc3, 0x18c3, 0x18c3, 0x1867, 0x7e, 0x3c], // 6
	[0x1800, 0x1800, 0x1800, 0x1800, 0x181f, 0x18ff, 0x1bf0, 0x1f80, 0x1e00, 0x1c00], // 7
	[0x7c, 0x7fe, 0xdc6, 0x1883, 0x1883, 0x1883, 0x1883, 0x18c6, 0xffe, 0x67c], // 8
	[0x700, 0xf80, 0x1dc3, 0x18c3, 0x18c3, 0x18c6, 0x18ce, 0xddc, 0xff8, 0x3e0], // 9
];

const mediumFontNumbers = [
	[0x7e0, 0x1ff8, 0x7ffe, 0x781e, 0xf00f, 0xe007, 0xe007, 0xe007, 0xf00f, 0x781e, 0x7ffe, 0x1ffc, 0x7e0], // 0
	[0x3000, 0x7000, 0xffff, 0xffff, 0xffff], // 1
	[0x3007, 0x701f, 0x707f, 0xf0f7, 0xe0e7, 0xe1c7, 0xe1c7, 0xe187, 0xf387, 0x7f87, 0x7f07, 0x1e07], // 2
	[0x18, 0x301c, 0x701e, 0x700e, 0xe00f, 0xe007, 0xe707, 0xe707, 0xe707, 0x7f8e, 0x7ffe, 0x39fc, 0xf8], // 3
	[0x78, 0xf8, 0x1f8, 0x3f8, 0x7b8, 0xf38, 0x1e38, 0x3838, 0x7038, 0xffff, 0xffff, 0xffff, 0x38, 0x38], // 4
	[0x0, 0xff8e, 0xff8e, 0xff87, 0xe707, 0xe707, 0xe707, 0xe707, 0xe707, 0xe38e, 0xe3fe, 0xe1fc, 0x70], // 5
	[0x3f8, 0xffc, 0x1ffe, 0x3f8e, 0x7b07, 0x7307, 0xe307, 0xe307, 0xe38f, 0xe1fe, 0xfc, 0x78], // 6
	[0xe000, 0xe000, 0xe000, 0xe000, 0xe01f, 0xe0ff, 0xe3ff, 0xefe0, 0xff00, 0xfc00, 0xf800, 0xf000], // 7
	[0x38f8, 0x7dfc, 0x7ffe, 0xe78f, 0xc307, 0xc307, 0xc307, 0xc307, 0xe78f, 0x7ffe, 0x7dfc, 0x38f8], // 8
	[0x3c00, 0x7f00, 0x7f07, 0xe387, 0xc187, 0xc18f, 0xc18e, 0xc19e, 0x63bc, 0x7ff8, 0x3ff0, 0xfc0], // 9
];

const largeFontNumbers = [
	[0xff00, 0x7ffe0, 0xffff0, 0x3ffffc, 0x3f80fc, 0x7c003e, 0x78001e, 0xf8001f, 0xf0000f, 0xf0000f, 0xf0000f, 0xf0000f, 0xf8001f, 0x78001e, 0x7c003e, 0x3f01fc, 0x3ffffc, 0x1ffff8, 0x7ffe0, 0xff00], // 0
	[0x3c0000, 0x3c0000, 0x7c0000, 0xffffff, 0xffffff, 0xffffff, 0xffffff], // 1
	[0x10000f, 0x38003f, 0x3c00ff, 0x7c01ff, 0x7c03ff, 0x7807ff, 0xf80fcf, 0xf00f8f, 0xf01f0f, 0xf01f0f, 0xf03e0f, 0xf03e0f, 0xf03c0f, 0xf07c0f, 0x787c0f, 0x78f80f, 0x7ff80f, 0x3ff00f, 0x1fe00f, 0x7c00f], // 2
	[0x10, 0x100038, 0x38007c, 0x38007e, 0x7c003e, 0x78001e, 0xf8001f, 0xf0000f, 0xf0000f, 0xf0f00f, 0xf0f00f, 0xf0f00f, 0xf8f00f, 0x79f81e, 0x7ffc3e, 0x3ffffc, 0x3ffff8, 0xf1ff0, 0x7e0], // 3
	[0x3e0, 0x7e0, 0xfe0, 0x1fe0, 0x3fe0, 0x7fe0, 0xfde0, 0x1f9e0, 0x3f1e0, 0x7e1e0, 0xfc1e0, 0x1f81e0, 0x3f01e0, 0x7e01e0, 0xfc01e0, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0x1e0, 0x1e0, 0x1e0, 0x1e0], // 4
	[0xc, 0xffe01c, 0xffe03e, 0xfff01e, 0xfff01e, 0xf1f00f, 0xf1e00f, 0xf1e00f, 0xf1e00f, 0xf1e00f, 0xf1e00f, 0xf1e00f, 0xf1f01f, 0xf0f01e, 0xf0f83e, 0xf07ffc, 0xf03ff8, 0x1ff0, 0x7c0], // 5
	[0x3fc0, 0xfff0, 0x3fff8, 0x7fffc, 0xffffe, 0x1ffe3e, 0x3f7c1e, 0x3e780f, 0x7c780f, 0x78780f, 0x78780f, 0xf0780f, 0xf0780f, 0xf07c1e, 0xf03e3e, 0xf03ffe, 0x1ffc, 0xff8, 0x3e0], // 6
	[0xf00000, 0xf00000, 0xf00000, 0xf00000, 0xf00000, 0xf00000, 0xf00000, 0xf0007f, 0xf007ff, 0xf01fff, 0xf07fff, 0xf1ffc0, 0xf7fe00, 0xfff800, 0xffe000, 0xff8000, 0xff0000, 0xfc0000, 0xf80000, 0xf80000], // 7
	[0x7e0, 0xf1ff8, 0x3ffffc, 0x3ffffc, 0x7ffc3e, 0x78f81e, 0xf0781f, 0xf0700f, 0xf0700f, 0xf0700f, 0xf0700f, 0xf0700f, 0xf0700f, 0xf0781f, 0x78f81e, 0x7ffc3e, 0x3ffffc, 0x3ffffc, 0xf1ff8, 0x7e0], // 8
	[0xf8000, 0x1fe000, 0x3ff000, 0x7ff80f, 0x7cf80f, 0x78780f, 0xf03c0f, 0xf03c0f, 0xf03c1e, 0xf03c1e, 0xf03c3e, 0xf03c3c, 0xf03c7c, 0x787cf8, 0x7cfff8, 0x7ffff0, 0x3fffe0, 0x1fffc0, 0xfff00, 0x3f800], // 9
];

const numbers = [
	[0x1ff8, 0x7ffe, 0xf00f, 0xc003, 0xc003, 0xf00f, 0x7ffe, 0x1ff8], // 0
	[0x0, 0x6000, 0x6000, 0xffff, 0xffff, 0x0, 0x0, 0x0], // 1
	[0x601f, 0xe03f, 0xc073, 0xc0e3, 0xc1c3, 0xe383, 0x7f03, 0x3e03], // 2
	[0x6, 0x6007, 0xe183, 0xc183, 0xc183, 0xe3c7, 0x7ffe, 0x3e3c], // 3
	[0xf8, 0x3f8, 0xf18, 0x3c18, 0x7018, 0xffff, 0xffff, 0x18], // 4
	[0x7e03, 0xff03, 0xc303, 0xc303, 0xc303, 0xc387, 0xc1fe, 0xc0fc], // 5
	[0x3fe, 0xfff, 0x1f83, 0x3983, 0x7183, 0xe183, 0x40ff, 0x7e], // 6
	[0xc000, 0xc000, 0xc03f, 0xc1ff, 0xc3e0, 0xcf80, 0xfe00, 0xf800], // 7
	[0x3e7c, 0x7ffe, 0xe3c7, 0xc183, 0xc183, 0xe3c7, 0x7ffe, 0x3e7c], // 8
	[0x7e00, 0xff02, 0xc187, 0xc18e, 0xc19c, 0xc1f8, 0xfff0, 0x7fc0], // 9
];

const glyphs = [
	[0x7e00, 0x9000, 0x9000, 0x9000, 0x7e00, 0x0], // A
	[0xfe00, 0x9200, 0x9200, 0x9200, 0x6c00, 0x0], // B
	[0x7c00, 0x8200, 0x8200, 0x8200, 0x4400, 0x0], // C
	[0xfe00, 0x8200, 0x8200, 0x8200, 0x7c00, 0x0], // D
	[0xfe00, 0x9200, 0x9200, 0x9200, 0x8200, 0x0], // E
	[0xfe00, 0x9000, 0x9000, 0x9000, 0x8000, 0x0], // F
	[0x7c00, 0x8200, 0x9200, 0x9200, 0x1e00, 0x0], // G
	[0xfe00, 0x1000, 0x1000, 0x1000, 0xfe00, 0x0], // H
	[0x8200, 0x8200, 0xfe00, 0x8200, 0x8200, 0x0], // I
	[0x400, 0x200, 0x200, 0x200, 0xfc00, 0x0], // J
	[0xfe00, 0x1000, 0x2800, 0x4400, 0x8200, 0x0], // K
	[0xfe00, 0x200, 0x200, 0x200, 0x200, 0x0], // L
	[0xfe00, 0x4000, 0x2000, 0x4000, 0xfe00, 0x0], // M
	[0xfe00, 0x2000, 0x1000, 0x800, 0xfe00, 0x0], // N
	[0x7c00, 0x8200, 0x8200, 0x8200, 0x7c00, 0x0], // O
	[0xfe00, 0x9000, 0x9000, 0x9000, 0x6000, 0x0], // P
	[0x7c00, 0x8200, 0x8a00, 0x7c00, 0x200, 0x0], // Q
	[0xfe00, 0x9000, 0x9800, 0x9400, 0x6200, 0x0], // R
	[0x6400, 0x9200, 0x9200, 0x9200, 0x4c00, 0x0], // S
	[0x8000, 0x8000, 0xfe00, 0x8000, 0x8000, 0x0], // T
	[0xfc00, 0x200, 0x200, 0x200, 0xfc00, 0x0], // U
	[0xf800, 0x400, 0x200, 0x400, 0xf800, 0x0], // V
	[0xfe00, 0x400, 0x800, 0x400, 0xfe00, 0x0], // W
	[0xc600, 0x2800, 0x1000, 0x2800, 0xc600, 0x0], // X
	[0xc000, 0x2000, 0x1e00, 0x2000, 0xc000, 0x0], // Y
	[0x8600, 0x8a00, 0x9200, 0xa200, 0xc200, 0x0], // Z
	[0x7c00, 0x8a00, 0x9200, 0xa200, 0x7c00, 0x0], // 0
	[0x2200, 0x4200, 0xfe00, 0x200, 0x200, 0x0], // 1
	[0x4200, 0x8600, 0x8a00, 0x9200, 0x6200, 0x0], // 2
	[0x4400, 0x8200, 0x9200, 0x9200, 0x6c00, 0x0], // 3
	[0x3800, 0x4800, 0x8800, 0xfe00, 0x800, 0x0], // 4
	[0x7400, 0x9200, 0x9200, 0x9200, 0x8c00, 0x0], // 5
	[0x3c00, 0x5200, 0x9200, 0x1200, 0xc00, 0x0], // 6
	[0x8000, 0x8000, 0x8600, 0x9800, 0xe000, 0x0], // 7
	[0x6c00, 0x9200, 0x9200, 0x9200, 0x6c00, 0x0], // 8
	[0x6000, 0x9000, 0x9200, 0x9400, 0x7800, 0x0], // 9
];

const signModels = [
	{ name: '8"', width: 17.067, height: 8.4, ledDiameter: 0.157, margin: 0.2, stride: 0.667, ledsX: 26, ledsY: 13 },
	{ name: '10"', width: 21.1, height: 10.4, ledDiameter: 0.157, margin: 0.2, stride: 0.667, ledsX: 32, ledsY: 16 },
	{ name: '12"', width: 25.1, height: 12.4, ledDiameter: 0.188, margin: 0.2, stride: 0.8, ledsX: 32, ledsY: 16 },
	{ name: '14"', width: 29.1, height: 14.4, ledDiameter: 0.13, margin: 0.2, stride: 0.9333, ledsX: 32, ledsY: 16 },
];

//vars:
const camera = {
	x: 0,
	y: 0,
	zoom: 10,
};

let bloomFactor = 0;
let selectedIndex = 0;
let selectedModel = signModels[selectedIndex];
var displaybuffer = getBlankScreen();

//ui wiring:
bloomSlider.addEventListener("input", (e) => {
	bloomFactor = parseInt(e.target.value);
	updateSelectedObject(signSelect.selectedIndex);
});
signSelect.addEventListener("change", () => updateSelectedObject(signSelect.selectedIndex));

function updateSelectedObject(index) {
	selectedIndex = Math.max(0, index);
	selectedModel = signModels[selectedIndex];
	updateMeasurementInputs();
	update();
}

function updateMeasurementInputs() {
	// Clear existing inputs
	measurementsDiv.innerHTML = "";

	// Create text boxes for each property of the selected model
	Object.keys(selectedModel).forEach((key) => {
		if (key !== "name") {
			const inputWrapper = document.createElement("div");
			const label = document.createElement("label");
			label.textContent = `${key}: `;
			label.classList.add("subheading");
			const input = document.createElement("input");

			// Set input type and initial value
			input.type = "number";
			input.value = selectedModel[key];
			input.classList.add("subheading");

			// Ensure integer input for ledsX and ledsY
			if (key === "ledsX" || key === "ledsY") {
				input.step = "1"; // Enforce integer step
				input.addEventListener("input", (e) => {
					const value = parseInt(e.target.value, 10);
					if (!isNaN(value)) {
						selectedModel[key] = value;
						update();
					}
				});
			} else {
				input.step = "0.01"; // Default step for other numeric inputs
				input.addEventListener("input", (e) => {
					const value = parseFloat(e.target.value);
					if (!isNaN(value)) {
						selectedModel[key] = value;
						update();
					}
				});
			}

			inputWrapper.appendChild(label);
			inputWrapper.appendChild(input);
			measurementsDiv.appendChild(inputWrapper);
		}
	});
}

function fitObjectOnScreen(objectWidthInInches, objectHeightInInches, camera) {
	const zoomX = canvas.width / objectWidthInInches;
	const zoomY = canvas.height / objectHeightInInches;
	camera.zoom = Math.min(zoomX, zoomY);
}

function update() {
	fitObjectOnScreen(selectedModel.width, selectedModel.height, camera);
	draw(ctx, camera);
}

function draw(ctx, camera) {
	const topLeft = { x: -selectedModel.width / 2, y: -selectedModel.height / 2 };
	const topLeftPixels = worldToCanvas(topLeft.x, topLeft.y, camera);
	const boardWidthPixels = selectedModel.width * camera.zoom;
	const boardHeightPixels = selectedModel.height * camera.zoom;
	const ledRadiusPixels = (selectedModel.ledDiameter / 2) * camera.zoom;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "white";

	ctx.fillStyle = "#181818";
	ctx.fillRect(topLeftPixels.x, topLeftPixels.y, boardWidthPixels, boardHeightPixels);

	const ledOnColor = "#FFB343";
	const ledOffColor = "#101010";
	const bloom = `#FFBF00${bloomFactor.toString().padStart(2, "0")}`;

	for (let column = selectedModel.ledsX - 1; column >= 0; column--) {
		const bits = getBits(displaybuffer[column]);
		//traverse the column from bottom to top
		for (let row = selectedModel.ledsY - 1; row >= 0; row--) {
			//draw each LED
			const pos = worldToCanvas(topLeft.x + selectedModel.margin + column * selectedModel.stride, topLeft.y + selectedModel.margin + row * selectedModel.stride, camera);
			const ledOn = bits[selectedModel.ledsY - 1 - row] == 1;
			ctx.fillStyle = ledOn ? ledOnColor : ledOffColor;
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, ledRadiusPixels, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			//index++;
		}
	}

	//second pass: add bloom effect
	for (let column = selectedModel.ledsX - 1; column >= 0; column--) {
		const bits = getBits(displaybuffer[column]);
		//traverse the column from bottom to top
		for (let row = selectedModel.ledsY - 1; row >= 0; row--) {
			//draw each LED
			const pos = worldToCanvas(topLeft.x + selectedModel.margin + column * selectedModel.stride, topLeft.y + selectedModel.margin + row * selectedModel.stride, camera);
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
}

function worldToCanvas(worldX, worldY, camera) {
	const canvasX = (worldX - camera.x) * camera.zoom + canvas.width / 2;
	const canvasY = (worldY - camera.y) * camera.zoom + canvas.height / 2;
	return { x: canvasX, y: canvasY };
}

// Populate the select element with options
signModels.forEach((model, index) => {
	const option = document.createElement("option");
	option.value = index;
	option.textContent = model.name;
	signSelect.appendChild(option);
});

function getBlankScreen() {
	return [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];
}

function convertImageToDataOld(imgElement, numberWidth = 8, glyphWidth = 6) {
	let output = "";
	const map = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	// Create a temporary canvas to recover pixel information
	const tempCanvas = document.createElement("canvas");
	tempCanvas.width = imgElement.width;
	tempCanvas.height = imgElement.height;
	const tempCtx = tempCanvas.getContext("2d");

	// Draw the image onto the canvas
	tempCtx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

	// Get the pixel data
	const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
	const pixels = imageData.data;

	// Go through the whole image processing columns from top to bottom
	let mapIndex = 0;
	let columns = [];
	let currentWidth = numberWidth; // Start with number glyphs
	let currentHeight = imgElement.height;

	for (let x = 0; x < imgElement.width; x++) {
		// Adjust `currentWidth` based on mapIndex to switch from number glyphs to smaller glyphs
		if (mapIndex >= 10) {
			currentWidth = glyphWidth;
			currentHeight = 7;
		}

		// Process a column of pixels
		let columnData = 0;
		for (let y = 0; y < currentHeight; y++) {
			const currentPixel = pixels[(imgElement.width * y + x) * 4]; // Each pixel has 4 color values (RGBA)

			// If the pixel's red channel is black, set the corresponding bit in the data for this column
			if (currentPixel < 128) {
				columnData |= 1 << (currentHeight - 1 - y);
			}
		}
		columns.push(`0x${columnData.toString(16)}`);

		// Check if we've collected enough columns for the current glyph
		if (columns.length === currentWidth) {
			output += `[${columns.join(", ")}], // ${map[mapIndex]}\n`;
			columns = []; // Reset columns for the next glyph
			mapIndex += 1; // Move to the next glyph in the map
		}
	}

	resultsDiv.innerText = output;
}

function convertImageToData(imgElement) {
	let output = "";

	// Create a temporary canvas to recover pixel information
	const tempCanvas = document.createElement("canvas");
	tempCanvas.width = imgElement.width;
	tempCanvas.height = imgElement.height;
	const tempCtx = tempCanvas.getContext("2d");

	// Draw the image onto the canvas
	tempCtx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

	// Get the pixel data
	const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
	const pixels = imageData.data;

	let columns = [];
	let glyphIndex = 0;
	let columnData;

	for (let x = 0; x < imgElement.width; x++) {
		columnData = 0;

		// Check the first pixel in the column to detect a red separator
		const offset = (imgElement.width * 0 + x) * 4;
		const r = pixels[offset];
		const g = pixels[offset + 1];
		const b = pixels[offset + 2];

		if (r > 128 && g < 128 && b < 128) {
			// Red separator detected, process the current glyph
			if (columns.length > 0) {
				output += `[${columns.join(", ")}], // ${glyphIndex}\n`;
				columns = [];
				glyphIndex++;
			}
		} else {
			// Process this column as part of the current glyph
			for (let y = 0; y < imgElement.height; y++) {
				const pixelOffset = (imgElement.width * y + x) * 4;
				const red = pixels[pixelOffset];
				const green = pixels[pixelOffset + 1];
				const blue = pixels[pixelOffset + 2];

				if (red < 128 && green < 128 && blue < 128) {
					// Black pixel detected, set the corresponding bit
					columnData |= 1 << (imgElement.height - 1 - y);
				}
			}
			columns.push(`0x${columnData.toString(16)}`);
		}
	}

	// Push the final glyph data if any columns remain
	if (columns.length > 0) {
		output += `[${columns.join(", ")}], // ${glyphIndex}\n`;
	}

	resultsDiv.innerText = output;
}

function getBits(columnData) {
	const bits = [];
	for (let i = 0; i < 16; i++) {
		bits.push((columnData & (1 << i)) === 0 ? 0 : 1);
	}
	return bits;
}

function isBitSet(number, position) {
	return (number & (1 << position)) !== 0;
}

function setBit(number, position) {
	return number | (1 << position);
}

function drawMessage(message, columns = 32, rows = 16) {
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	//split message into words.
	var words = message.toUpperCase().split(" ");

	displaybuffer = getBlankScreen();

	//truncate words to 2 maximum
	if (words.length >= 2) {
		words = words.slice(0, 2);
	}

	var currentY = words.length > 1 ? 0 : Math.floor(rows / 2 - 7 / 2);

	words.reverse().forEach((word) => {
		//truncate each word to 5 letters
		if (word.length > 5) {
			word = word.slice(0, 5);
		}

		//center words horizontally //6 = glyphwidth
		var currentX = columns / 2 - (word.length * 6) / 2;

		for (const letter of word) {
			const glyphIndex = map.indexOf(letter);
			if (glyphIndex >= 0) {
				for (let x = 0; x < 6; x++) {
					let columnData = glyphs[glyphIndex][x];
					const displayColumnIndex = currentX + x;
					for (let y = 0; y < 7; y++) {
						//there is a problem here with checking isbitset

						if (isBitSet(columnData, y + 9)) {
							displaybuffer[displayColumnIndex] = setBit(displaybuffer[currentX + x], currentY + y);
						}
					}
				}

				currentX += 6;
			}
		}
		currentY += 9;
	});

	draw(ctx, camera);
}

function drawNumber(number, numberWidth = 8) {
	displaybuffer = getBlankScreen();

	//get each digit from the number
	const num = Math.max(0, Math.min(number, 999));
	var stringDigits = num.toString().split("");
	var digits = stringDigits.map(Number);

	var currentX = stringDigits.length === 3 ? 2 : stringDigits.length === 2 ? 6 : 12;

	for (const digit of digits) {
		for (let x = 0; x < numberWidth; x++) {
			displaybuffer[currentX + x] = numbers[digit][x];
		}
		currentX += stringDigits.length === 2 ? 12 : 10;
	}

	draw(ctx, camera);
}

//convert image to data once it loads
image.addEventListener("load", (e) => {
	convertImageToData(image);
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

	//draw leds
	//drawScreen(getBlankScreen(), canvas, ctx);
	drawNumber(slider.value);

	// Initialize
	signSelect.selectedIndex = 2;
	updateSelectedObject(2);
});

var displaybuffer = getBlankScreen();
