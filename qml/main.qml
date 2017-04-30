import QtQuick 2.7
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.0

import "SLCode.js" as SLCode

ApplicationWindow {
    visible: true
    width: 800
    height: 600
    title: qsTr("Hello World")

    MouseArea{
        id: mouseArea

    }
    Item {
        focus: true
        Keys.enabled: true
        Keys.onPressed: {
            switch(event.key) {
            case Qt.Key_W:
                slCanvas.py -= slCanvas.speed
                slCanvas.rotate = 180
                break;
            case Qt.Key_A:
                slCanvas.px -= slCanvas.speed
                slCanvas.rotate = 90
                break;
            case Qt.Key_S:
                slCanvas.py += slCanvas.speed
                slCanvas.rotate = 0
                break;
            case Qt.Key_D:
                slCanvas.px += slCanvas.speed
                slCanvas.rotate = 270
                break;
            }
        }
    }

    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(0.86, 0.86, 0.86, 1)
    }

    Canvas {
        id: slCanvas
        anchors.fill: parent
        antialiasing: true
        renderTarget: Canvas.FramebufferObject
        property int tankNum: 3
//        property var tankState: ({})
        property int px: 100
        property int py: 100
        property int rotate: 0
        property int speed: 10

        // 初始化
        onAvailableChanged: {
            if(available) {
                SLCode.init(this);
                updateTimer.running = true;
            }
        }
        // 绘制
        onPaint: {
            if(updateTimer.running)
                SLCode.paint(this);
        }

//        SequentialAnimation {
//            id: objAnimationX
//            loops: Animation.Infinite   // 重复循环
//            running: true
//            NumberAnimation {
//                target: slCanvas
//                property: "px"
//                from: 350.0
//                to: 30.0
//                duration: 3000
//                easing.type: Easing.InOutSine
//            }
//            NumberAnimation {
//                target: slCanvas
//                property: "px"
//                from: 30.0
//                to: 350.0
//                duration: 3000
//                easing.type: Easing.InOutSine
//            }
//        }
    }

    Timer {
        id: updateTimer
        interval: 1000/60
        running: false
        repeat: true
        onTriggered: {
            slCanvas.requestPaint();
//            slCanvas.markDirty(Qt.rect(0, 0, slCanvas.width, slCanvas.height));
        }
    }
}
