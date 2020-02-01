addEventListener("load", main);
addEventListener("mousemove", mouseMove);

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

let currentdiff = 2;    // 現在の難易度

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

let array;

function init(){
    // 配列の初期化
    let H = windowY[currentdiff];
    let W = windowX[currentdiff];
    array = new Array(H);
    for(let y = 0; y < H; y++){
        array[y] = new Array(W);
        for(let x = 0; x < W; x++){
            array[y][x] = 0;
            // console.log(array[y][x]);
            // console.log(1);
        }
    }

    // 爆弾の配置
    let bomCount = 0;
    while(bomCount != boms[currentdiff]){
        let bx = getRandomRange(0, W);
        let by = getRandomRange(0, H);
        if (array[by][bx] == 0){
            array[by][bx] = 10;
            bomCount++;
        }
        // console.log(bomCount);
    }

    
    // 爆弾の周りに数字を描画
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if(array[y][x] !== 10) continue;

            countRangeBom(x, y, W, H);
        }
    }

    for (let y = 0; y < H; y++) {
        console.log(array[y]);
    }
}

// 爆弾のある範囲をカウントする
// TODO: 爆弾を巻き込まないようにカウントする
function countRangeBom(_x, _y, _W, _H){
    console.log("y = " + _y + ", x = " + _x + ", val = " + array[_y][_x]);
    for(let i = 0; i < 8; i++){
        let iy = _y + dy[i];
        let ix = _x + dx[i];
        if(!outOfArray(ix, iy, _W, _H) && array[iy][ix] != 10){
            console.log(i + ": iy = " + iy + ", ix = " + ix + ", array = " + array[iy][ix]);

            array[iy][ix]++;
        }
    }
}

function outOfArray(_x, _y, _W, _H){
    if (_x < 0 || _x > _W - 1 || _y < 0 || _y > _H - 1) {
        return true;
    }

    return false;
}

function draw(){
    // マス目描画
    let H = windowY[currentdiff];
    let W = windowX[currentdiff];
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            // if(array[y][x] === 0){
            //     // console.log(11);
            //     context.fillStyle = "rgb(255, 255, 0)";
            //     drawRect(x * size, y * size, size);
            // }else if(array[y][x] == 10){
            //     context.fillStyle = "rgb(255, 0, 0)";
            //     drawRect(x * size, y * size, size);
            // }

            drawTest(x, y, array[y][x]);
        }
    }
}

function drawTest(_x, _y, _num){
    switch(_num){
        case 10: {
            context.fillStyle = "rgb(255, 255, 255)";
            drawRect(_x * size, _y * size, size);
            break;
        }

        case 0:{
            context.fillStyle = "rgb(0, 255, 0)";
            drawRect(_x * size, _y * size, size);
            break;
        }

        case 1: {
            context.fillStyle = "rgb(255, 0, 255)";
            drawRect(_x * size, _y * size, size);
            break;
        }

        case 2: {
            context.fillStyle = "rgb(255, 0, 0)";
            drawRect(_x * size, _y * size, size);
            break;
        }

        case 3: {
            context.fillStyle = "rgb(0, 0, 255)";
            drawRect(_x * size, _y * size, size);
            break;
        }

        case 4: {
            context.fillStyle = "rgb(0, 0, 255)";
            drawRect(_x * size, _y * size, size);
            break;
        }

        case 5: {

            break;
        }

        case 6: {

            break;
        }
    }
}

function drawRect(_x, _y, _size){
    context.fillRect(_x, _y, _size, _size);
    context.strokeRect(_x, _y, _size, _size);
}

function main(){
    if(currentdiff < 0 || currentdiff > 2){
        currentdiff = 0;
    }

    width = rectSize[currentdiff] * windowX[currentdiff];
    height = rectSize[currentdiff] * windowY[currentdiff];
    size = rectSize[currentdiff];

    createCanvas(width, height);

    init();
    draw();

    // setInterval(update, 1000 / 60);
}

function update(){
    getMousePosition();
    console.log("x = " + Mouse.x + ": y = " + Mouse.y);

}

function getMousePosition(){
    Mouse.x = Math.floor(Mouse.x / size);
    Mouse.y = Math.floor(Mouse.y / size);
}

function mouseMove(e){
    let rect = canvas.getBoundingClientRect();
    Mouse.x = e.clientX - rect.left;
    Mouse.y = e.clientY - rect.top;
}

// [min, max)の範囲のランダムな数値を取得
function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
