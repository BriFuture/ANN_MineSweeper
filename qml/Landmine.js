var Landmine = {};
//var LandmineSet = {};
Landmine.size = 8;
//Landmine.mines = [];

Landmine.create = function(x, y) {
    var lm = Object.create(Landmine);
    lm.x = x;
    lm.y = y;
//    Landmine.mines.push(lm);
    return lm;
}

Landmine.square = function() {
    this.ctx.fillStyle = "rgba(180, 80, 100, 1)";
    this.ctx.beginPath();
    this.ctx.rect(this.x-Landmine.size, this.y-Landmine.size, 2*Landmine.size, 2*Landmine.size);
    this.ctx.fill();
}

Landmine.drawAll = function() {
    Landmine.mines.forEach(function(e) {
        e.square();
    });
}

/**
  * create a lot of mines from data
  */
Landmine.createFromData = function(data) {
    for(var i = 0; i+1 < data.length; i+=2) {
        Landmine.create(data[i], data[i+1]);
    }
}

//Landmine.find = function (x, y) {
//    var lm;
//    Landmine.mines.forEach(function(element){
//        if( element.ownPos(x, y) )
//            lm = element;
//    });
//    return lm;
//}

Landmine.ownPos = function (x, y) {
    if( x > (this.x - this.size) && x < (this.x + this.size) ) {
        if( y > (this.y - this.size) && y < (this.y + this.size) ) {
            return true;
        }
    }

    return false;
}

Landmine.destroy = function (lm) {
    var index = Landmine.mines.indexOf(lm);
    Landmine.mines.splice(index, 1);
}

Landmine.destroyAtPos = function (x, y) {
    var lm = Landmine.find(x, y);
    if( lm )
        Landmine.destroy(lm);
}

/**
  * for landmine is a square, so 4 points are enough
  */
Landmine.destroyFromScale = function (xscale, yscale) {
    Landmine.destroyAtPos(xscale[0], yscale[0]);
    Landmine.destroyAtPos(xscale[0], yscale[1]);
    Landmine.destroyAtPos(xscale[1], yscale[1]);
    Landmine.destroyAtPos(xscale[1], yscale[0]);
}
