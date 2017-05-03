#include <QGuiApplication>
#include <QQuickView>
#include <QQmlContext>
#include "fileutil.h"
#include "cneuralnet.h"
#include <ctime>

int main(int argc, char *argv[])
{
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QGuiApplication app(argc, argv);

    srand((int) time(0));
    FileUtil fu("config-js.ini");
    CNeuralNet neuralnet;
    neuralnet.CreateNet();
    neuralnet.GetWeights();

    QQuickView *view = new QQuickView;
    view->rootContext()->setContextProperty("fileutil", &fu);
    view->rootContext()->setContextProperty("windowContainer", view);
    view->setSource(QUrl(QLatin1String("qrc:/qml/main.qml")));
    view->setTitle("SL");
    view->show();

    return app.exec();
}
