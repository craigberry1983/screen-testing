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
	/*{ name: '8"', width: 17.067, height: 8.4, ledDiameter: 0.157, margin: 0.2, stride: 0.667, ledsX: 26, ledsY: 13 },*/
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

function convertImageToData(imgElement, numberWidth = 8, glyphWidth = 6) {
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

	var currentX = stringDigits.length === 3 ? 2 : stringDigits.length === 2 ? 7 : 12;

	for (const digit of digits) {
		for (let x = 0; x < numberWidth; x++) {
			displaybuffer[currentX + x] = numbers[digit][x];
		}
		currentX += 10;
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
	updateSelectedObject(0);
	update();
});

var displaybuffer = getBlankScreen();
