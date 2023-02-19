// import { BLOCKS } from './blocks';

const BLOCKS = {
	tree : [
		[[0, 1], [2, 1], [1, 0], [1, 1]],
		[[2, 1], [1, 0], [1, 1], [1, 2]],
		[[2, 1], [0, 1], [1, 1], [1, 2]],
		[[0, 1], [1, 2], [1, 1], [1, 0]]
	],
	square : [
		[[0,0], [0,1], [1, 0], [1, 1]],
		[[0,0], [0,1], [1, 0], [1, 1]],
		[[0,0], [0,1], [1, 0], [1, 1]],
		[[0,0], [0,1], [1, 0], [1, 1]]
	],
	bar : [
		[[0, 0], [1, 0], [2, 0], [3, 0]],
		[[2, 2], [2, 0], [2, 1], [2, 3]],
		[[0, 0], [1, 0], [2, 0], [3, 0]],
		[[2, 2], [2, 0], [2, 1], [2, 3]]
	],
	zee : [
		[[0, 0], [1, 0], [1, 1], [2, 1]],
		[[0, 1], [1, 0], [1, 1], [0, 2]],
		[[0, 1], [1, 1], [1, 2], [2, 2]],
		[[2, 0], [2, 1], [1, 1], [1, 2]]
	],
	elLeft : [
		[[0, 0], [1, 0], [2, 0], [0, 1]],
		[[1, 0], [1, 1], [1, 2], [0, 0]],
		[[2, 0], [0, 1], [1, 1], [2, 1]],
		[[0, 0], [0, 1], [0, 2], [1, 2]]
	],
	elRight : [
		[[0, 0], [1, 0], [2, 0], [2, 1]],
		[[2, 0], [2, 1], [2, 2], [1, 2]],
		[[0, 0], [0, 1], [1, 1], [2, 1]],
		[[1, 0], [2, 0], [1, 1], [1, 2]]
	]
};


// DOM
const playground = document.querySelector('.playground > ul');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');
const restartButton = document.querySelector('.game-text > button')

// Setting
const GAME_ROW = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500; // 떨어지는 속도
let downInterval;
let tempMovingItem; // movingItem 임시로 저장하는 


const movingItem = {
    type: '',
    direction: 0, // 블럭 방향 돌리는 지표
    top: 0, // 좌표기준으로 어디까지 내려왔늕지 내려와야하는지
    left: 0,

} // 다음 블럭에 대한 정보

init();

// functions
function init(){
    // tempMovingItem = {...movingItem}
	score = 0;
	scoreDisplay.innerText = score;

    for(let i = 0; i < GAME_ROW; i++) {
        prependNewLine();
    }
	generateNewBlock();
}

function prependNewLine() {
    const li = document.createElement('li');
    const ul = document.createElement('ul')  ;

    for(let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix)
    }

    li.prepend(ul);
    playground.prepend(li);
}

//moveBlock인 경우에만 moveType보내고 render같은경우에는 moveType없으므로 초기화
function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
	
	// TODO movingblock 클래스 지우기
	const movingBlocks = document.querySelectorAll(".moving");

	// 새로 움직인 블럭 색칠하기 전에 기존 컬러값들 뺴기
	movingBlocks.forEach((moving => {
		moving.classList.remove(type, "moving");
	}))

	// 방금 움직인 코드의 블럭 색 입히기
	BLOCKS[type][direction].some(block => {
		const x = block[0] + left;
		const y = block[1] + top;
		const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
		
		// 다시 target을 체크하는 이유 -> 빈 여백체크해서 벗어나지 않도록 + 블럭이 맨 하단으로 떨어졌을때, 또 다른 블럭이 생성이 되고 생성된 블럭이 기존 블럭위에 떨어졌을때 기존 블럭 있는지 없는지 체크
		const isAvailable = checkEmpty(target);
		if(isAvailable) { // 빈공간 있으면 계속 실행
			target.classList.add(type, "moving") // moving 클래스는 현재 위치에서만 색깔 표시하려고
		} else { // 빈공간 없으면 그대로 유지
			// tempMovingItem으로 좌표를 움직이는데 false면 변경시키지 않았던 movingItem으로 원래대로 돌려놓음
			tempMovingItem = {...movingItem};
			
			if(moveType === 'retry') {
				clearInterval(downInterval);
				showGameoverText();
				return true;
			}
			setTimeout(() => {  // setTimeout은 이벤트루프가 끝나고나서 큐에서 코드꺼내와 스택에다 넣기떄문에 스택 넘치는거 예방
				renderBlocks('retry') //retry넘겼는데 또다시renderBlock이면 그건 마지막 !!이란 뜻
				
				if(moveType === 'top') {
					seizeBlocks();
				}
			}, 0)
			return true; //forEach는 return한다고해서 멈추지 않기때문에 some으로해서 중간에 원할떄 멈출수있음(else문, 빈값이 있으면 return true해서 나머지...?? 45분
		}
	})
	// 블록을 성공적으로 랜더링했을 시 movingItem에 현재 블록의 상태를 저장
	movingItem.direction = direction;
	movingItem.top = top;
	movingItem.left = left;
}

function seizeBlocks() {
	const movingBlocks = document.querySelectorAll(".moving");
	
	movingBlocks.forEach((moving => {
		moving.classList.remove( "moving");
		moving.classList.add( "seized");
	}));
	
	checkMatch();
}
function checkMatch() {
	const childNodes = playground.childNodes;
	
	childNodes.forEach(child => {
		let matched = true;
		
		child.children[0].childNodes.forEach(li => {
			if(!li.classList.contains("seized")) { // 한줄에 전부 seized로 채워지지 않는경우
				matched = false;
			}
		})
		if(matched) {
			child.remove(); // 한줄 전부 seized면 삭제
			prependNewLine(); // seized로 채워진 코드가 삭제되고 맨위에 한줄이 추가됨(삭제효과)
			score++;
			scoreDisplay.innerHTML = score;
		}
	})
	
	generateNewBlock();
}
function generateNewBlock() {
	clearInterval(downInterval); // 혹시 진행중인걸 스탑
	
	downInterval = setInterval(() => {
		moveBlock('top', 1)
	}, duration)
	
	const blockArray = Object.entries(BLOCKS);
	const randomIndex = Math.floor(Math.random() * blockArray.length)
	
	movingItem.type = blockArray[randomIndex][0]
	movingItem.top = 0;
	movingItem.left = 3;
	movingItem.direction = 0;
	tempMovingItem = {...movingItem};
	
	renderBlocks();
}

// 블록이 이동하려고 하는 격자가 없거나 격자에 이미 블록이 존재하는 지 확인
function checkEmpty(target){
	if(!target || target.classList.contains('seized')) { // 여백만 체크하는게 아니라 seized가 있으면 빈값이 아닌걸로 false를 넣어줘서 !available
		return false;
	}
	return true;
}

function moveBlock(moveType, amount) {
	// tempMoving을 통해 렌더링하니까 이 값을 바꿔줘야함
	tempMovingItem[moveType] += amount;
	renderBlocks(moveType);
}

function changeDirection() {
	const direction = tempMovingItem.direction;
	direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
	
	renderBlocks();
}

function dropBlock() {
	clearInterval(downInterval);
	downInterval = setInterval(() => {
		moveBlock('top', 1)
	}, 10)
}
function showGameoverText() {
	gameText.style.display = 'flex'
}
// event handling
document.addEventListener('keydown', e => {
	switch(e.keyCode) {
		case 39:
			moveBlock('left', 1);
			break;
		case 37:
			moveBlock('left', -1);
			break;
		case 40:
			moveBlock('top', 1);
			break;
		case 38:
			changeDirection();
			break;
		case 32:
			dropBlock();
			break;
		default:
			break;
	
	}
});
restartButton.addEventListener('click', () => {
	playground.innerHTML = '';
	gameText.style.display = 'none';
	
	init();
});
 