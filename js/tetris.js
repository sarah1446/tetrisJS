// DOM
const playground = document.querySelector('.playground > ul');

// Setting
const GAME_ROW = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500; // 떨어지는 속도
let downInterval;
let tempMovingItem; // movingItem 임시로 저장하는 

const BLOCKS = {
    tree: [
        [[2,1],[0,1],[1,0],[1,1]], // top, left
        [],
        [],
        [],
    ]
}

const movingItem = {
    type: 'tree',
    direction: 0, // 블럭 방향 돌리는 지표
    top: 0, // 좌표기준으로 어디까지 내려왔늕지 내려와야하는지
    left: 0,

} // 다음 블럭에 대한 정보

init();

// functions
function init(){
    tempMovingItem = {...movingItem} 

    for(let i = 0; i < GAME_ROW; i++) {
        prependNewLine();
    }  
    renderBlocks();
}

function prependNewLine() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');

    for(let j = 0; j < G AME_COLS; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix)
    }

    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks() {
    const { type, direction, top, left } = tempMovingItem;
	// TODO movingblock 클래스 지우기
	const movingBlocks = document.querySelectorAll(".moving");

	// 새로 움직인 블럭 색칠하기 전에 기존 컬러값들 뺴기
	movingBlocks.forEach((moving => {
		moving.classList.remove(type, "moving");
	}))

	// 방금 움직인 코드의 블럭 색 입히기
	BLOCKS[type][direction].forEach(block => {
		const x = block[0] + left;
		const y = block[1] + top;
		const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
		
		// 다시 target을 체크하는 이유 -> 빈 여백체크해서 벗어나지 않도록 + 블럭이 맨 하단으로 떨어졌을때, 또다른 블럭이 생성이 되고 생성된 블럭이 기존 블럭위에 떨어졌을때 기존 블럭 있는지 없는지 체크
		const isAvailable = checkEmpty(target);
		if(isAvailable) { // 빈공간 있으면 계속 실행
			target.classList.add(type, "moving") // moving 클래스는 현재 위치에서만 색깔 표시하려고
		} else { // 빈공간 없으면 그대로 유지
			// tempMovingItem으로 좌표를 움직이는데 false면 변경시키지 않았던 movingItem으로 원래대로 돌려놓음
			tempMovingItem = {...movingItem};
			setTimeout(() => { // setTimeout은 이벤트루프가 끝나고나서 큐에서 코드꺼내와 스택에다 넣기떄문에 스택 넘치는거 예방
				renderBlocks()
				// TODO 40분부터 듣기
				
			}, 0)
			
		}
	})
}

function checkEmpty(target){
	if(!target) {
		return false;
	}
	return true;
}

function moveBlock(moveType, amount) {
	// tempMoving을 통해 렌더링하니까 이 값을 바꿔줘야함
	tempMovingItem[moveType] += amount;
	renderBlocks();
}

// event handling
document.addEventListener('keydown', e => {
	switch(e.keyCode) {
		case 39: // right
			// tempMovingItem.left = tempMovingItem.left + 1
			moveBlock('left', 1);
			break;
		case 37:
			moveBlock('left', -1);
			break;
		case 40:
			moveBlock('top', 1);
			break;
		default:
			break;
	
	}
})

 