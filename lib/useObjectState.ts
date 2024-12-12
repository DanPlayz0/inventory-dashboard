import { useCallback, useState } from "react";

type Handler<T> = Partial<T> | ((current: T) => Partial<T>);

export function useObjectState<T extends object>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  const handleUpdate = useCallback((arg: Handler<T>, reset?: boolean) => {
    if (reset) {
      setState(initialValue);
      return;
    }
    if (typeof arg === "function") {
      setState((s) => {
        const newState = arg(s);

        if (isPlainObject(newState)) throw new Error("Object is not plain.");

        return {
          ...s,
          ...newState,
        };
      });
    }

    if (isPlainObject(arg)) {
      setState((s) => ({
        ...s,
        ...arg,
      }));
    }
  }, []);

  return [state, handleUpdate] as const;
}

function isPlainObject(value: unknown) {
  return Object.prototype.toString.call(value) === "[object Object]";
}