const CpEventBus = require("../event/event-bus");

const cpEventBus = new CpEventBus();

const handleTestEvent = (...res) => {
  console.log("onTest=", res);
};
//监听事件
cpEventBus.on("onTest", handleTestEvent);
//发送事件
cpEventBus.emit("onTest", 12, 13);
//只监听一次事件
cpEventBus.once("onOnce", handleTestEvent);
//发送事件
cpEventBus.emit("onOnce", 1, 2);
//发送事件
cpEventBus.emit("onOnce", 3, 4);
//移除事件
cpEventBus.off("onTest", handleTestEvent);
//监听事件
cpEventBus.emit("onTest", 123);
