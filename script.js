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
	[0xff0, 0x3ffc, 0x7ffe, 0xf00f, 0xe007, 0xe007, 0xf00f, 0x7ffe, 0x3ffc, 0xff0], //0
	[0x0, 0x6000, 0xe000, 0xffff, 0xffff, 0xffff, 0xffff, 0x0, 0x0, 0x0], //1
	[0xf, 0x701f, 0xf03f, 0xe07f, 0xe0ff, 0xe1f7, 0xffe7, 0xffc7, 0x7f87, 0x3f07], //2
	[0x301c, 0x701e, 0xf00f, 0xe007, 0xe387, 0xf38f, 0xffff, 0x7ffe, 0x3ffc, 0x1e78], //3
	[0xf8, 0x3f8, 0xff8, 0x3f38, 0xfc38, 0xf038, 0xffff, 0xffff, 0xffff, 0x38], //4
	[0xff9c, 0xff9e, 0xff9f, 0xe70f, 0xe707, 0xe78f, 0xe7ff, 0xe3fe, 0x1fc, 0xf0], //5
	[0x1fc, 0x7fe, 0xfff, 0x3f87, 0x7f03, 0xf703, 0xe787, 0xc3ff, 0x1fe, 0xfc], //6
	[0xe000, 0xe000, 0xe000, 0xe03f, 0xe3ff, 0xffff, 0xffff, 0xffc0, 0xfc00, 0xf000], //7
	[0x3c78, 0x7efe, 0xffff, 0xe3c7, 0xc183, 0xc183, 0xe3c7, 0xffff, 0x7efe, 0x3c78], //8
	[0x3f00, 0x7f80, 0xffc3, 0xe1e7, 0xc0ef, 0xc0fe, 0xe1fc, 0xfff0, 0x7fe0, 0x3f80], //9
];

const glyphs = [
	[0x3f, 0x48, 0x48, 0x48, 0x3f, 0x0], //A
	[0x7f, 0x49, 0x49, 0x49, 0x36, 0x0], //B
	[0x3e, 0x41, 0x41, 0x41, 0x22, 0x0], //C
	[0x7f, 0x41, 0x41, 0x41, 0x3e, 0x0], //D
	[0x7f, 0x49, 0x49, 0x49, 0x41, 0x0], //E
	[0x7f, 0x48, 0x48, 0x48, 0x40, 0x0], //F
	[0x3e, 0x41, 0x49, 0x49, 0xf, 0x0], //G
	[0x7f, 0x8, 0x8, 0x8, 0x7f, 0x0], //H
	[0x41, 0x41, 0x7f, 0x41, 0x41, 0x0], //I
	[0x2, 0x1, 0x1, 0x1, 0x7e, 0x0], //J
	[0x7f, 0x8, 0x14, 0x22, 0x41, 0x0], //K
	[0x7f, 0x1, 0x1, 0x1, 0x1, 0x0], //L
	[0x7f, 0x20, 0x10, 0x20, 0x7f, 0x0], //M
	[0x7f, 0x10, 0x8, 0x4, 0x7f, 0x0], //N
	[0x3e, 0x41, 0x41, 0x41, 0x3e, 0x0], //O
	[0x7f, 0x48, 0x48, 0x48, 0x30, 0x0], //P
	[0x3e, 0x41, 0x45, 0x3e, 0x1, 0x0], //Q
	[0x7f, 0x48, 0x4c, 0x4a, 0x31, 0x0], //R
	[0x32, 0x49, 0x49, 0x49, 0x26, 0x0], //S
	[0x40, 0x40, 0x7f, 0x40, 0x40, 0x0], //T
	[0x7e, 0x1, 0x1, 0x1, 0x7e, 0x0], //U
	[0x7c, 0x2, 0x1, 0x2, 0x7c, 0x0], //V
	[0x7f, 0x2, 0x4, 0x2, 0x7f, 0x0], //W
	[0x63, 0x14, 0x8, 0x14, 0x63, 0x0], //X
	[0x60, 0x10, 0xf, 0x10, 0x60, 0x0], //Y
	[0x43, 0x45, 0x49, 0x51, 0x61, 0x0], //Z
	[0x3e, 0x45, 0x49, 0x51, 0x3e, 0x0], //0
	[0x11, 0x21, 0x7f, 0x1, 0x1, 0x0], //1
	[0x21, 0x43, 0x45, 0x49, 0x31, 0x0], //2
	[0x22, 0x41, 0x49, 0x49, 0x36, 0x0], //3
	[0x1c, 0x24, 0x44, 0x7f, 0x4, 0x0], //4
	[0x3a, 0x49, 0x49, 0x49, 0x46, 0x0], //5
	[0x1e, 0x29, 0x49, 0x9, 0x6, 0x0], //6
	[0x40, 0x40, 0x43, 0x4c, 0x70, 0x0], //7
	[0x36, 0x49, 0x49, 0x49, 0x36, 0x0], //8
	[0x30, 0x48, 0x49, 0x4a, 0x3c, 0x0], //9
];

function getBlankScreen() {
	return [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];
}

function convertImageToData(imgElement) {
	let output = "";
	const map = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	//create a temporary canvas for recovering pixel information
	const tempCanvas = document.createElement("canvas");
	tempCanvas.width = imgElement.width;
	tempCanvas.height = imgElement.height;
	const tempCtx = tempCanvas.getContext("2d");

	//draw the image onto the canvas
	tempCtx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

	//get the pixel data
	const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
	const pixels = imageData.data;

	//process each column from bottom to top
	let currentX = 0;
	let currentMapIndex = 0;

	let result = [];
	while (currentX < imgElement.width) {
		let columnResult = 0;
		let bottom = currentX < 100 ? imgElement.height - 1 : 6;

		for (let y = bottom; y >= 0; y--) {
			const offset = (y * imgElement.width + currentX) * 4; //each pixel has 4 color values (RGBA)
			const p = pixels[offset];

			//if the pixel is black, set the corresponding bit in the result
			if (p < 128) {
				columnResult |= 1 << (bottom - y);
			}
		}
		result.push(`0x${columnResult.toString(16)}`);

		if ((currentX < 100 && result.length == 10) || (currentX >= 100 && result.length == 6)) {
			output += `[${result}], //${map[currentMapIndex]}\n`;
			currentMapIndex++;
			result = [];
		}

		currentX++;
	}
	results.innerText = output;
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

		var currentX = columns / 2 - (word.length * 6) / 2;

		for (const letter of word) {
			const glyphIndex = map.indexOf(letter);
			if (glyphIndex >= 0) {
				for (let x = 0; x < 6; x++) {
					let columnData = glyphs[glyphIndex][x];
					const displayColumnIndex = currentX + x;

					for (let y = 0; y < 7; y++) {
						if (isBitSet(columnData, y)) {
							displaybuffer[displayColumnIndex] = setBit(displaybuffer[displayColumnIndex], currentY + y);
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

function drawNumber(number, columns = 32, rows = 16, numberWidth = 10) {
	var displaybuffer = getBlankScreen();

	//get each digit from the number
	const num = Math.max(0, Math.min(number, 999));
	var stringDigits = num.toString().split("");
	var digits = stringDigits.map(Number);

	var currentX = stringDigits.length === 3 ? 0 : Math.floor(columns / 2 - (numberWidth / 2) * stringDigits.length);

	//ctx.clearRect(0, 0, canvas10.width, canvas10.height);
	for (const digit of digits) {
		var sx = digit * 10;
		for (let x = 0; x < 10; x++) {
			displaybuffer[currentX + x] = numbers[digit][x];
		}

		//ctx.drawImage(image, sx, 0, 10, 16, currentX, 0, 10, 16);

		currentX += 11;
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
