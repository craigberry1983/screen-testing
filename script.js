const image = document.getElementById("source");
const txtMessage = document.getElementById("txtMessage");

const canvas10 = document.getElementById("canvas-10");
const resultsDiv = document.getElementById("results");

const slider = document.getElementById("speedSlider");
const sliderLabel = document.getElementById("sliderLabel");

const ctx10 = canvas10.getContext("2d");

const spacing10 = 3;
const columns10 = 32;
const rows10 = 16;
const padding = 1;

//data objects:
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

function drawScreen(displayBuffer, canvas, context, ledsX, ledsY, spacing) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	let index = 0;

	for (let column = ledsX - 1; column >= 0; column--) {
		const bits = getBits(displayBuffer[column]);
		//traverse the column from bottom to top
		for (let row = ledsY - 1; row >= 0; row--) {
			context.fillStyle = bits[ledsY - 1 - row] == 1 ? "#FFB343" : "#101010";
			context.fillRect(padding + column * spacing, padding + row * spacing, 1, 1);
			index++;
		}
	}
}

function drawMessage(message, columns = 32, rows = 16) {
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	//split message into words.
	var words = message.toUpperCase().split(" ");

	var displaybuffer = getBlankScreen();

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

	drawScreen(displaybuffer, canvas10, ctx10, columns10, rows10, spacing10);
}

function drawNumber(number, columns = 32, rows = 16, numberWidth = 8) {
	var displaybuffer = getBlankScreen();

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

	drawScreen(displaybuffer, canvas10, ctx10, columns10, rows10, spacing10);
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

	canvas10.width = padding / 2 + columns10 * spacing10;
	canvas10.height = padding / 2 + rows10 * spacing10;

	//draw leds
	drawScreen(getBlankScreen(), canvas10, ctx10, 32, 16, spacing10);
	drawNumber(slider.value);
});
