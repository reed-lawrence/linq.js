import { List } from "./list";

export class GroupedList<T, U>{
  key: U;
  collection: List<T>;
  constructor(key: U, items: T[] = null) {
    this.key = key;
    if (items === null) {
      this.collection = new List<T>();
    } else {
      this.collection = new List<T>(items.map(i => i));
    }
  }
}