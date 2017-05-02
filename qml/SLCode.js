Qt.include("Tank.js");
Qt.include("Landmine.js");
Qt.include("Neuralnet.js");


function init(canvas) {
    var ctx = canvas.getContext("2d");
    Landmine.ctx = ctx;
//    var lmData = [10, 20, 50, 80, 120, 200, 400, 300, 350, 100];
    var lmData = [];
    for(var i = 0; i < controller.mineNum; i++) {
        lmData.push(parseInt(Math.random()*canvas.width), parseInt(Math.random()*canvas.height));
    }

    LandmineSet.addLandminesFromData(lmData);

    Tank.ctx = ctx;
    controller.createTanks(1);

    controller.tanks[0].update(100, 100, 0);
}

function paint(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    LandmineSet.drawAll();

    controller.drawAllTanks();

    // check that if the mine should be cleared
    LandmineSet.destroyFromScale([controller.tanks[0].x - Tank.wheel_x, controller.tanks[0].x + Tank.wheel_x], [controller.tanks[0].y - Tank.wheel_y, controller.tanks[0].y + Tank.wheel_y]);

    if( LandmineSet.mines.length < controller.mineNum ) {
        var lmData = [parseInt(Math.random()*canvas.width), parseInt(Math.random()*canvas.height)];
//        for(var i = LandmineSet.mines.length; i < controller.mineNum; i++) {
//            lmData.push(parseInt(Math.random()*canvas.width), parseInt(Math.random()*canvas.height));
//        }
        LandmineSet.addLandminesFromData(lmData);
    }
}

var controller = {
    population: [],
    tanks: [],
    mineNum: 20,

    weightsNumInNN: 0, // weights in neural net
    avgFitness: 0, // the average fitness of each epoch
    bestFitness: 0, // the best fitness of each epoch
    ticks: 0, // the frame for each epoch

    update: function() {
        if ( this.ticks++ < Params.tickNums ) {
            for (var i = 0; i < this.tanks.length; i++) {

            }
        }
    },

    /**
     * set exact tank's speed
     * {int} id
     * {double} speed
     */
    setTankSpeed: function(id, speed) {
        this.tanks[id].speed = speed;
    },

    /**
     * {int} num  the number of tanks needed to be created
     */
    createTanks: function(num) {
        for (var i = 0; i < num; i++) {
            this.tanks.push(Tank.create(i));
        }
    },

    drawAllTanks: function() {
        this.tanks.forEach(function(tank){
           tank.draw();
        });
    },

    initNeuralnet: function() {
        NeuralNet.build("");
    }

}

function moveFirstTank(code) {
    // var t = controller.getTank(0);
    switch (code) {
        case Qt.Key_W:
            controller.tanks[0].move(-1, 0);
            break;
        case Qt.Key_A:
            controller.tanks[0].rotate -= 5;
            break;
        case Qt.Key_S:
            controller.tanks[0].move(1, 0);
            break;
        case Qt.Key_D:
            controller.tanks[0].rotate += 5;
            break;
    }
}
