var start_x = 400; // 矩形起始坐标
var start_y = 50; // 距离top
var container_width = 400; // canvas 宽度
var grid_width = 100; // 小方块宽度
var grid_offset = grid_width - 3; // 实际绘制宽度
var colors = ['red', '#0000FF', '#FFFF00', '#FF00FF', '#C0C0C0', '#8A2BE2', '#B8860B', '#4B0082', '#FF6FFF', '#800000'];
var canvas_node;
var canvas_ctx;
var table = []; // table 中记录的是2的幂
var score_x = start_x + container_width * 1.2;//分数的x坐标
var score_y = start_y * 1.5;//分数的y坐标

function Grid(x, y, n) {

    this.x = x;
    this.y = y;
    this.number = n;
    this.color = "black";

    this.rendering = function () {
        canvas_ctx.fillStyle = colors[this.number % 10];
        canvas_ctx.fillRect(start_x + this.x, start_y + this.y, grid_offset, grid_offset);

        var px = 30, py = 70;
        var number = Math.pow(2, this.number);
        canvas_ctx.fillStyle = '#000000';

        // 针对不同的幂使用不同大小的字体
        if (this.number > 6) {
            if (this.number > 9) {
                canvas_ctx.font = "40px 宋体";
                canvas_ctx.fillText(number.toString(), start_x + this.x + px - 20, start_y + this.y + py - 10);
            } else {
                canvas_ctx.font = "45px 宋体";
                canvas_ctx.fillText(number.toString(), start_x + this.x + px - 15, start_y + this.y + py - 10);
            }
        } else if (this.number < 4) {
            canvas_ctx.font = "60px 宋体";
            canvas_ctx.fillText(number.toString(), start_x + this.x + px, start_y + this.y + py);
        } else {
            canvas_ctx.font = "50px 宋体";
            canvas_ctx.fillText(number.toString(), start_x + this.x + px - 10, start_y + this.y + py - 10);
        }
    };

    this.update = function (dt) {
        this.x += 2;
        this.rendering();
    };
}

// 清空格子
function clearGrid(i, j) {
    canvas_ctx.fillStyle = '#00FFFF';
    // canvas_ctx.fillRect(start_x + grid_width * i, start_y + grid_width * j, grid_offset, grid_offset);
}

// 绘制数字, 在i, j处绘制2的n次方数字
function drawNumber(i, j, n) {

    canvas_ctx.fillStyle = colors[n % 10];
    canvas_ctx.fillRect(start_x + grid_width * i, start_y + grid_width * j, grid_offset, grid_offset);

    var px = 30, py = 70;
    var number = Math.pow(2, n);
    canvas_ctx.fillStyle = '#000000';
    // 针对不同的幂使用不同大小的字体
    if (n > 6) {
        if (n > 9) {
            canvas_ctx.font = "40px 宋体";
            canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px - 20, start_y + grid_width * j + py - 10);
        } else {
            canvas_ctx.font = "45px 宋体";
            canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px - 15, start_y + grid_width * j + py - 10);
        }
    } else if (n < 4) {
        canvas_ctx.font = "60px 宋体";
        canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px, start_y + grid_width * j + py);
    } else {
        canvas_ctx.font = "50px 宋体";
        canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px - 10, start_y + grid_width * j + py - 10);
    }
}

// 绘制棋盘与数字
function drawBoard() {
    // 绘制背景
    canvas_ctx.fillStyle = '#00FFFF';
    canvas_ctx.fillRect(start_x, start_y, container_width, container_width);

    // 绘制棋盘
    var i, j;
    // 横线
    for (i = 0; i < 5; i++) {

        canvas_ctx.moveTo(start_x, start_y + i * grid_width);
        canvas_ctx.lineTo(start_x + container_width, start_y + i * grid_width);

        canvas_ctx.lineWidth = 1;
        canvas_ctx.strokeStyle = '#00FF5F';
        canvas_ctx.stroke();
    }
    // 竖线
    for (i = 0; i < 5; i++) {
        canvas_ctx.moveTo(start_x + i * grid_width, start_y);
        canvas_ctx.lineTo(start_x + i * grid_width, start_y + container_width);
        canvas_ctx.lineWidth = 1;
        canvas_ctx.strokeStyle = '#00FF5F';
        canvas_ctx.stroke();
    }

    // for (i = 0; i < 4; ++i) {
    //     for (j = 0; j < 4; ++j) {
    //         if (table[i][j] === -1) {
    //             clearGrid(j, i);
    //         } else {
    //             drawNumber(j, i, table[i][j]);
    //         }
    //     }
    // }
}

// 更新并绘制分数
function drawScore() {
    var s = 0;
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (table[i][j] !== -1)
                s += Math.pow(2, table[i][j]);

    canvas_ctx.fillStyle = '#FFFFFF';
    canvas_ctx.fillRect(score_x - 10, score_y - 60, grid_offset, grid_offset + 60);

    canvas_ctx.fillStyle = '#000000';
    canvas_ctx.font = "40px 宋体";
    canvas_ctx.fillText("score", score_x, score_y);
    canvas_ctx.font = "40px 宋体";
    canvas_ctx.fillText(s, score_x, score_y + 60);
}

// 随机生成数字
function creatrec() {
    var i, j;
    var f = 0;
    var p = 10;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (table[i][j] === -1) {
                var n = parseInt(Math.random() * p);
                if (n === 0 && f < 4) {
                    table[i][j] = parseInt(Math.random() * 2) + 1;
                    drawNumber(j, i, table[i][j]);
                    f++;
                }
            }
        }
    }
}

// 在空余的地方随机生成一个数字
function generateNumber() {
    var emptyTable = [];
    var i, j, s = 0;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (table[i][j] === -1) {
                emptyTable[s] = [];
                emptyTable[s][0] = i;
                emptyTable[s][1] = j;
                ++s;
            }
        }
    }

    if (emptyTable.length !== 0) {
        var k = parseInt(Math.random() * emptyTable.length);
        var p = parseInt(Math.random() * 2) + 1;
        // todo: update construction
        table[emptyTable[k][0]][emptyTable[k][1]] = p;
        drawNumber(emptyTable[k][1], emptyTable[k][0], p);
    }
}

function upupdate() {
    var i, j, k;

    var temp = [];

    for (j = 0; j < 4; j++) {
        var p = 0;

        for (i = 0; i < 4; i++) {
            temp[i] = -1;
        }

        for (i = 0; i < 4; i++) {
            if (table[i][j] !== -1) {
                temp[p] = table[i][j];
                p++;
            }
        }
        temp[p] = -1;

        for (i = 0; i < p - 1; i++) {
            if (temp[i] === temp[i + 1] && temp[i] > -1) {
                temp[i] = temp[i] + 1; // 幂+1
                for (k = i + 1; k < 3; k++) {
                    temp[k] = temp[k + 1];
                }
                temp[k] = -1;
            }
        }

        for (i = 0; i < 4; i++) {
            table[i][j] = temp[i];
        }
    }
}

function downupdate() {
    var i, j, k;
    var sa2 = [];

    for (j = 0; j < 4; j++) {
        var p = 0;
        for (i = 0; i < 4; i++)
            sa2[i] = -1;
        for (i = 0; i < 4; i++)
            if (table[3 - i][j] !== -1) {
                sa2[p] = table[3 - i][j];
                p++;
            }
        sa2[p] = -1;
        for (i = 0; i < p - 1; i++)
            if (sa2[i] === sa2[i + 1] && sa2[i] > -1) {
                sa2[i] = sa2[i] + 1;
                for (k = i + 1; k < 3; k++) {
                    sa2[k] = sa2[k + 1];
                }
                sa2[k] = -1;
            }
        for (i = 0; i < 4; i++) {
            table[3 - i][j] = sa2[i];
        }
    }
}

function leftupdate() {
    var i, j, k;
    var sa2 = [];

    for (j = 0; j < 4; j++) {
        var p = 0;
        for (i = 0; i < 4; i++)
            sa2[i] = -1;
        for (i = 0; i < 4; i++)
            if (table[j][i] !== -1) {
                sa2[p] = table[j][i];
                p++;
            }
        sa2[p] = -1;
        for (i = 0; i < p - 1; i++)
            if (sa2[i] === sa2[i + 1] && sa2[i] > -1) {
                sa2[i] = sa2[i] + 1;
                for (k = i + 1; k < 3; k++) {
                    sa2[k] = sa2[k + 1];
                }
                sa2[k] = -1;
            }
        for (i = 0; i < 4; i++) {
            table[j][i] = sa2[i];
        }
    }
}

function rightupdate() {
    var i, j, k;
    var sa2 = [];

    for (j = 0; j < 4; j++) {
        var p = 0;
        for (i = 0; i < 4; i++)
            sa2[i] = -1;
        for (i = 0; i < 4; i++)
            if (table[j][3 - i] !== -1) {
                sa2[p] = table[j][3 - i];
                p++;
            }
        sa2[p] = -1;
        for (i = 0; i < p - 1; i++)
            if (sa2[i] === sa2[i + 1] && sa2[i] > -1) {
                sa2[i] = sa2[i] + 1;
                for (k = i + 1; k < 3; k++) {
                    sa2[k] = sa2[k + 1];
                }
                sa2[k] = -1;
            }
        for (i = 0; i < 4; i++) {
            table[j][3 - i] = sa2[i];
        }
    }
}

function gameOver() {
    var i, j;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (table[i][j] === -1) {
                return false;
            } else if ((i < 3 && j < 3) && (table[i][j] === table[i + 1][j] || table[i][j] === table[i][j + 1])) {
                return false;
            } else if (i === 3 && j < 3 && table[i][j] === table[i][j + 1]) {
                return false;
            } else if (j === 3 && i < 3 && table[i][j] === table[i + 1][j]) {
                return false;
            }
        }
    }
    return true;
}

//键盘事件
document.onkeydown = function (event) {
    // 在移动前记录原先的状态以用于在状态未改变时不产生新块
    var temp = [];
    var i, j;
    for (i = 0; i < 4; i++) {
        temp[i] = [];
        for (j = 0; j < 4; j++) {
            temp[i][j] = table[i][j];
        }
    }

    /// 监听键盘事件
    var e = event || window.event || arguments.callee.caller.arguments[0];

    if (e && e.keyCode === 38) { //up
        upupdate();
    }
    if (e && e.keyCode === 40) { // down
        downupdate();
    }
    if (e && e.keyCode === 37) { // left
        leftupdate();
    }
    if (e && e.keyCode === 39) { // right
        rightupdate();
    }

    if (gameOver()) {
        alert("Game Over!");
    }

    var flag = false;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (temp[i][j] !== table[i][j]) {
                flag = true;
                break;
            }
        }
    }

    if (flag) {
        generateNumber();
    }
};

// 初始化
function init() {
    canvas_node = document.getElementById("mainCanvas");
    canvas_ctx = canvas_node.getContext("2d");

    var i, j;
    for (i = 0; i < 4; i++) {
        table[i] = [];
        for (j = 0; j < 4; j++) {
            table[i][j] = -1;
        }
    }

    // 生成初始数字
    generateNumber();
    generateNumber();
    // creatrec();
}

var grid = new Grid(0, 0, 4);
// 游戏循环
var last_time = undefined;
function gameLoop() {
    var time = Date.now();
    if (last_time !== undefined) {
        console.log(time - last_time);
    }

    drawBoard();
    drawScore();

    grid.update(0.1);

    requestAnimationFrame(gameLoop);
    last_time = time;
}

window.requestAnimationFrame(gameLoop);