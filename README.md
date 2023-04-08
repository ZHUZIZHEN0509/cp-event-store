# cp-event-store
Cross-platform eventBus and eventStore（跨平台的eventBus和eventStore）

## **Table of Contents**

1. [Installation](###Installation)
2. [Usage](###Usage)

### Installation

Installation is done using the npm install command:

```
$ npm install cp-event-store
```

### Usage

（1）event-bus（事件总线）

```
const CpEventBus = require("cp-event-bus");

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
```

（2）event-store（数据共享）

```
const CpEventStore = require("cp-event-store");

const cpEventStore = new CpEventStore({
  state: {
    name: "张三",
    age: 13,
    like: ["西瓜", "香蕉"],
  },
  actions: {
    changeName(state, payLoad) {
      console.log("payload=", state.name, payLoad);
      state.name = payLoad;
    },
    changeLike(state, payLoad) {
      console.log("payload=", state.like, payLoad);
      state.like = payLoad;
    },
  },
});
const handleNameState = (name) => {
  console.log("statename=", name);
};

//监听state中name的数据
cpEventStore.onState("name", handleNameState);
const handleStates = (data) => {
  console.log("states=", data);
};
//监听state中name和age数据
cpEventStore.onStates(["name", "age"], handleStates);
//移除监听
cpEventStore.offState("name", handleNameState);
//移除多个key的监听
cpEventStore.offStates(["name", "age"], handleStates);
//修改state数据
cpEventStore.dispatch("changeName", 1, 2);
cpEventStore.dispatch("changeName", { name: 123 });

//设置state数据
cpEventStore.setState("name", "李白");
```

