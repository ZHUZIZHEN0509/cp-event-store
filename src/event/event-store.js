const { isObject } = require("../utils/utils");
const {
  STATE_TYPE_ERROR,
  ACTIONS_TYPE_ERROR,
  ACTIONS_VALUE_TYPE_ERROR,
  KEY_TYPE_ERROR,
  KEY_IS_NOT_EXIST,
  CALLBACK_TYPE_ERROR,
  KEYS_TYPE_ERROR,
  KEYS_LEINGTH_ERROR,
} = require("../constants/constants");
const CpEventBus = require("./event-bus");

class CpEventStore {
  constructor(options) {
    const state = options.state;
    if (state && !isObject(state)) {
      throw TypeError(STATE_TYPE_ERROR);
    }
    const actions = options.actions;
    if (actions && !isObject(actions)) {
      throw TypeError(ACTIONS_TYPE_ERROR);
    }
    const actionsValue = Object.values(actions);
    for (const actionVal of actionsValue) {
      if (typeof actionVal !== "function") {
        throw TypeError(ACTIONS_VALUE_TYPE_ERROR);
      }
    }
    this.state = state;
    this._observe(this.state);
    this.actions = actions;
    this.eventV1 = new CpEventBus();
    this.eventV2 = new CpEventBus();
  }

  _observe(state) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        set(newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.eventV1.emit(key, _value);
          _this.eventV2.emit(key, { [key]: _value });
        },
        get() {
          return _value;
        },
      });
    });
  }

  onState(stateKey, callback) {
    const keys = Object.keys(this.state);
    if (typeof stateKey !== "string") {
      throw TypeError(KEY_TYPE_ERROR);
    }
    if (!keys.includes(stateKey)) {
      throw Error(KEY_IS_NOT_EXIST);
    }
    if (typeof callback !== "function") {
      throw TypeError(CALLBACK_TYPE_ERROR);
    }
    this.eventV1.on(stateKey, callback);
    const value = this.state[stateKey];
    callback.call(this.state, value);
  }

  onStates(stateKeys, callback) {
    const keys = Object.keys(this.state);
    if (!(stateKeys instanceof Array)) {
      throw TypeError(KEYS_TYPE_ERROR);
    }
    if (!stateKeys.length) {
      throw Error(KEYS_LEINGTH_ERROR);
    }
    if (typeof callback !== "function") {
      throw TypeError(CALLBACK_TYPE_ERROR);
    }
    const values = {};
    for (const key of stateKeys) {
      if (!keys.includes(key)) {
        throw Error(KEY_IS_NOT_EXIST);
      }
      values[key] = this.state[key];
      this.eventV2.on(key, callback);
    }
    callback.apply(this.state, [values]);
  }

  offState(stateKey, callback) {
    const keys = Object.keys(this.state);
    if (typeof stateKey !== "string") {
      throw TypeError(KEY_TYPE_ERROR);
    }
    if (!keys.includes(stateKey)) {
      throw Error(KEY_IS_NOT_EXIST);
    }
    for (const key of keys) {
      if (stateKey === key) {
        this.eventV1.off(key, callback);
        break;
      }
    }
  }

  offStates(stateKeys, callback) {
    const keys = Object.keys(this.state);
    if (!(stateKeys instanceof Array)) {
      throw TypeError(KEYS_TYPE_ERROR);
    }
    if (!stateKeys.length) {
      throw Error(KEYS_LEINGTH_ERROR);
    }
    for (const key of stateKeys) {
      if (!keys.includes(key)) {
        throw Error(KEY_IS_NOT_EXIST);
      }
      this.eventV2.off(key, callback);
    }
  }

  setState(key, value) {
    this.state[key] = value;
  }

  dispatch(actionKey, ...payLoad) {
    const keys = Object.keys(this.actions);
    if (typeof actionKey !== "string") {
      throw TypeError(KEY_TYPE_ERROR);
    }
    if (!keys.includes(actionKey)) {
      throw Error(KEYS_LEINGTH_ERROR);
    }
    const actionFn = this.actions[actionKey];
    actionFn.apply(this, [this.state, ...payLoad]);
  }
}

module.exports = CpEventStore;
