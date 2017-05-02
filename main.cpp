#include <QGuiApplication>
#include <QQuickView>
#include <QQmlContext>
#include "fileutil.h"

int main(int argc, char *argv[])
{
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QGuiApplication app(argc, argv);

    FileUtil fu("config.ini");
//    fu.write("some test!");

//    QQmlApplicationEngine engine;
//    engine.
    QQuickView *view = new QQuickView;
    view->rootContext()->setContextProperty("fileutil", &fu);
    view->setSource(QUrl(QLatin1String("qrc:/qml/main.qml")));
    view->setTitle("SL");
    view->show();

    return app.exec();
}
