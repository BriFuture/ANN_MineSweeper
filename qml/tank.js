
var Tank = {
    "id": 0,
    "x": 0,
    "y": 0,
    "rotate": 0,
    "scanscale": 40,
    "wheel_x": 18,
    "wheel_y": 15,
    "wheel_width": 6,
    "wheel_height": 21,
    "head_offset": 4,
    "head_length": 36,
    "speed": 10,
    create: function(id) {
        var t = Object.create(Tank);
        t.self = t;
        t.create = null;
        return t;
    },
    /**
     * 绘制扫雷机
     * px py  位置坐标
     * rotation  旋转弧度，顺时针进行旋转时为正
    **/
    draw : function() {
        var ctx = this.ctx;
        // stroke tank
        this.strokeSelf();
    },
    /**
      * {int} direction  1 stands for going ahead  -1 stands for going back
      */
    move: function(direction, rotateOffset) {
        this.rotate += rotateOffset;
        this.rotate %= 360;
        var mx = Math.cos(degToRad(this.rotate-90)) * direction * this.speed;
        var my = Math.sin(degToRad(this.rotate-90)) * direction * this.speed;
        this.x += mx;
        this.y += my;
        this.draw();
    },
    scan: function() {

    },

    strokeSelf: function() {
        var ctx = this.ctx;
        // wheel of tank
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(0, 255, 255, 1)";
        var args = {};
        args = {"offx": -this.wheel_x, "offy": 0, "width": this.wheel_width, "height": this.wheel_height};
        this.strokeRectanger(args);
        ctx.stroke();
        args = {"offx": this.wheel_x, "offy": 0, "width": this.wheel_width, "height": this.wheel_height};
        this.strokeRectanger(args);
        ctx.stroke();

        // main body of tank
        args = {"offx": 0, "offy": 0, "width": this.wheel_x, "height": this.wheel_height/2};
        this.strokeRectanger(args);
        ctx.stroke();

        // point of tank
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.fillStyle = "rgba(255, 120, 120, 1)";
        args = {"offx": 0, "offy": this.head_length/2, "width": this.head_offset, "height": this.head_length/2};
        this.strokeRectanger(args);
        ctx.fill();
    },

    /**
     * 描出构造坦克需要的矩形
     * @param {*} ctx
     * @param {*} args
     */
    strokeRectanger: function(args) {
        var ctx = this.ctx;
        var r = degToRad(this.rotate);
        var ca = Math.cos(r);
        var sa = Math.sin(r);
        var matrix = [ca, sa, -sa, ca];
        var off = Tank.rotatePoint([args.offx, args.offy], matrix);
        var ox = this.x + off[0];
        var oy = this.y + off[1];
        ctx.translate(ox, oy);
        var p1 = Tank.rotatePoint([-args.width, -args.height], matrix);
        var p2 = Tank.rotatePoint([-args.width, +args.height], matrix);
        var p3 = Tank.rotatePoint([+args.width, +args.height], matrix);
        var p4 = Tank.rotatePoint([+args.width, -args.height], matrix);

        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.lineTo(p4[0], p4[1]);
        ctx.closePath();
        // 还原原点
        ctx.translate(-ox, -oy);
    },

    /**
     * @param {*} point
     * @param {*} rotateMatrix 列主序
     */
    rotatePoint: function(point, rotateMatrix) {
        var p1 = point[0] * rotateMatrix[0] + point[1] * rotateMatrix[2];
        var p2 = point[0] * rotateMatrix[1] + point[1] * rotateMatrix[3];
        return [p1, p2];
    },

    /**
      * calc angle with the direction and the closest mine
      * {int} mx
      * {int} my
    */
    calcAngleWithMine: function(mx, my) {
        var a1 = mx - this.x;
        var a2 = my - this.y;
        var r1 = degToRad(this.rotate+90);
        var r2 = degToRad(this.rotate);
        var theta = Math.acos((a1*b1+a2*b2)/this.calcPointsDistance([a1, a2], [Math.cos(r1), Math.sin(r1)]));
        var thetap = Math.acos((a1*b1+a2*b2)/this.calcPointsDistance([a1, a2], [Math.cos(r2), Math.sin(r2)]));
        if( thetap > 0) {
            // left hand
            theta = Math.PI*2 - theta;
        }
        return theta*180/Math.PI;
    },
    /**
      * {Array} mines
    **/
    findClosestMine: function(mines) {
        var closestMines = [];
        var closests = -1;
        mines.forEach(function(mine, index) {
//            if(mine.inScale([this.x-this.scanscale, this.x+this.scanscale], [this.y-this.scanscale, this.y+this.scanscale])) {
//                closestMines.push(mine);
//            }
//            if( index === 0 ) {
//                closests = calcPointsDistance([this.x, this.y], [mine.x, mine.y]);
//            }

            if( this.calcPointsDistance([this.x, this.y], [mine.x, mine.y]) < this.scanscale ) {
                closestMines.push(mine);
            }
        });
        return closestMines;
    }
};

function calcPointsDistance(p1, p2) {
    return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1]));
}

Tank.update = function(px, py, rotate) {
    this.x = px;
    this.y = py;
    this.rotate = rotate;
    this.draw();
}

/* 角度转化为弧度 */
function degToRad(deg) {
    return deg * Math.PI / 180;
}
