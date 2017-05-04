#include "configutil.h"
#include <QDebug>
#include <QStringList>
#include <QTextStream>

const QString ConfigUtil::file = "config.ini";
const QString ConfigUtil::seperator = "\n\r";
const QString ConfigUtil::space = "  ";
ConfigUtil::ConfigUtil()
{
    map = new QMap<QString, double>;
    fu.setFile(file);
    QString str = fu.read();
    QStringList list = str.split(seperator, QString::SkipEmptyParts);
    for(int i = 0; i < list.size(); i++) {
        QString str = list.at(i);
        str = str.trimmed();
        QStringList l = str.split(space);
        map->insert(l.at(0), l.at(1).toDouble());
    }

}

ConfigUtil::~ConfigUtil() {

}

/***
 * read config from config.ini
 */
double ConfigUtil::readConfig(QString key, double defaultValue) {
    if( !map->contains(key) ) {
        map->insert(key, defaultValue);
    }
    return map->value(key, defaultValue);
}

void ConfigUtil::writeConfig() {
//    fu.write("test");
    QStringList stringlist;
    QMap<QString, double>::const_iterator it = map->constBegin();
    while( it != map->constEnd() ) {
        stringlist << it.key() + space + QString::number(it.value());
        it++;
    }
    QString s = stringlist.join(seperator);
    fu.write(s);
}
