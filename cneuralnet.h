#ifndef CNEURALNET_H
#define CNEURALNET_H

#include <iostream>
#include <vector>
#include <cmath>
#include "configutil.h"

using namespace std;

struct SNeuron {
    // 输入个数
    int inputNum;
    // 每一个输入的权重
    vector<double> weights;
    SNeuron(int NumInputs);
};


struct SNeuronLayer {
    // 本层的神经细胞数目
    int neuronNum;
    int inputNumPerNeuron;
    // 神经细胞的层
    vector<SNeuron> neurons;

    SNeuronLayer(int neuronNum, int inputNumPerNeuron);
};


struct SGenome {
    vector<double> vecWeights;
    double dFitness;
    SGenome():dFitness(0) {}
    SGenome(vector<double> w, double f):vecWeights(w), dFitness(f) {}

    // reload '<' order signal
    friend bool operator <(const SGenome & lhs, const SGenome & rhs) {
        return (lhs.dFitness < rhs.dFitness);
    }
};

class CNeuralNet {
private:
    int inputNum; // input
    int outputNum;  // output
    int hiddenLayerNum; // hiddenLayer
    int neuronsPerHiddenLyr;
    // 为每一层（包括输出层）存放所有神经细胞的存储器
    vector<SNeuronLayer> layers;
    ConfigUtil config;

public:
    CNeuralNet();
    ~CNeuralNet();
    // 由 SNeurons 创建网络
    void CreateNet();
    // 从神经网络读出权重
    vector<double> GetWeights() const;
    // 返回网络权重总数
    int GetNumberOfWeights() const;
    void PutWeights(vector<double> &weights);
    // S 形响应曲线
    inline double Sigmoid(double activation, double response);
    // 当已知神经细胞所有输入
    vector<double> Update(vector<double> &inputs);
};

#endif // CNEURALNET_H
