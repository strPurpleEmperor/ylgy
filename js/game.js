/**
 * ============================================================
 * @author 程序员七七
 * @description 程序员盒子网站作者 & 代码链网站作者
 * @website https://wwww.coderutil.com
 * @date 2022-09-24
 * ============================================================
 */

/***
 * 游戏元素对象
 * @constructor
 */
function GameItem(id, name, icon, color) {

    /** 元素编号 **/
    var id = id;

    /** 元素名字：java、C、php…… **/
    var name = name;

    /** 元素icon **/
    var icon = icon;

    /***
     * 背景颜色
     * @type {string}
     */
    var color = color;

    this.id = function () {
        return id;
    }
    this.name = function () {
        return name;
    }
    this.icon = function () {
        return icon;
    }
    this.color = function () {
        return color;
    }
}


/***
 * 游戏网格
 * 1、每层格子抽象为一个矩阵/数组, 共 4 层: [8, 8], [7, 7], [6, 6], [5, 5], [4, 4]
 * 2、每层初始化规则：（64 - 12） + （49 - 10） + （36 - 8） + （25 - 6） + （16 - 4）共 150个元素 50队
 * 3、一共设置了10中图标元素，目前是写死的，固定规则：分别5组 10 * 5 * 3 = 150个
 */
function GameGrid() {

    var initProcess = 0;

    var initItemIndex = 0;

    /** 初始化元素总个数 **/
    var initSize = 150;

    /***
     * 实际元素个数
     * @type {number}
     */
    var size = 0;

    /** 初始化所有元素 **/
    var items = new Array();

    var colors = ["#95e1d3", "#eaffd0", "#fce38a", "#f38181", "#ffe2e2", "#e0f9b5", "#cadefc", "#a1eafb", "#ffd3b5", "#b9d7ea"];

    /****
     * 1代表位置有元素，0 代码无元素
     * [
     *  1, 1, 1, 1, 1, 1, 1, 1
     *  1, 0, 0, 1, 1, 0, 0, 1
     *  1, 1, 0, 1, 1, 1, 1, 1
     *  0, 0, 0, 1, 1, 0, 0, 1
     *  0, 0, 0, 1, 1, 0, 0, 1
     *  1, 1, 0, 1, 1, 1, 1, 1
     * ]
     */
    /**1层**/
    var matrix1;
    /**2层**/
    var matrix2;
    /**3层**/
    var matrix3;
    /**4层**/
    var matrix4;
    /**5层**/
    var matrix5;

    /** 初始化游戏元素 * */
    this.init = function() {
        // 初始化游戏元素信息
        this.initGameData();
        this.addInitProcess();

        // 初始化网格之前，先随机元素顺序
        // 重新排序
        this.sort();

        // 初始化游戏网格
        this.initGameGrid();
        this.addInitProcess();

        return this;
    }

    /***
     * 初始化游戏数据
     * @returns {any[]}
     */
    this.initGameData = function() {
        var idx = 0;
        for (var i = 0; i < this.initSize(); i++) {
            idx = Math.floor(i / 15);
            var id = i;
            var name = idx;
            var icon = "./icon/"+(idx + 1)+".png";
            var color = colors[idx];
            // 加入游戏元素容器
            items.add(new GameItem(id, name, icon, color));
        }
        console.log("完成游戏元素初始化")
        return items;
    }

    /***
     * 初始化游戏网格
     */
    this.initGameGrid = function () {
        /***
         * 初始化 1 - 5 层矩阵， 每次初始化元素位置都是随机的
         * *^* 这里X、Y、矩阵0数量直接写死吧，懒得定义了
         */
        matrix1 = this.initMatrix(8, 8, 12);
        matrix2 = this.initMatrix(7, 7, 10);
        matrix3 = this.initMatrix( 6, 6, 8);
        matrix4 = this.initMatrix(5, 5, 6);
        matrix5 = this.initMatrix(4, 4, 4);
        /***
         * 添加游戏元素到格子面板
         */
        this.addItem2Grid("5", matrix5, 4, 4, null, true);
        this.addItem2Grid("4", matrix4, 5, 5, matrix5, false);
        this.addItem2Grid("3", matrix3, 6, 6, matrix4, false);
        this.addItem2Grid("2", matrix2, 7, 7, matrix3, false);
        this.addItem2Grid("1", matrix1, 8, 8, matrix2, false);
        /***
         * 注册点击事件
         */
        $(".grid-game-item").on('click', function () {
            var disableClick = $(this).children(".disable-click").length > 0;
            if (disableClick) {
                // 不能点击
                return;
            }
            var id = $(this).attr("id");
            var name = $(this).attr("name");
            var icon = $(this).children("img").attr("src");
            var color = $(this).css("background-color");
            var clickGridId = $(this).attr("data-grid");
            var clickX = parseInt($(this).attr("data-x"));
            var clickY = parseInt($(this).attr("data-y"));
            $(this).remove();


            $(".game-selected-container").append("<div class=\"game-item\" style='background-color: "+color+";' name=\""+name+"\" id=\""+id+"\"><img src='"+icon+"'></div>");

            var selectedItems = $(".game-selected-container").children(".game-item");
            var selectItemCount = 0;
            var clearItems = new Array();
            for (let selectIdx = 0; selectIdx < selectedItems.length; selectIdx++) {
                var selectedItem = selectedItems[selectIdx];
                var selectedItemName = selectedItem.getAttribute("name");
                if (selectedItemName == name) {
                    selectItemCount += 1;
                    clearItems.add(selectedItem);
                    if (selectItemCount == 3) {
                        clearItems[0].remove();
                        clearItems[1].remove();
                        clearItems[2].remove();
                    }
                }
            }
            var selectCount = $(".game-selected-container").children(".game-item").length;
            if (selectCount == 7) {
                var gameOver ="<div style='position: relative; width: 390px; height: 540px;'>" +
                    "<img src='./image/game.over.png' style='position: absolute; top: 90px; width: 180px; left: 100px'> " +
                    "<p style='position: absolute; font-size: 30px; top: 330px; left: 100px;'>GAME OVER !</p>" +
                    "<button id='restart' style='position: absolute; left: 90px; top: 410px; width: 200px; height: 50px;" +
                    " background-color: transparent; border: moccasin' onclick='location.reload()'><img src='./image/game.restart.png'></button></div>";
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: true,
                    area:  ['400px', '550px'],
                    skin: 'popup',/*注意这里用到了我们前面给 layer 写的自定义 skin*/
                    content: gameOver,/*自定义 html 内容，注意这里的整个 html 内容背景肯定是透明的*/
                    success: function(layero, index){
                    },
                    end: function(){
                    }
                });
                return;
            }

            // 刷新状态
            var refreshMatrix;
            var clickMatrix;
            switch (clickGridId) {
                case "5":
                    refreshMatrix = matrix4;
                    clickMatrix = matrix5;
                    break;
                case "4":
                    refreshMatrix = matrix3;
                    clickMatrix = matrix4;
                    break;
                case "3":
                    refreshMatrix = matrix2;
                    clickMatrix = matrix3;
                    break;
                case "2":
                    refreshMatrix = matrix1;
                    clickMatrix = matrix2;
                    break;
                default:
                    return;
            }
            var clickMatrixX = clickMatrix.length;
            var clickMatrixY = clickMatrix[0].length;

            clickMatrix[clickX][clickY] = 0;

            /***
             * 点击一个元素需要验证底层四个元素
             * (x, y)、(x+1, y)、(x, y+1)、(x+1, y+1):
             * 底层的一个元素是否可点击需要验证上层的4个元素:
             * (x-1, y-1)、(x-1, y)、(x, y-1)、(x, y)
             */
            // (clickX - 1, clickY - 1)、 (clickX - 1, clickY)、 (clickX, clickY - 1)、 (clickX, clickY)
            var validateValue1 = refreshMatrix[clickX][clickY];
            // (clickX, clickY - 1)、 (clickX, clickY)、 (clickX + 1, clickY - 1)、 (clickX + 1, clickY)
            var validateValue2 = refreshMatrix[clickX + 1][clickY];
            // (clickX - 1, clickY)、 (clickX - 1, clickY + 1)、 (clickX, clickY)、 (clickX, clickY + 1)
            var validateValue3 = refreshMatrix[clickX][clickY + 1];
            // (clickX, clickY)、 (clickX, clickY + 1)、 (clickX + 1, clickY)、 (clickX + 1, clickY + 1)
            var validateValue4 = refreshMatrix[clickX + 1][ clickY + 1];
            if (validateValue1 == 1) {
                var condition1 = (clickX - 1 < 0) || (clickY - 1 < 0) ? true : clickMatrix[clickX - 1][clickY - 1] == 0;
                var condition2 = (clickX - 1 < 0) ? true : clickMatrix[clickX - 1][clickY] == 0;
                var condition3 = (clickY - 1 < 0) ? true : clickMatrix[clickX][clickY - 1] == 0;
                var condition4 = clickMatrix[clickX][clickY] == 0;
                if (condition1 && condition2 && condition3 && condition4) {
                    $("#"+(parseInt(clickGridId) - 1)+"_"+clickX+"_"+clickY).children(".disable-click").remove();
                }
            }
            if (validateValue2 == 1) {
                var condition1 = (clickY - 1 < 0) ? true : clickMatrix[clickX][clickY - 1] == 0;
                var condition2 = clickMatrix[clickX][clickY] == 0;
                var condition3 = (clickX + 1 >= clickMatrixX) || (clickY - 1 < 0) ? true : clickMatrix[clickX + 1][clickY -1] == 0;
                var condition4 = (clickX + 1 >= clickMatrixX) ? true : clickMatrix[clickX + 1][clickY] == 0;
                if (condition1 && condition2 && condition3 && condition4) {
                    $("#"+(parseInt(clickGridId) - 1)+"_"+(clickX + 1)+"_"+clickY).children(".disable-click").remove();
                }
            }
            if (validateValue3 == 1) {
                var condition1 = (clickX - 1 < 0) ? true : clickMatrix[clickX - 1][clickY] == 0;
                var condition2 = (clickX - 1 < 0) || (clickY + 1 >= clickMatrixY) ? true : clickMatrix[clickX - 1][clickY + 1] == 0;
                var condition3 = clickMatrix[clickX][clickY] == 0;
                var condition4 = (clickY + 1 >= clickMatrixY) ? true : clickMatrix[clickX][clickY + 1] == 0;
                if (condition1 && condition2 && condition3 && condition4) {
                    $("#"+(parseInt(clickGridId) - 1)+"_"+clickX+"_"+(clickY+1)).children(".disable-click").remove();
                }
            }
            if (validateValue4 == 1) {
                var condition1 = clickMatrix[clickX][clickY] == 0;
                var condition2 = (clickY + 1 >= clickMatrixY) ? true : clickMatrix[clickX][clickY + 1] == 0;
                var condition3 = (clickX + 1 >= clickMatrixX) ? true : clickMatrix[clickX + 1][clickY] == 0;
                var condition4 = (clickX + 1 >= clickMatrixX) || (clickY + 1 >= clickMatrixY) ? true : clickMatrix[clickX + 1][clickY + 1] == 0;
                if (condition1 && condition2 && condition3 && condition4) {
                    $("#"+(parseInt(clickGridId) - 1)+"_"+(clickX+1)+"_"+(clickY+1)).children(".disable-click").remove();
                }
            }
        })
    }

    /***
     * 加入网格
     * @param containerId
     * @param matrix
     * @param x
     * @param y
     */
    this.addItem2Grid = function (gridLevel, matrix, x, y, topMatrix, isTop) {
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                if (matrix[i][j] == 1) {
                    var item = items[initItemIndex++];
                    var leftPx = j * 72 + "px";
                    var topPx = i * 72 + "px";
                    var disableClickItem = "";
                    if (!isTop) {
                        // (x, y)、x, y+1)、(x+1, y)、(x+1, y+1)
                        var topMatrixX = topMatrix.length;
                        var topMatrixY = topMatrix[0].length;
                        var condit1 = (i - 1 < 0) || (j - 1 < 0) ? false : topMatrix[i-1][j-1] == 1;
                        var condit2 = (i - 1 < 0) || (j >= topMatrixY) ? false : topMatrix[i-1][j] == 1;
                        var condit3 = (i >= topMatrixX) || (j - 1 < 0) ? false : topMatrix[i][j-1] == 1;
                        var condit4 = (i >= topMatrixX) || (j >= topMatrixY) ? false : topMatrix[i][j] == 1;
                        if (condit1 || condit2 || condit3 || condit4) {
                            disableClickItem = "<div class='disable-click'></div>";
                        }
                    }
                    $(".grid-"+gridLevel).append("<div class=\"grid-game-item\" style='background-color: "+item.color()+"; left: "+leftPx+";top: "+topPx+"'" +
                        " name=\""+item.name()+"\" id=\""+gridLevel+"_"+i+"_"+j+"\" data-grid=\""+gridLevel+"\" data-x=\""+i+"\" data-y=\""+j+"\">" +
                        "<img src='"+item.icon()+"'>"+disableClickItem+"</div>");
                }
            }
        }
    }


    /***
     * 获取需要初始化的元素个数
     * @returns {number}
     */
    this.initSize = function () {
        return initSize;
    }

    /***
     * 获取剩余元素个数
     * @returns {number}
     */
    this.size = function () {
        return items.length;
    }

    /***
     * 获取所有元素
     * @returns {any[]}
     */
    this.items = function () {
        return items;
    }

    /***
     * 游戏初始化进度条
     * @returns {number}
     */
    this.addInitProcess = function () {
        initProcess += 1;
        return size;
    }

    /***
     * 打乱arr顺序
     */
    this.sort = function () {
        var length = this.size(),
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = items[randomIndex];
            items[randomIndex] = items[length];
            items[length] = temp;
        }
    }

    /***
     * 打印当前剩余元素信息
     */
    this.printItems = function () {
        for (let i = 0; i < this.size(); i++) {
            var itemTmp = items[i];
            console.log("item = id:"+itemTmp.id() + " name:"+itemTmp.name() + " icon:"+itemTmp.icon() + " color:"+itemTmp.color())
        }
    }

    /***
     * 初始化一个 X * Y 的 0、1 矩阵：1代表有元素，0 无元素，
     * @param x x轴个数
     * @param y y轴个数
     * @param emptySize 空个数，即位置0的个数
     */
    this.initMatrix = function (x, y, emptySize) {
        // 初始化一个 X * Y 的值为1的矩阵
        var matrix = new Array();
        for (var i = 0; i < x; i++) {
            matrix[i] = new Array();
            for (var j = 0; j < y; j++) {
                matrix[i][j] = 1;
            }
        }
        // 随机生成emptySize个随机位置，设置值为0，代表没有元素
        var validateArr = new Array(); // 娇艳重复的
        for (var i = 0; i < emptySize; i++) {
            var randomArr = getRandom(x, y, validateArr);
            matrix[randomArr[0]][randomArr[1]] = 0;
        }
        return matrix;
    }

}

/***
 * 随机生成一个数组中不存在的随机数
 * @param n 开始值
 * @param m 结束值
 * @returns {number}
 */
function getRandom(n, m, arr){
    var randomArr = new Array();
    randomArr.add(getRandomNumber(0, n-1));
    randomArr.add(getRandomNumber(0, m-1));
    var zeroTag = randomArr[0] + "-" + randomArr[1];
    if (!arr.contain(zeroTag)) {
        arr.add(zeroTag);
        return randomArr;
    } else {
        // 递归
        return getRandom(n, m, arr);
    }
}

// 随机数
function getRandomNumber(n, m){
    return Math.floor(Math.random()*(m-n+1)+n);
}

/***
 * Array 基础事件
 * @param val
 */
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.contain = function(val) {
    return this.indexOf(val) > -1;
};

Array.prototype.clear = function() {
    this.length=0;
};

Array.prototype.add = function(val) {
    this.unshift(val);
};