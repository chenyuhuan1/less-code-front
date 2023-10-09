import { isObject } from 'utils'
export default class Result {
  constructor(ret) {
    if (ret && isObject(ret)) {
      Object.assign(this, ret)
    }
  }

  isSuccess() {
    return this.code && this.code === '0'
  }
}
