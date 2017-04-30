
var Tank = {
    "id": 0,
    "x": 0,
    "y": 0,
    "rotate": 0,
    "scanscale": 10,
    "wheel_x": 18,
    "wheel_y": 15,
    "wheel_width": 6,
    "wheel_height": 21,
    "head_offset": 4,
    "head_length": 36,
};

Tank.create = function(id) {
    var t = Object.create(Tank);
    t.self = t;
    t.create = null;
    return t;
}

Tank.update = function(px, py, rotate) {
    this.x = px;
    this.y = py;
    this.rotate = rotate;
    this.draw();
}

/**
 * 绘制扫雷机
 * px py  位置坐标
 * rotation  旋转弧度，顺时针进行旋转时为正
**/
Tank.draw = function() {
    var ctx = this.ctx;

    // stroke tank
    this.strokeSelf();
}

Tank.scan = function() {

}

Tank.strokeSelf = function() {
    var ctx = this.ctx;
    var r = degToRad(this.rotate);
    // wheel of tank
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0, 255, 255, 1)";
    var args = {};
    args = {"offx": -this.wheel_x, "offy": 0, "width": this.wheel_width, "height": this.wheel_height, "rotation": r};
    this.strokeRectanger(args);
    ctx.stroke();
    args = {"offx": this.wheel_x, "offy": 0, "width": this.wheel_width, "height": this.wheel_height, "rotation": r};
    this.strokeRectanger(args);
    ctx.stroke();

    // main body of tank
    args = {"offx": 0, "offy": 0, "width": this.wheel_x, "height": this.wheel_height/2, "rotation": r};
    this.strokeRectanger(args);
    ctx.stroke();

    // point of tank
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.fillStyle = "rgba(255, 120, 120, 1)";
    args = {"offx": 0, "offy": this.head_length/2, "width": this.head_offset, "height": this.head_length/2, "rotation": r};
    this.strokeRectanger(args);
    ctx.fill();
}

/**
 * 描出构造坦克需要的矩形
 * @param {*} ctx
 * @param {*} args
 */
Tank.strokeRectanger = function(args) {
    var ctx = this.ctx;
    var ca = Math.cos(args.rotation);
    var sa = Math.sin(args.rotation);
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
}

/**
 *
 * @param {*} point
 * @param {*} rotateMatrix 列主序
 */
Tank.rotatePoint = function(point, rotateMatrix) {
    var p1 = point[0] * rotateMatrix[0] + point[1] * rotateMatrix[2];
    var p2 = point[0] * rotateMatrix[1] + point[1] * rotateMatrix[3];
    return [p1, p2];
}

/* 角度转化为弧度 */
function degToRad(deg) {
    return deg * Math.PI / 180;
}
