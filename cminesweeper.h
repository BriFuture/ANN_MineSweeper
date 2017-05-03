#ifndef CMINESWEEPER_H
#define CMINESWEEPER_H

#include "cneuralnet.h"

class CMinesweeper {
private:
    // neural network
    CNeuralNet m_ItsBrain;
    // position of minesweeper in world coord
    SVector2D m_vPosition;
    // minesweeper's face
    SVector2D m_vLookAt;
    // rotate
    double m_dRotation;

    double m_dSpeed;

    // save output with ANN
    double m_lTrack;
    double m_rTrack;

    // fitness score
    double m_dFitness;
    // scale of model when drawed
    double m_dScale;
    // the cllosest mine's index
    int m_iClosestMine;

public:
    CMinesweeper();

    // update ANN with information from environment of sweeper
    bool Update(vector<SVector2D> &mines);

    // swap all vertices of sweeper, and then draw it
    void WorldTransform(vector<SPoint> &sweeper);

    //
    SVector2D GetClosestMine(vector<SVector2D> &objects);

    int CheckForMine(vector<SVector2D> &mines, double size);

    void Reset();

    SVector2D Position()const {return m_vPosition;}
    void IncrementFitness(double val) {m_dFitness += val; }
    double getFitness()const {return m_dFitness;}

    void PutWeights(vector<double> &w) {m_ItsBrain.PutWeights(w);}
    int GetNumberOfWeights() const { return m_ItsBrain.GetNumberOfWeights();}
};

#endif // CMINESWEEPER_H
