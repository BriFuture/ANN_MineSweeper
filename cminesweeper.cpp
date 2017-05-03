#include "cminesweeper.h"

void CMinesweeper::Update(vector<SVector2D> &mines) {
    // all inputs
    vector<double> inputs;

    SVector2D vClosestMine = GetClosestMine(mines);

    Vec2DNormalize(vClosestMine);
}
