#include "configutil.h"
#include <QDebug>

const QString ConfigUtil::file = "config.ini";

ConfigUtil::ConfigUtil()
{
    map = new QMap<QString, double>;
    fu.setFile(file);
//    qDebug() << fu.read();
}

ConfigUtil::~ConfigUtil() {

}

/***
 * read config from config.ini
 */
double ConfigUtil::readConfig(QString key, double defaultValue) {
    return map->value(key, defaultValue);
}

void ConfigUtil::writeConfig() {
    fu.write("test");
}
