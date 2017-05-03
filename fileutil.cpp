#include "fileutil.h"
#include <QTextStream>
#include <QDir>
#include <QDebug>

FileUtil::FileUtil()
{
    connect(this, SIGNAL(sourceChanged(QString)), this, SLOT(setFile(QString)));
}

FileUtil::FileUtil(const QString &file) {
    FileUtil();
    setFile(file);
}

FileUtil::~FileUtil() {

}

void FileUtil::setFile(const QString &file) {
    this->file.setFileName(QDir::currentPath()+QDir::separator()+file);
}

QString FileUtil::read() {
    if( !file.open(QIODevice::ReadOnly | QIODevice::Text) ) {

        return NULL;
    }
    QString str;
    while( !file.atEnd() ) {
        QByteArray line = file.readLine();
        if( line.startsWith("#") ) {
            continue;
        }
        str.append(line);
    }
    content = str;
    file.close();
    return str;
}

QString FileUtil::getContent() {
    if( content.isNull() ) {
        read();
    }
    return content;
}

bool FileUtil::write(const QString &data) {
    if( !file.open(QIODevice::WriteOnly | QIODevice::Text) ) {
        return false;
    }
    qDebug() <<  file.fileName();
    QTextStream out(&file);
    out << data << "\n";
    file.close();
    return true;
}
