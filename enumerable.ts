import * as _ from 'lodash';
import { List } from './list';

export class Enumerable<T> implements IterableIterator<T> {
  protected _values: T[];
  private _from = 0;
  private _current = 0;

  get length(): number {
    return this._values.length;
  }

  constructor(items: Enumerable<T> | T[] = null) {
    if (items === undefined || items === null) {
      this._values = new Array();
    } else {
      this._values = new Array();
      for (let i = 0; i < items.length; i++) {
        this._values.push(items[i]);
        this[this._values.length - 1] = items[i];
      }
    }
  }

  /** ITERATOR METHODS */
  [index: number]: T;
  [Symbol.iterator](): IterableIterator<T> {
    this._current = this._from;
    return this;
  }
  next(): IteratorResult<T> {
    if (this._current < this._values.length) {
      return { done: false, value: this[this._current++] };
    } else {
      return { done: true, value: null }
    }
  }

  protected reIndexKeys(): void {
    for (let key of Object.keys(this)) {
      if (typeof key === 'number') {
        delete this[key];
      }
    }
    for (let i = 0; i < this._values.length; i++) {
      this[i] = this._values[i];
    }
  }

  /** END ITERATOR METHODS */

}