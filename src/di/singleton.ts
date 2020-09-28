import {Newable} from "ts-essentials";
import {injectable} from "tsyringe";

import {container} from "./container";

export function singleton<T>(token: symbol): (target: Newable<T>) => void {
  return (target) => {
    injectable()(target);
    container.registerSingleton(token, target);
  };
}
