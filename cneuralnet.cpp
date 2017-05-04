#include "cneuralnet.h"
#include "configutil.h"
#include <QDebug>


double RandomClamped(double range = 1, double start = 0) {
    double r = rand() / (0.0+RAND_MAX);
    return r*range+start;
}

SNeuron::SNeuron(int inputNum) : inputNum(inputNum+1) {
    // +1 means that valve value is considered
    for(int i=0; i < inputNum+1; ++i) {
        // 将权重初始化为任意的值
        weights.push_back(RandomClamped(2, -1));
    }
}


SNeuronLayer::SNeuronLayer(int neuronNum, int inputNumPerNeuron) : neuronNum(neuronNum), inputNumPerNeuron(inputNumPerNeuron) {
    for(int i = 0; i < neuronNum; i++) {
        neurons.push_back(SNeuron(inputNumPerNeuron));
    }
}

CNeuralNet::CNeuralNet() {
    inputNum  = config.readConfig("NeuralNet_inputNum", 4);
    outputNum = config.readConfig("NeuralNet_outputNum", 2);
    hiddenLayerNum      = config.readConfig("NeuralNet_hiddenLayerNum", 1);
    neuronsPerHiddenLyr = config.readConfig("NeuralNet_neuronsPerHiddenLyr", 4);
    maxPerturbation     = config.readConfig("maxPerturbation", 0.001);
    activationResponse  = config.readConfig("activationResponse", 1.0);
    bias = config.readConfig("bias", -1.0);
}

CNeuralNet::~CNeuralNet() {
//    config.writeConfig();
}

void CNeuralNet::CreateNet() {
    // 创建网络的各层
    if( hiddenLayerNum > 0 ) {
        // first layer
        layers.push_back(SNeuronLayer(neuronsPerHiddenLyr, inputNum));
        // other layer
        for(int i=0; i < hiddenLayerNum-1; i++) {
            layers.push_back(SNeuronLayer(neuronsPerHiddenLyr, neuronsPerHiddenLyr));
        }
        //创建输出层
        layers.push_back(SNeuronLayer(outputNum, neuronsPerHiddenLyr));
    } else {
        // 无隐藏层，则只有创建输出层
        layers.push_back(SNeuronLayer(outputNum, inputNum));
    }
}

vector<double> CNeuralNet::GetWeights() const {
    vector<double> weights;
    // include output layer
    for(int li = 0; li < hiddenLayerNum+1; li++) {
        SNeuronLayer layer = layers[li];
        for(int ni = 0; ni < layer.neuronNum; ni++) {
            SNeuron neuron = layer.neurons[ni];
            for(int wi = 0; wi < neuron.inputNum; wi++) {
                weights.push_back(neuron.weights[wi]);
//                qDebug() << neuron.weights[wi];
            }
        }
    }
//    qDebug() << "weights " << weights.size();
    return weights;
}

int CNeuralNet::GetNumberOfWeights() const {
    int number = 0;
    for(int li = 0; li < hiddenLayerNum+1; li++) {
        SNeuronLayer layer = layers[li];
        for(int ni = 0; ni < layer.neuronNum; ni++) {
            SNeuron neuron = layer.neurons[ni];
            number += neuron.inputNum;
        }
    }
    return number;
}

void CNeuralNet::PutWeights(vector<double> &weights) {
//    for(vector<double>::iterator iter = weights.begin(); iter != weights.end(); iter++) {
//    }
    int n = 0;
    for(int li = 0; li < hiddenLayerNum+1; li++) { // layer
        SNeuronLayer layer = layers[li];
        for(int ni = 0; ni < layer.neuronNum; ni++) {    // neuron
            SNeuron neuron = layer.neurons[ni];
            for(int wi = 0; wi < neuron.inputNum; wi++) {    // weight
                neuron.weights[wi] = weights[wi+n];
            }
            n += neuron.inputNum;
        }
    }
}

double CNeuralNet::Sigmoid(double activation, double response) {
    return 1 / (1 + exp(-activation/response));
}

vector<double> CNeuralNet::Update(vector<double> &inputs) {
    // 保存每层产生的输出
    vector<double> outputs;
    int cWeight = 0;
    // 检查输入的个数是否正确
    if( inputs.size() != inputNum ) {
        return outputs;
    }

    for(int i=0; i < hiddenLayerNum+1; i++) {
        if( i > 0 ) {
            inputs = outputs;
        }
        outputs.clear();

        // 每个神经细胞，求其输入和对应权重乘积的总和，并赋给S形函数
        for(int j = 0; j < layers[i].neuronNum; j++) {
            double netinput = 0;
            int NumInputs = layers[i].neurons[j].inputNum;

            for(int k = 0; k < NumInputs-1; k++) {
                netinput += layers[i].neurons[j].weights[k] * inputs[cWeight++];
            }

            // 加入偏移值
            netinput += layers[i].neurons[j].weights[NumInputs-1] * bias;
            /* 产生每层的输出后，就保存，先要通过S形函数的过滤，才能得到输出。*/
            outputs.push_back(Sigmoid(netinput, activationResponse));
            cWeight = 0;
        }
    }

    return outputs;
}
