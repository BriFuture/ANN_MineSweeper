Qt.include("Params.js")

/*
 * neural cell, which may contain a lot of inputs and just one output 
 */
var Neuron = {
    inputNum: 0, // the number of inputs
    weights: [], // weight of each input
    /**
     * {int} inputNum
     */
    build: function(inputNum) {
        var n = Object.create(Neuron);
        n.inputNum = inputNum;
        n.weights = [];
        // it includes valve value, so there is one more than inputNum
        for (var i = 0; i < inputNum + 1; i++) {
            // -1 ~ 1
            n.weights.push(Math.random() * 2 - 1);
        }
//        console.log( n.inputNum + "  " + n.weights.length + " ==> " + n.weights);
        return n;
    }
};

// neural layer (just one layer) which contains a layer of cells
var NeuronLayer = {
    neurons: [], // neurons belong to this layer
    /**
     * {int} neuronNum
     * {int} inputNumPerNeuron      it now indicates that input number of each neuron in this layer is the same
     */
    build: function(neuronNum, inputNumPerNeuron) {
        this.neurons = [];
        for (var i = 0; i < neuronNum; i++) {
            this.neurons.push(Neuron.build(inputNumPerNeuron));
        }
        return this;
    },

    getNeuronNum: function() {
        return this.neurons.length;
    }
};

var Genome = {
    weights: [], //
    fitness: 0, // fitness score
    /**
     * {Array}  w
     * {double} f
     * return
     */
    build: function(w, f) {
        this.weights = w;
        this.fitness = f;
        return this;
    },
    /**
     * {Genome} comp
     */
    lessThan: function(comp) {
        return this.fitness < comp.fitness;
    }
};

// whole net which contains a lot of nerual cells and layers
var NeuralNet = {
    inputNum: 0, // input layer's input number(not cell)
    outputNum: 0, // output layer's cell
    hiddenLayers: 0, // number of hidden layer, exclude output layer
    neuronsPerHiddenLayer: 0,
    weights: [],
    /**
     * {NeuronLayer} layers
     */
    layers: [], // contains all layers (include output layer)

    /**
     * config file's path is set by fileutil
     **/
    build: function() {
        this.inputNum = Params.getParam("NeuralNet_inputNum", 4);
        this.outputNum = Params.getParam("NeralNet_outputNum", 2);
        this.hiddenLayers = Params.getParam("NeuralNet_hiddenLayers", 1);
        this.neuronsPerHiddenLayer = Params.getParam("NeuralNet_neuronsPerHiddenLayer", 4);
        this.createNet();
        this.weights = Params.getParam("NeuralNet_weights", []);
        if( this.weights.length === this.getNumberOfWeights() ) {
//            console.log(this.weights)
            this.putWeights(this.weights);
        } else {
            Params.setParam("NeuralNet_weights", this.getWeights());
        }
//        console.log(this.weights.length+ " ===  " + this.getNumberOfWeights() + "  " + Params.getParam("NeuralNet_weights",[]))

        return this;
    },

    /**
     * create net from neuron,
     * it simplified the compution of creating a net (you may want to different the number of neural cells and the number of neural's inputs, but here they are the same)
     **/
    createNet: function() {
        if ( this.hiddenLayers > 0 ) {
            // first layer(of course it is not in hidden layers)
            this.layers.push(NeuronLayer.build(this.neuronsPerHiddenLayer, this.inputNum));
            // other layer
            for (var i = 0; i < this.hiddenLayers-1; i++) {
                // it means the input number of each neural cell is the same as the number of neural cell in this layer
                this.layers.push(NeuronLayer.build(this.neuronsPerHiddenLayer, this.neuronsPerHiddenLayer));
            }
            // output layer's input number is the same as the number of neural cell in hidden layer
            this.layers.push(NeuronLayer.build(this.outputNum, this.neuronsPerHiddenLayer));
        } else {
            // connect output layer and input layer directly
            this.layers.push(NeuronLayer.build(this.outputNum, this.inputNum));
//            console.log(this.layers[0].neurons.length);
        }
    },

    /**
     * get the weight of NeuralNet
     * it is coded as a serialized data
    */
    getWeights: function() {
        var weights = [];
        this.layers.forEach(function(layer) { // each neural layer
            layer.neurons.forEach(function(neuron) { // each neural cell
                weights.push.apply(weights, neuron.weights);
            })
        });

        return weights;
    },

    getNumberOfWeights: function() {
        return this.getWeights().length;
    },

    /**
     * {Array} weights
     */
    putWeights: function(weights) {
//        this.weights = weights;
        var n = 0;
        this.layers.forEach(function(layer) {
            layer.neurons.forEach(function(neuron) {
                neuron.weights = weights.slice(n, n + neuron.inputNum);
                n += neuron.inputNum;
            });
        });
        return this;
    },

    /**
     * S response curve
     * {double} activation
     * {double} response
     */
    sigmoid: function(activation, response) {
        return 1 / (1 + Math.pow(Math.E, -activation / response));
    },

    /**
     * {Array} inputs
     */
    update: function(inputs) {
        // output of each layer
        var outputs = [];
        var weight = 0;

        if (inputs.length !== this.inputNum) {
            return outputs;
        }

        for (var i = 0; i < this.hiddenLayers; i++) {
            if (i > 0) {
                inputs = outputs;
                console.log("input: " + inputs);
            }
            outputs = [];
            weight = 0;

            // compute sum of input * weight of each cell which need to be handled with sigmoid function
            for (var j = 0; j < this.layers[i].getNeuronNum(); j++) {
                var netinput = 0;
                var neuron = this.layers[i].neurons[j];

                for (var k = 0; k < this.inputNum - 1; k++) {
                    netinput += neuron.weights[k] * inputs[weight++];
                }

                // valve value
                netinput += neuron.weights[this.inputNum - 1] * Params.getParam("bias", 1);
                // compute the sum all output, and handle it with sigmoid() function
                outputs.push(this.sigmoid(netinput, Params.getParam("activationResponse", 1)));
                weight = 0;
            }
        }

        return outputs;
    }
};

var GenAlg = {
    mutationRate: 0.7,
    /**
     * {Array} chromo
     */
    mutate: function(chromo) {
        for (var i = 0; i < chromo.length; i++) {
            if (Math.random() < this.mutationRate) {
                chromo[i] += (Math.random() * Params.getParam("maxPerturbatlon", 0.001));
            }
        }
    }
}
