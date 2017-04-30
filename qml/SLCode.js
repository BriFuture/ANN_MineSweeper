Qt.include("Tank.js");
Qt.include("Landmine.js");
Qt.include("Neuralnet.js");

var t1;
function init(canvas) {
    var ctx = canvas.getContext("2d");
    Landmine.ctx = ctx;
    var lmData = [10, 20, 50, 80, 120, 200, 400, 300, 350, 100];
    LandmineSet.createLandminesFromData(lmData);

    Tank.ctx = ctx;
    t1 = Tank.create(1);
}

function paint(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    LandmineSet.drawAll();
    t1.update(canvas.px, canvas.py, canvas.rotate);

    LandmineSet.destroyFromScale([t1.x-t1.wheel_x, t1.x+t1.wheel_x], [t1.y-t1.wheel_y, t1.y+t1.wheel_y]);
}

var controller = {
    population: [],
    sweepers: [],
    mines: LandmineSet,

}


