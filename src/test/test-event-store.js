const CpEventStore = require("../event/event-store");

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
