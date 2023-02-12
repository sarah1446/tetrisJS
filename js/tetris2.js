// DOM
const playground = document.querySelector('.playground > ul');

// Setting
const GAME_ROW = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
	tree: [
		[[2,1], [0,1], [1,0], [1,1]],
		[],
		[],
		[],
	]
}

const movingItem = {
	type: 'tree',
	direction: 0,
	top: 0,
	left: 0,
}

init();

function init() {
	// Missing
	tempMovingItem = {...movingItem}
	
	for(let i=0; i < GAME_ROW; i++){
		prependNewLine();
	}
	// Missing
	renderBlocks();
}

function prependNewLine() {
	const li = document.createElement('li');
	const ul = document.createElement('ul');
	
	for(let j=0; j < GAME_COLS; j++) {
		const matrix = document.createElement('li');
		ul.prepend(matrix);
	}
	
	li.prepend(ul);
	playground.prepend(li);
}

function renderBlocks() {
	//
	const {type, direction, top, left} = tempMovingItem;
	
	BLOCKS[type][direction].forEach(block => {
		const x = block[0] + left;
		const y = block[1] + top;
		
		//
		const target = playground.childNodes[y].childNodes[0].childNodes[x];
		target.classList.add(type);
	})
	
}

function movingBlock(moveType, amount) {
	tempMovingItem[moveType] += amount;
	renderBlocks();
}

document.addEventListener('keydown', e => {
	switch(e.keyCode) {
		case 39:
			movingBlock('left', 1)
			break;
		case 37:
			movingBlock('left', -1)
			break;
		case 40:
			movingBlock('top', 1)
			break;
		default:
			break;
	}
})