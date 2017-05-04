#ifndef CONFIGUTIL_H
#define CONFIGUTIL_H

#include <QObject>
#include <QMap>
#include "fileutil.h"

class ConfigUtil : public QObject
{
    Q_OBJECT
public:
    static const QString file;
    static const QString seperator;
    static const QString space;
private:
    QMap<QString, double> *map;
    FileUtil fu;

public:
    ConfigUtil();
    ~ConfigUtil();
    double readConfig(QString key, double defaultValue);
    void writeConfig();
};

#endif // CONFIGUTIL_H
