// neural cell
var Neuron = {
    inputNum: 0, // the number of inputs
    weights: [], // weight of each input
    /**
     * {int} inputNum
     */
    build: function(inputNum) {
        this.inputNum = inputNum;
        // it includes valve value, so one more than inputNum
        for (var i = 0; i < inputNum + 1; i++) {
            // -1 ~ 1
            this.weights.push(Math.random() * 2 - 1);
        }
        return this;
    }
};

// neural layer (just one layer) which contains a layer of cells
var NeuronLayer = {
    neurons: [], // neurons belong to this layer
    /**
     * {int} neuronNum
     * {int} inputNumPerNeuron      it now indicates that input number of each neuron is the same
     */
    build: function(neuronNum, inputNumPerNeuron) {
        for (var i = 0; i < neuronNum; i++) {
            this.neurons.push(Neuron.build(inputNumPerNeuron));
        }
        return this;
    },

    getNeuronNum: function() {
        return neurons.length;
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

var Params = {
    bias: 1,
    activationResponse: 1,
    maxPerturbatlon: 0.001,
};

// whole net which contains a lot of nerual cells and layers
var NeuralNet = {
    inputNum: 0, // input layer's input number(not cell)
    outputNum: 0, // output layer's cell
    hiddenLayers: 0, // number of hidden layer
    neuronsPerHiddenLayer: 0,
    /**
     * {NeuronLayer} layers
     */
    layers: [], // contains all layers (include output layer)

    /**
     * {String} file  path of the file
     **/
    build: function(file) {

    },

    /**
     * create net from neuron
     **/
    createNet: function() {
        if (this.hiddenLayers > 0) {
            // first, input layer(of course it is not in hidden layers)
            this.layers.push(NeuronLayer.build(neuronsPerHiddenLayer, inputNum));

            for (var i = 0; i < hiddenLayers - 1; i++) {
                this.layers.push(NeuronLayer.build(neuronsPerHiddenLayer, neuronsPerHiddenLayer));
            }

            this.layers.push(NeuronLayer.build(outputNum, neuronsPerHiddenLayer));
        } else {
            this.layers.push(NeuronLayer(outputNum, inputNum));
        }
    },

    // get the weight of NeuralNet
    getWeights: function() {

    },
    getNumberOfWeights: function() {
        var number = 0;

        this.layers.forEach(function(layer, i) {
            layer.forEach(function(neuron, ii) {
                number += neuron.weights.num;
            });
        });

        return number;
    },

    /**
     * {Array} weights
     */
    putWeights: function(weights) {
        this.weights = weights;
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

        for (var i = 0; i < hiddenLayers; i++) {
            if (i > 0) {
                inputs = outputs;
            }
            outputs = [];
            weight = 0;

            // compute sum of input * weight of each cell which need to be handled with sigmoid function
            for (var j = 0; j < this.layers[i].getNeuronNum(); j++) {
                var netinput = 0;
                var neuron = this.layers[i].neurons[j];

                for (var k = 0; k < inputNum - 1; k++) {
                    netinput += neuron.weights[k] * inputs[weight++];
                }

                // valve value
                netinput += neuron.weights[inputNum - 1] * Params.bias;
                // compute the sum all output, and handle it with sigmoid() function
                outputs.push(sigmoid(netinput, Params.activationResponse));
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
                chromo[i] += (Math.random() * Params.maxPerturbatlon);
            }
        }
    }
}