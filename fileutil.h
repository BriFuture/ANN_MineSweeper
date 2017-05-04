#ifndef FILEUTIL_H
#define FILEUTIL_H

#include <QObject>
#include <QFile>
#include <QTextStream>

class FileUtil: public QObject
{
    Q_OBJECT
private:
    QFile file;
    QString content;
    bool fileOpened;
public:
    FileUtil();
    ~FileUtil();
    FileUtil(const QString &file);
    Q_INVOKABLE QString read();
    Q_INVOKABLE QString getContent();
    Q_INVOKABLE bool write(const QString& data);
//    bool getOutStream(QTextStream *out);
//    void closeFile();
public slots:
    void setFile(const QString& file);
signals:
    void sourceChanged(const QString& file);
};

#endif // FILEUTIL_H
