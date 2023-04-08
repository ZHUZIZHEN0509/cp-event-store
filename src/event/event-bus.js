const { handleError } = require("../utils/utils");
const {
  EVENT_NAME_TYPE_ERROR,
  CALLBACK_TYPE_ERROR,
} = require("../constants/constants");

const handleCommonError = (eventName, callback, isCallback = true) => {
  if (typeof eventName === "") return;
  if (typeof eventName !== "string") {
    handleError(EVENT_NAME_TYPE_ERROR);
  }
  if (isCallback && typeof callback !== "function") {
    handleError(CALLBACK_TYPE_ERROR);
  }
};

class CpEventBus {
  constructor() {
    this.eventbus = {};
  }

  on(eventName, callback, thisArgs) {
    handleCommonError(eventName, callback);
    let handles = this.eventbus[eventName];
    if (!handles) {
      handles = [];
      this.eventbus[eventName] = handles;
    }
    handles.push({
      callback,
      thisArgs,
    });
    return this;
  }

  once(eventName, callback, thisArgs) {
    handleCommonError(eventName, callback);
    const handleOnceFn = (...args) => {
      callback.apply(thisArgs, args);
      this.off(eventName, handleOnceFn);
    };
    return this.on(eventName, callback, thisArgs);
  }

  emit(eventName, ...payLoad) {
    handleCommonError(eventName, undefined, false);
    let handles = this.eventbus[eventName];
    if (!handles || !handles.length) return;
    payLoad ||= [];
    handles.forEach(({ callback, thisArgs }) => {
      callback.apply(thisArgs, payLoad);
    });
    return this;
  }

  off(eventName, callback) {
    handleCommonError(eventName, callback);
    let handles = this.eventbus[eventName];
    if (!handles) return;
    if (!handles.length) {
      delete this.eventbus[eventName];
      return;
    }
    const targetIndex = handles.findIndex((item) => item.callback === callback);
    if (targetIndex !== -1) {
      handles.splice(targetIndex, 1);
    }
  }
}

module.exports = CpEventBus;
