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
const smallFontOffsets = [10, 5, 10, 9, 11, 9, 10, 9, 10, 9]; //8"
const mediumFontOffsets = [11, 6, 11, 10, 12, 10, 11, 11, 11, 10]; //10", 12", 14"
const largeFontOffsets = [26, 12, 24, 23, 26, 23, 23, 23, 24, 24]; //18"

const smallFontNumbers = [
	[0x1f0, 0x3f8, 0x60c, 0x404, 0x404, 0x60c, 0x3f8, 0x1f0], // 0
	[0x200, 0x7fc, 0x7fc], // 1
	[0x20c, 0x63c, 0x474, 0x464, 0x4e4, 0x4e4, 0x3c4, 0x384], // 2
	[0x618, 0x61c, 0x40c, 0x48c, 0x48c, 0x7f8, 0x378], // 3
	[0x30, 0x70, 0xd0, 0x190, 0x310, 0x7fc, 0x7fc, 0x10, 0x10], // 4
	[0x70c, 0x704, 0x504, 0x504, 0x58c, 0x4f8, 0x70], // 5
	[0xf0, 0x1f8, 0x344, 0x244, 0x444, 0x444, 0x7c, 0x38], // 6
	[0x400, 0x400, 0x400, 0x43c, 0x4fc, 0x7c0, 0x600], // 7
	[0x370, 0x7f8, 0x4cc, 0x484, 0x484, 0x4cc, 0x7f8, 0x370], // 8
	[0x380, 0x7c0, 0x444, 0x44c, 0x478, 0x3f0, 0x1e0], // 9
];

const mediumFontNumbers = [
	[0x7c0, 0x1ff0, 0x3838, 0x3018, 0x3018, 0x3018, 0x3838, 0x1ff0, 0x7c0], // 0
	[0x1800, 0x3ff8, 0x3ff8], // 1
	[0x1838, 0x1878, 0x30f8, 0x31d8, 0x3198, 0x3198, 0x3318, 0x1f18, 0xe18], // 2
	[0x1830, 0x1830, 0x3018, 0x3018, 0x3318, 0x3318, 0x1ff8, 0x1cf0], // 3
	[0xe0, 0x1e0, 0x3e0, 0x760, 0xe60, 0x1c60, 0x3860, 0x3ff8, 0x3ff8, 0x60], // 4
	[0x3e30, 0x3e18, 0x3618, 0x3618, 0x3618, 0x3738, 0x33f0, 0x1e0], // 5
	[0x3e0, 0xff0, 0x1fb8, 0x1b18, 0x3318, 0x3318, 0x33b8, 0x1f0, 0xe0], // 6
	[0x3000, 0x3000, 0x3000, 0x3078, 0x33f8, 0x3780, 0x3e00, 0x3c00, 0x3800], // 7
	[0xce0, 0x1ff0, 0x3ff8, 0x3318, 0x3318, 0x3318, 0x3ff8, 0x1ff0, 0xce0], // 8
	[0x1e00, 0x1e00, 0x3318, 0x3318, 0x3330, 0x33f0, 0x1fe0, 0xf80], // 9
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

const smallGlyphs = [
	[0x1f, 0x28, 0x28, 0x28, 0x1f, 0x0], // 0
	[0x3f, 0x29, 0x29, 0x29, 0x16, 0x0], // 1
	[0x1e, 0x21, 0x21, 0x21, 0x12, 0x0], // 2
	[0x3f, 0x21, 0x21, 0x21, 0x1e, 0x0], // 3
	[0x3f, 0x29, 0x29, 0x29, 0x21, 0x0], // 4
	[0x3f, 0x28, 0x28, 0x28, 0x20, 0x0], // 5
	[0x1e, 0x21, 0x29, 0x29, 0xf, 0x0], // 6
	[0x3f, 0x8, 0x8, 0x8, 0x3f, 0x0], // 7
	[0x21, 0x21, 0x3f, 0x21, 0x21, 0x0], // 8
	[0x2, 0x1, 0x1, 0x1, 0x3e, 0x0], // 9
	[0x3f, 0x8, 0x4, 0x12, 0x21, 0x0], // A
	[0x3f, 0x1, 0x1, 0x1, 0x1, 0x0], // B
	[0x3f, 0x10, 0x0, 0x10, 0x3f, 0x0], // C
	[0x3f, 0x0, 0x8, 0x4, 0x3f, 0x0], // D
	[0x1e, 0x21, 0x21, 0x21, 0x1e, 0x0], // E
	[0x3f, 0x28, 0x28, 0x28, 0x10, 0x0], // F
	[0x1e, 0x21, 0x25, 0x1e, 0x1, 0x0], // G
	[0x3f, 0x28, 0x2c, 0x2a, 0x11, 0x0], // H
	[0x12, 0x29, 0x29, 0x29, 0x16, 0x0], // I
	[0x20, 0x20, 0x3f, 0x20, 0x20, 0x0], // J
	[0x3e, 0x1, 0x1, 0x1, 0x3e, 0x0], // K
	[0x3c, 0x2, 0x1, 0x2, 0x3c, 0x0], // L
	[0x3f, 0x2, 0x4, 0x2, 0x3f, 0x0], // M
	[0x33, 0x4, 0x8, 0x4, 0x33, 0x0], // N
	[0x30, 0x0, 0xf, 0x0, 0x30, 0x0], // O
	[0x23, 0x25, 0x29, 0x21, 0x31, 0x0], // P
	[0x1e, 0x25, 0x29, 0x21, 0x1e, 0x0], // Q
	[0x1, 0x11, 0x3f, 0x1, 0x1, 0x0], // R
	[0x11, 0x23, 0x25, 0x29, 0x11, 0x0], // S
	[0x12, 0x21, 0x29, 0x29, 0x16, 0x0], // T
	[0xc, 0x14, 0x24, 0x3f, 0x4, 0x0], // U
	[0x1a, 0x29, 0x29, 0x29, 0x26, 0x0], // V
	[0xe, 0x19, 0x29, 0x9, 0x6, 0x0], // W
	[0x20, 0x20, 0x23, 0x2c, 0x30, 0x0], // X
	[0x16, 0x29, 0x29, 0x29, 0x16, 0x0], // Y
	[0x10, 0x28, 0x29, 0x2a, 0x1c, 0x0], // Z
];

const mediumGlyphs = [
	[0x3f, 0x48, 0x48, 0x48, 0x3f, 0x0], // 0
	[0x7f, 0x49, 0x49, 0x49, 0x36, 0x0], // 1
	[0x3e, 0x41, 0x41, 0x41, 0x22, 0x0], // 2
	[0x7f, 0x41, 0x41, 0x41, 0x3e, 0x0], // 3
	[0x7f, 0x49, 0x49, 0x49, 0x41, 0x0], // 4
	[0x7f, 0x48, 0x48, 0x48, 0x40, 0x0], // 5
	[0x3e, 0x41, 0x49, 0x49, 0xf, 0x0], // 6
	[0x7f, 0x8, 0x8, 0x8, 0x7f, 0x0], // 7
	[0x41, 0x41, 0x7f, 0x41, 0x41, 0x0], // 8
	[0x2, 0x1, 0x1, 0x1, 0x7e, 0x0], // 9
	[0x7f, 0x8, 0x14, 0x22, 0x41, 0x0], // A
	[0x7f, 0x1, 0x1, 0x1, 0x1, 0x0], // B
	[0x7f, 0x20, 0x10, 0x20, 0x7f, 0x0], // C
	[0x7f, 0x10, 0x8, 0x4, 0x7f, 0x0], // D
	[0x3e, 0x41, 0x41, 0x41, 0x3e, 0x0], // E
	[0x7f, 0x48, 0x48, 0x48, 0x30, 0x0], // F
	[0x3e, 0x41, 0x45, 0x3e, 0x1, 0x0], // G
	[0x7f, 0x48, 0x4c, 0x4a, 0x31, 0x0], // H
	[0x32, 0x49, 0x49, 0x49, 0x26, 0x0], // I
	[0x40, 0x40, 0x7f, 0x40, 0x40, 0x0], // J
	[0x7e, 0x1, 0x1, 0x1, 0x7e, 0x0], // K
	[0x7c, 0x2, 0x1, 0x2, 0x7c, 0x0], // L
	[0x7f, 0x2, 0x4, 0x2, 0x7f, 0x0], // M
	[0x63, 0x14, 0x8, 0x14, 0x63, 0x0], // N
	[0x60, 0x10, 0xf, 0x10, 0x60, 0x0], // O
	[0x43, 0x45, 0x49, 0x51, 0x61, 0x0], // P
	[0x3e, 0x45, 0x49, 0x51, 0x3e, 0x0], // Q
	[0x11, 0x21, 0x7f, 0x1, 0x1, 0x0], // R
	[0x21, 0x43, 0x45, 0x49, 0x31, 0x0], // S
	[0x22, 0x41, 0x49, 0x49, 0x36, 0x0], // T
	[0x1c, 0x24, 0x44, 0x7f, 0x4, 0x0], // U
	[0x3a, 0x49, 0x49, 0x49, 0x46, 0x0], // V
	[0x1e, 0x29, 0x49, 0x9, 0x6, 0x0], // W
	[0x40, 0x40, 0x43, 0x4c, 0x70, 0x0], // X
	[0x36, 0x49, 0x49, 0x49, 0x36, 0x0], // Y
	[0x30, 0x48, 0x49, 0x4a, 0x3c, 0x0], // Z
];

const signModels = [
	{ name: '8"', width: 17.067, height: 8.4, ledDiameter: 0.157, margin: 0.2, stride: 0.667, ledsX: 26, ledsY: 13 },
	{ name: '10"', width: 21.1, height: 10.4, ledDiameter: 0.157, margin: 0.2, stride: 0.667, ledsX: 32, ledsY: 16 },
	{ name: '12"', width: 25.1, height: 12.4, ledDiameter: 0.188, margin: 0.2, stride: 0.8, ledsX: 32, ledsY: 16 },
	{ name: '14"', width: 29.1, height: 14.4, ledDiameter: 0.13, margin: 0.2, stride: 0.9333, ledsX: 32, ledsY: 16 },
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
	drawNumber(slider.value);
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
	const topLeftPixels = worldToCanvas(topLeft.x, topLeft.y, camera);
	const boardWidthPixels = selectedModel.width * camera.zoom;
	const boardHeightPixels = selectedModel.height * camera.zoom;
	const ledRadiusPixels = (selectedModel.ledDiameter / 2) * camera.zoom;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function convertGlyphImageToData(imgElement, glyphWidth = 6) {
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

	//go through the whole image processing columns from top to bottom
	let mapIndex = 0;
	let columns = [];

	for (let x = 0; x < imgElement.width; x++) {
		//process a column of pixels
		let columnData = 0;
		for (let y = 0; y < imgElement.height; y++) {
			const currentPixel = pixels[(imgElement.width * y + x) * 4]; //each pixel has 4 color values (RGBA)

			//if the pixel's red channel is black, set the corresponding bit in the data for this column
			if (currentPixel < 128) {
				columnData |= 1 << (imgElement.height - 1 - y);
			}
		}
		columns.push(`0x${columnData.toString(16)}`);

		//check if we've collected enough columns for the current glyph
		if (columns.length === glyphWidth) {
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

function drawMessage(message) {
	const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const glyphs = signSelect.selectedIndex == 0 ? smallGlyphs : mediumGlyphs;
	const glyphHeight = signSelect.selectedIndex == 0 ? 6 : 7;
	const maxLetters = signSelect.selectedIndex == 0 ? 4 : 5;
	//split message into words.
	var words = message.toUpperCase().split(" ");

	displaybuffer = getBlankScreen();

	//truncate words to 2 maximum
	if (words.length >= 2) {
		words = words.slice(0, 2);
	}

	var currentY = words.length > 1 ? 0 : Math.floor(selectedModel.ledsY / 2 - 7 / 2);

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
							console.log("bit set");
							displaybuffer[displayColumnIndex] = setBit(displaybuffer[currentX + x], currentY + y);
						}
					}
				}

				currentX += 6;
			}
		}
		currentY += glyphHeight + 1;
	});

	draw(ctx, camera);
}

function drawNumber(number) {
	const numbers = signSelect.selectedIndex == 0 ? smallFontNumbers : mediumFontNumbers;
	const offsets = signSelect.selectedIndex == 0 ? smallFontOffsets : mediumFontOffsets;
	displaybuffer = getBlankScreen();

	//get each digit from the number
	const num = Math.max(0, Math.min(number, 999));
	var stringDigits = num.toString().split("");
	var digits = stringDigits.map(Number);

	//try to center the number with the following hack that shows less 'wobble' than true centering with variable width glyphs
	var currentX = Math.round(selectedModel.ledsX / 2 - offsets[digits[0]] / 2);

	if (digits.length == 2) {
		currentX -= Math.round(offsets[digits[0]] / 2); //
	} else if (digits.length == 3) {
		currentX = 1 + Math.round(selectedModel.ledsX / 2 - (offsets[digits[0]] + offsets[digits[1]] + offsets[digits[2]]) / 2);
	}

	for (const digit of digits) {
		const width = offsets[digit];

		for (let x = 0; x < width; x++) {
			if (currentX + x >= 0) {
				displaybuffer[currentX + x] = numbers[digit][x];
			}
		}
		currentX += width;
	}

	draw(ctx, camera);
}

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
	drawNumber(slider.value);
	signSelect.selectedIndex = 2;
	updateSelectedObject(2);
});

//convert image to data once it loads
image.addEventListener("load", (e) => {
	convertGlyphImageToData(image);
});

var displaybuffer = getBlankScreen();
//vars:
const camera = {
	x: 0,
	y: 0,
	zoom: 0,
};

let bloomFactor = bloomSlider.value;
let selectedModel = signModels[signSelect.selectedIndex];
var displaybuffer = getBlankScreen();
