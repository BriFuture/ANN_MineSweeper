var Landmine = {
    size: 6,
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
    // is point (x, y) in Landmine's scale
    ownPos: function (x, y) {
        if( x > (this.x - this.size) && x < (this.x + this.size) ) {
            if( y > (this.y - this.size) && y < (this.y + this.size) ) {
                return true;
            }
        }

        return false;
    },
    /**
      * {Array} xscale
      * {Array} yscale
    */
    inScale: function(xscale, yscale) {
        // simplified compution
        if ( this.x > xscale[0] && this.x < xscale[1] ) {
            if( this.y > yscale[0] && this.y < yscale[1] )
                return true;
        }
        return false;

        // left up
        if( (this.x - this.size) > xscale[0] && (this.x - this.size) < xscale[1] ) {
            if( (this.y - this.size) > yscale[0] && (this.y - this.size) < yscale[1] )
                return true;
        }
        // left down
        if( (this.x - this.size) > xscale[0] && (this.x - this.size) < xscale[1] ) {
            if( (this.y + this.size) > yscale[0] && (this.y + this.size) < yscale[1] )
                return true;
        }
        // right down
        if( (this.x + this.size) > xscale[0] && (this.x + this.size) < xscale[1] ) {
            if( (this.y + this.size) > yscale[0] && (this.y + this.size) < yscale[1] )
                return true;
        }
        // right up
        if( (this.x + this.size) > xscale[0] && (this.x + this.size) < xscale[1] ) {
            if( (this.y - this.size) > yscale[0] && (this.y - this.size) < yscale[1] )
                return true;
        }

        return false;
    }
};

var LandmineSet = {
    mines: [],
    /**
      * create a lot of mines from data
      * {Array} data
    */
    addLandminesFromData: function(data) {
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
      * {Array} xscale
      * {Array} yscale
     */
    destroyFromScale: function (xscale, yscale) {
        var newmines = [];
        this.mines.forEach(function(mine, index) {
           if( !mine.inScale(xscale, yscale) ) {
               newmines.push(mine);
           }
        });
        this.mines = newmines;
    },

};





