var Landmine = {
    size: 8,
    create: function(x, y) {
        var lm = Object.create(Landmine);
        lm.x = x;
        lm.y = y;
    //    Landmine.mines.push(lm);
        return lm;
    },
    square: function() {
        this.ctx.fillStyle = "rgba(180, 80, 100, 1)";
        this.ctx.beginPath();
        this.ctx.rect(this.x-Landmine.size, this.y-Landmine.size, 2*Landmine.size, 2*Landmine.size);
        this.ctx.fill();
    },
    ownPos: function (x, y) {
        if( x > (this.x - this.size) && x < (this.x + this.size) ) {
            if( y > (this.y - this.size) && y < (this.y + this.size) ) {
                return true;
            }
        }

        return false;
    },
};

var LandmineSet = {
    mines: [],
    /**
      * create a lot of mines from data
      * {Array} data
    */
    createLandminesFromData: function(data) {
        for(var i = 0; i+1 < data.length; i+=2) {
            this.mines.push(Landmine.create(data[i], data[i+1]));
        }
    },

    /**
      * {int} x
      * {int} y
    */
    find: function (x, y) {
        var lm;
        this.mines.forEach(function(element){
            if( element.ownPos(x, y) )
                lm = element;
        });
        return lm;
    },

    drawAll: function() {
        this.mines.forEach(function(e) {
            e.square();
        });
    },
    /**
      * remove landmine from array
      * {Landmine} lm
    **/
    destroy: function(lm) {
        var index = this.mines.indexOf(lm);
        this.mines.splice(index, 1);
    },

    /**
      * {int} x
      * {int} y
    */
    destroyAtPos: function (x, y) {
        var lm = this.find(x, y);
        if( lm )
            this.destroy(lm);
    },

    /**
      *  4 points are enough right now
      * {Array} xscale
      * {Array} yscale
     */
    destroyFromScale: function (xscale, yscale) {
        this.destroyAtPos(xscale[0], yscale[0]);
        this.destroyAtPos(xscale[0], yscale[1]);
        this.destroyAtPos(xscale[1], yscale[1]);
        this.destroyAtPos(xscale[1], yscale[0]);
    }
};





