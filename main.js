addEventListener("load", main);
addEventListener("mousemove", mouseMove);
addEventListener('click', mouseClick);

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
    //console.log(canvas);

    context = canvas.getContext('2d');
    //console.log(context);
}

function mouseMove(e) {
    let rect = canvas.getBoundingClientRect();
    Mouse.x = e.clientX - rect.left;
    Mouse.y = e.clientY - rect.top;
}

function mouseClick(e) {
    // console.log("clicked");
    // console.log(" uoooo ;x = " + Mouse.x + ": y = " + Mouse.y);
}

let currentdiff = 0;    // 現在の難易度

let array;  // 爆弾等を記録する配列
let caver_array;    // 外側の側を記録する配列
let images = new Array(12);

const windowX = [8, 16, 24];  // フレームの幅
const windowY = [8, 16, 24];  // フレームの高さ
const boms = [10, 40, 99];    // 爆弾の数
const flags = [40, 80, 99];    // フラグの数
const scales = [1, 0.66, 0.66]; // スケール
const rectSize = [48, 32, 32];  // 四角形の大きさ
const dx = [0, 1, 1, 1, 0, -1, -1, -1];
const dy = [-1, -1, 0, 1, 1, 1, 0, -1];

const BOM = 10;

let width;
let height;

let image;

function main(){
    if(currentdiff < 0 || currentdiff > 2){
        currentdiff = 0;
    }

    width = rectSize[currentdiff] * windowX[currentdiff];
    height = rectSize[currentdiff] * windowY[currentdiff];
    size = rectSize[currentdiff];

    createCanvas(width, height);

    loadImages();

    init();
    // draw();

    setInterval(update, 1000 / 60);
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
    getMousePosition();
    console.log("x = " + Mouse.x + ": y = " + Mouse.y);
    // context.drawImage(images[0], 0, 0);
    // context.drawImage(images[1], size, 0);
    // context.drawImage(images[2], size * 2, 0);
    // context.drawImage(images[3], size * 3, 0);
    // context.drawImage(images[4], 0, size);
    // context.drawImage(images[5], 0, size * 2);
    // context.drawImage(images[6], 0, size * 3);
    // context.drawImage(images[7], size, size);
    // context.drawImage(images[8], size * 2, size * 2);
    // context.drawImage(images[9], size * 3, size * 3);

    draw();
}

function initArray(_W, _H){
    array = new Array(_H);
    for (let y = 0; y < _H; y++) {
        array[y] = new Array(_W);
        for (let x = 0; x < _W; x++) {
            array[y][x] = 0;
            // console.log(array[y][x]);
            // console.log(1);
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
    console.log("y = " + _y + ", x = " + _x + ", val = " + array[_y][_x]);
    for(let i = 0; i < 8; i++){
        let iy = _y + dy[i];
        let ix = _x + dx[i];
        if(!outOfArray(ix, iy, _W, _H) && array[iy][ix] != 9){
            console.log(i + ": iy = " + iy + ", ix = " + ix + ", array = " + array[iy][ix]);

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
        return true;
    }

    return false;
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

function draw(){
    // マス目描画
    let H = windowY[currentdiff];
    let W = windowX[currentdiff];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            // drawTest(x, y, array[y][x]);
            context.drawImage(images[array[y][x]], x * size, y * size);
        }
    }
}

// function drawTest(_x, _y, _num){
//     switch(_num){
//         case 10: {
//             context.fillStyle = "rgb(255, 255, 255)";
//             drawRect(_x * size, _y * size, size);
//             break;
//         }

//         case 0:{
//             context.fillStyle = "rgb(0, 255, 0)";
//             drawRect(_x * size, _y * size, size);
//             break;
//         }

//         case 1: {
//             context.fillStyle = "rgb(255, 0, 255)";
//             drawRect(_x * size, _y * size, size);
//             break;
//         }

//         case 2: {
//             context.fillStyle = "rgb(255, 0, 0)";
//             drawRect(_x * size, _y * size, size);
//             break;
//         }

//         case 3: {
//             context.fillStyle = "rgb(0, 0, 255)";
//             drawRect(_x * size, _y * size, size);
//             break;
//         }

//         case 4: {
//             context.fillStyle = "rgb(0, 0, 255)";
//             drawRect(_x * size, _y * size, size);
//             break;
//         }
//     }
// }

// function drawRect(_x, _y, _size){
//     context.fillRect(_x, _y, _size, _size);
//     context.strokeRect(_x, _y, _size, _size);
// }

function getMousePosition(){
    Mouse.x = Math.floor(Mouse.x / size);
    Mouse.y = Math.floor(Mouse.y / size);
}


// [min, max)の範囲のランダムな数値を取得
function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function debugArray(_H){
    for (let y = 0; y < _H; y++) {
        console.log(array[y]);
    }
}