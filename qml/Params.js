var Params = {
    paramset: {},
    initializeParam: function() {
        var str = String(fileutil.getContent());
        this.paramset = JSON.parse(str);
    },
    /***
      * get param from Params
      * p  the key of Params
      * dv  default value if p is not property of Params
      **/
    getParam: function(p, dv) {
        if( this.paramset.hasOwnProperty(p) ) {
            return this.paramset[p];
        } else {
            this.paramset[p] = dv;
            return dv;
        }
    },
    setParam: function(k, v) {
        this.paramset[k] = v;
    },
    writeParams: function () {
        fileutil.write(JSON.stringify(this.paramset, null, " "));
    }
};

Params.initializeParam();

