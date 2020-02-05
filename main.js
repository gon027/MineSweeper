addEventListener("load", main);

let canvas;     //キャンバス
let context;    //コンテキスト

let Mouse = {
    x: 0,
    y: 0
}

//キャンバスを生成
function createCanvas(_width, _height) {
    canvas = document.getElementById("myCanvas");
    canvas.width = _width;
    canvas.height = _height;
    context = canvas.getContext('2d');
}

const Difficulty = {
    Easy: 0,
    Nomal: 1,
    Hard: 2
}

let currentdiff = Difficulty.Easy;    // 現在の難易度

let array;  // 爆弾等を記録する配列
let caver_array;    // 外側の側を記録する配列
let images = new Array(12);

const windowX = [8, 16, 24];            // フレームの幅
const windowY = [8, 16, 24];            // フレームの高さ
const boms = [10, 40, 99];              // 爆弾の数
const flags = [40, 80, 99];             // フラグの数
const scales = [1, 0.66, 0.66];         // スケール
const rectSize = [48, 32, 32];          // 四角形の大きさ
const dx = [0, 1, 1, 1, 0, -1, -1, -1];
const dy = [-1, -1, 0, 1, 1, 1, 0, -1];

const BOM = 9;
const FRAG = 10;

let width;
let height;

let firstClick;
let gameOver;

function main(){
    loadImages();
    width = rectSize[currentdiff] * windowX[currentdiff];
    height = rectSize[currentdiff] * windowY[currentdiff];
    createCanvas(width, height);
    size = Math.ceil(48 * scales[currentdiff]);

    init();

    setInterval(update, 60);
    canvas.addEventListener('click', mouseClick);
}

function init(){
    let H = windowY[currentdiff];
    let W = windowX[currentdiff];

    initArray(W, H);
    setBom(W, H);
    calcBomRange(W, H);
    // debugArray(H);
}

function update() {
    draw();
}

function draw() {
    // マス目描画
    let H = windowY[currentdiff];
    let W = windowX[currentdiff];

    context.clearRect(0, 0, width, height);
    // context.fillStyle = '#ffffff';
    // context.fillRect(0, 0, width, height);

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if ((y + x) % 2 == 0) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "yellow";
            }
            context.fillRect(x * size, y * size, size, size);

            if (array[y][x] != 0) {
                context.drawImage(images[array[y][x]], x * size, y * size);
            }

            if (caver_array[y][x] == 11) {
                context.drawImage(images[11], x * size, y * size);
            } else if (caver_array[y][x] == FRAG){
                context.drawImage(images[FRAG], x * size, y * size);
            }
        }
    }
}

function digRangeMasu(_x, _y){
    let W = windowX[currentdiff], H = windowY[currentdiff];

    if (!outOfArray(_x, _y, W, H)) return;
    console.log(2391);

    let iy = 0, ix = 0;
    for(let i = 0; i < 8; i += 2){
        iy = _y + dy[i];
        ix = _x + dx[i];

        console.log(1111);
        // console.log(i + ": iy = " + iy + ", ix = " + ix);

        if (caver_array[_y][_x] == 11){
            console.log(1192);
            digRangeMasu(ix, iy);
        }
    }

    console.log(115514);
    caver_array[_y][_x] = 0;
}

function initArray(_W, _H){
    array = new Array(_H);
    caver_array = new Array(_H);

    for (let y = 0; y < _H; y++) {
        array[y] = new Array(_W);
        caver_array[y] = new Array(_W);
        for (let x = 0; x < _W; x++) {
            array[y][x] = 0;
            caver_array[y][x] = 11;
        }
    }
}

// 爆弾の配置
function setBom(_W, _H){
    let bomCount = 0;
    while (bomCount != boms[currentdiff]) {
        let bx = getRandomRange(0, _W);
        let by = getRandomRange(0, _H);
        if (array[by][bx] == 0) {
            array[by][bx] = 9;
            bomCount++;
        }
    }
}

// 爆弾のある範囲をカウントする
function countRangeBom(_x, _y, _W, _H){
    // console.log("y = " + _y + ", x = " + _x + ", val = " + array[_y][_x]);
    for(let i = 0; i < 8; i++){
        let iy = _y + dy[i];
        let ix = _x + dx[i];
        if(outOfArray(ix, iy, _W, _H) && array[iy][ix] != 9){
            // console.log(i + ": iy = " + iy + ", ix = " + ix + ", array = " + array[iy][ix]);

            array[iy][ix]++;
        }
    }
}

function calcBomRange(_W, _H){
    // 爆弾の周りに数字を描画
    for (let y = 0; y < _H; y++) {
        for (let x = 0; x < _W; x++) {
            if (array[y][x] !== 9) continue;
            countRangeBom(x, y, _W, _H);
        }
    }
}

function outOfArray(_x, _y, _W, _H){
    if (_x < 0 || _x > _W - 1 || _y < 0 || _y > _H - 1) {
        return false;
    }

    return true;
}

function loadImages(){
    for (let i = 0; i < 12; i++) {
        images[i] = new Image();
    }

    images[0].src = "Aseet/none.png";
    images[1].src = "Aseet/one.png";
    images[2].src = "Aseet/twe.png";
    images[3].src = "Aseet/three.png";
    images[4].src = "Aseet/four.png";
    images[5].src = "Aseet/five.png";
    images[6].src = "Aseet/six.png";
    images[7].src = "Aseet/seven.png";
    images[8].src = "Aseet/eight.png";
    images[9].src = "Aseet/bom.png";
    images[10].src = "Aseet/flag.png";
    images[11].src = "Aseet/wall.png";
}

function mouseClick(e) {
    let mouse = transrateArrayIndex(getMousePosition(e));

    if (outOfArray(mouse.x, mouse.y)) {
        // caver_array[mouse.y][mouse.x] = 0;
        digRangeMasu(mouse.x, mouse.y);
    }

    debugArray(8);
}

function leftClickEvent(){

}

function rightClickEvent(){

}

function getMousePosition(_e){
    let rect = canvas.getBoundingClientRect();

    let mx = _e.clientX - rect.left;
    let my = _e.clientY - rect.top
    return {
        x: mx,
        y: my
    };
}

function transrateArrayIndex(_mouse){
    return {
        x: Math.floor(_mouse.x / size),
        y: Math.floor(_mouse.y / size)
    }
}

// [min, max)の範囲のランダムな数値を取得
function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function debugArray(_H){
    for (let y = 0; y < _H; y++) {
        console.log(caver_array[y]);
    }
}