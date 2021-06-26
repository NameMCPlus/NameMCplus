function textureUrl(hash) {
	return 'https://texture.namemc.com/' + hash[0] + hash[1] + '/' + hash[2] + hash[3] + '/' + hash + '.png';
}

function toCanvas(image, x, y, w, h) {
	x = (typeof x === 'undefined' ? 0 : x);
	y = (typeof y === 'undefined' ? 0 : y);
	w = (typeof w === 'undefined' ? image.width : w);
	h = (typeof h === 'undefined' ? image.height : h);
	let canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	let ctx = canvas.getContext('2d');
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
	return canvas;
}

function makeOpaque(image) {
	let canvas = toCanvas(image);
	let ctx = canvas.getContext('2d');
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let pixels = data.data;
	for (let p = 3; p < pixels.length; p += 4) {
		pixels[p] = 255;
	}
	ctx.putImageData(data, 0, 0);
	return canvas;
}

function hasAlphaLayer(image) {
	let canvas = toCanvas(image);
	let ctx = canvas.getContext('2d');
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let pixels = data.data;
	for (let p = 3; p < pixels.length; p += 4) {
		if (pixels[p] !== 255) {
			return true;
		}
	}
	return false;
}

function capeScale(height) {
	if (height % 22 === 0) {
		return height / 22;
	} else if (height % 17 === 0) {
		return height / 17;
	} else if (height >= 32 && (height & (height - 1)) === 0) {
		return height / 32;
	} else {
		return Math.max(1, Math.floor(height / 22));
	}
}

function drawSkin2D() {
	$('canvas.skin-2d').each(function(i, e) {
		let url = textureUrl(e.getAttribute('data-skin-hash'));
		let flip = e.getAttribute('data-flip') === 'true';
		let image = new Image();
		image.crossOrigin = '';
		image.src = url;
		image.onload = function() {
			let opaque = makeOpaque(image);
			let ctx = e.getContext('2d');
			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.msImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;
			if (flip) {
				ctx.translate(e.width, e.height);
				ctx.scale(-1, -1);
			}
			ctx.drawImage(opaque, 8, 8, 8, 8, 0, 0, e.width, e.height);
			if (hasAlphaLayer(image)) {
				ctx.drawImage(image, 40, 8, 8, 8, 0, 0, e.width, e.height);
			}
		};
		image.onerror = function() {
			console.error('Error loading ' + image.src);
		};
	});
	$('canvas.cape-2d').each(function(i, e) {
		let url = textureUrl(e.getAttribute('data-cape-hash'));
		let flip = e.getAttribute('data-flip') === 'true';
		let image = new Image();
		image.crossOrigin = '';
		image.src = url;
		image.onload = function() {
			let cs = image ? capeScale(image.height) : null;
			let opaque = makeOpaque(image);
			let ctx = e.getContext('2d');
			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.msImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;
			if (flip) {
				ctx.translate(e.width, e.height);
				ctx.scale(-1, -1);
			}
			ctx.drawImage(opaque, cs, cs, 10 * cs, 16 * cs, 0, 0, e.width, e.height);
		};
		image.onerror = function() {
			console.error('Error loading ' + image.src);
		};
	});
}

function colorFaces(geometry, canvas, rectangles) {
	if (!rectangles) return null;
	let pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
	let f = 0;
	let faces = [];
	let materials = [];
	let materialIndexMap = {};
	let side = THREE.FrontSide;
	Object.keys(rectangles).forEach(function(k) {
		let rect = rectangles[k];
		let width = Math.abs(rect.w);
		let height = Math.abs(rect.h);
		let dj = Math.sign(rect.w);
		let di = Math.sign(rect.h);
		for (let y = 0, i = rect.y; y < height; y++, i += di) {
			for (let x = 0, j = rect.x; x < width; x++, j += dj, f += 2) {
				let p = 4 * (i * canvas.width + j);
				let a = pixels[p + 3];
				if (a === 0) {
					side = THREE.DoubleSide;
					continue;
				}
				let materialIndex = materialIndexMap[a];
				if (typeof materialIndex === 'undefined') {
					materials.push(new THREE.MeshLambertMaterial({
						vertexColors: THREE.FaceColors,
						opacity: a / 255,
						transparent: (a !== 255)
					}));
					materialIndex = materials.length - 1;
					materialIndexMap[a] = materialIndex;
					if (a !== 255) {
						side = THREE.DoubleSide;
					}
				}
				let face1 = geometry.faces[f];
				let face2 = geometry.faces[f + 1];
				face1.color.r = pixels[p] / 255;
				face1.color.g = pixels[p + 1] / 255;
				face1.color.b = pixels[p + 2] / 255;
				face2.color = face1.color;
				face1.materialIndex = materialIndex;
				face2.materialIndex = materialIndex;
				faces.push(face1);
				faces.push(face2);
			}
		}
	});
	if (faces.length === 0) return null;
	geometry.faces = faces;
	materials.forEach(function(m) {
		m.side = side;
	});
	return new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), materials);
}

function buildMinecraftModel(skinImage, capeImage, slim, flip) {
	if (skinImage.width < 64 || skinImage.height < 32) {
		return null;
	}
	let version = (skinImage.height >= 64 ? 1 : 0);
	let cs = capeImage ? capeScale(capeImage.height) : null;
	let opaqueSkinCanvas = makeOpaque(skinImage);
	let transparentSkinCanvas = toCanvas(skinImage);
	let hasAlpha = hasAlphaLayer(skinImage);
	let headGroup = new THREE.Object3D();
	headGroup.position.x = 0;
	headGroup.position.y = 12;
	headGroup.position.z = 0;
	let box = new THREE.BoxGeometry(8, 8, 8, 8, 8, 8);
	let headMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['head'][0]);
	headGroup.add(headMesh);
	if (hasAlpha) {
		box = new THREE.BoxGeometry(9, 9, 9, 8, 8, 8);
		let hatMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['head'][1]);
		hatMesh && headGroup.add(hatMesh);
	}
	let torsoGroup = new THREE.Object3D();
	torsoGroup.position.x = 0;
	torsoGroup.position.y = 2;
	torsoGroup.position.z = 0;
	box = new THREE.BoxGeometry(8 + EPSILON, 12 + EPSILON, 4 + EPSILON, 8, 12, 4);
	let torsoMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['torso'][0]);
	torsoGroup.add(torsoMesh);
	if (version >= 1 && hasAlpha) {
		box = new THREE.BoxGeometry(8.5 + EPSILON, 12.5 + EPSILON, 4.5 + EPSILON, 8, 12, 4);
		let jacketMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['torso'][1]);
		jacketMesh && torsoGroup.add(jacketMesh);
	}
	let rightArmGroup = new THREE.Object3D();
	rightArmGroup.position.x = slim ? -5.5 : -6;
	rightArmGroup.position.y = 6;
	rightArmGroup.position.z = 0;
	let rightArmMesh;
	if (slim) {
		box = new THREE.BoxGeometry(3, 12, 4, 3, 12, 4).translate(0, -4, 0);
		rightArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['armRS'][0]);
	} else {
		box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -4, 0);
		rightArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['armR'][0]);
	}
	rightArmGroup.add(rightArmMesh);
	if (version >= 1 && hasAlpha) {
		let rightSleeveMesh;
		if (slim) {
			box = new THREE.BoxGeometry(3.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 3, 12, 4).translate(0, -4, 0);
			rightSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['armRS'][1]);
		} else {
			box = new THREE.BoxGeometry(4.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 4, 12, 4).translate(0, -4, 0);
			rightSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['armR'][1]);
		}
		rightSleeveMesh && rightArmGroup.add(rightSleeveMesh);
	}
	let leftArmGroup = new THREE.Object3D();
	leftArmGroup.position.x = slim ? 5.5 : 6;
	leftArmGroup.position.y = 6;
	leftArmGroup.position.z = 0;
	let leftArmMesh;
	if (slim) {
		box = new THREE.BoxGeometry(3, 12, 4, 3, 12, 4).translate(0, -4, 0);
		leftArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['armLS'][0]);
	} else {
		box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -4, 0);
		leftArmMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['armL'][0]);
	}
	leftArmGroup.add(leftArmMesh);
	if (version >= 1 && hasAlpha) {
		let leftSleeveMesh;
		if (slim) {
			box = new THREE.BoxGeometry(3.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 3, 12, 4).translate(0, -4, 0);
			leftSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['armLS'][1]);
		} else {
			box = new THREE.BoxGeometry(4.5 + EPSILON * 4, 12.5 + EPSILON * 4, 4.5 + EPSILON * 4, 4, 12, 4).translate(0, -4, 0);
			leftSleeveMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['armL'][1]);
		}
		leftSleeveMesh && leftArmGroup.add(leftSleeveMesh);
	}
	let rightLegGroup = new THREE.Object3D();
	rightLegGroup.position.x = -2;
	rightLegGroup.position.y = -4;
	rightLegGroup.position.z = 0;
	box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0);
	let rightLegMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['legR'][0]);
	rightLegGroup.add(rightLegMesh);
	if (version >= 1 && hasAlpha) {
		box = new THREE.BoxGeometry(4.5 + EPSILON * 2, 12.5 + EPSILON * 2, 4.5 + EPSILON * 2, 4, 12, 4).translate(0, -6, 0);
		let rightPantMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['legR'][1]);
		rightPantMesh && rightLegGroup.add(rightPantMesh);
	}
	let leftLegGroup = new THREE.Object3D();
	leftLegGroup.position.x = 2;
	leftLegGroup.position.y = -4;
	leftLegGroup.position.z = 0;
	box = new THREE.BoxGeometry(4, 12, 4, 4, 12, 4).translate(0, -6, 0);
	let leftLegMesh = colorFaces(box, opaqueSkinCanvas, skinLayout[version]['legL'][0]);
	leftLegGroup.add(leftLegMesh);
	if (version >= 1 && hasAlpha) {
		box = new THREE.BoxGeometry(4.5 + EPSILON * 3, 12.5 + EPSILON * 3, 4.5 + EPSILON * 3, 4, 12, 4).translate(0, -6, 0);
		let leftPantMesh = colorFaces(box, transparentSkinCanvas, skinLayout[version]['legL'][1]);
		leftPantMesh && leftLegGroup.add(leftPantMesh);
	}
	let playerGroup = new THREE.Object3D();
	playerGroup.add(headGroup);
	playerGroup.add(torsoGroup);
	playerGroup.add(rightArmGroup);
	playerGroup.add(leftArmGroup);
	playerGroup.add(rightLegGroup);
	playerGroup.add(leftLegGroup);
	if (capeImage) {
		let capeCanvas = makeOpaque(capeImage);
		let capeGroup = new THREE.Object3D();
		capeGroup.position.x = 0;
		capeGroup.position.y = 8;
		capeGroup.position.z = -2;
		capeGroup.rotation.y += radians(180);
		let capeMesh;
		box = new THREE.BoxGeometry(10, 16, 1, 10 * cs, 16 * cs, cs).translate(0, -8, 0.5);
		capeMesh = colorFaces(box, capeCanvas, {
			left: {
				x: 11 * cs,
				y: cs,
				w: cs,
				h: 16 * cs
			},
			right: {
				x: 0,
				y: cs,
				w: cs,
				h: 16 * cs
			},
			top: {
				x: cs,
				y: 0,
				w: 10 * cs,
				h: cs
			},
			bottom: {
				x: 11 * cs,
				y: cs - 1,
				w: 10 * cs,
				h: -cs
			},
			front: {
				x: cs,
				y: cs,
				w: 10 * cs,
				h: 16 * cs
			},
			back: {
				x: 12 * cs,
				y: cs,
				w: 10 * cs,
				h: 16 * cs
			}
		});
		capeGroup.add(capeMesh);
		playerGroup.add(capeGroup);
	}
	if (flip) {
		playerGroup.rotation.z += radians(180);
	}
	return playerGroup;
}
