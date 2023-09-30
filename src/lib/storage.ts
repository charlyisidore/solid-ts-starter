import { createEffect, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

/**
 * Options for `create*StorageSignal()` and `create*StorageStore()`.
 */
type CreateStorageOptions<T> = {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

/**
 * Read initial value from a web storage.
 *
 * @param storage Object implementing the Web Storage API (e.g. `localStorage`).
 * @param key Key in the web storage.
 * @param defaultValue Default value.
 * @param deserialize Deserializer function.
 *
 * @returns Initial value.
 */
function getInitialValue<T>(
  storage: Storage,
  key: string,
  defaultValue: T,
  deserialize: (value: string) => T,
) {
  try {
    const value = storage.getItem(key);
    return value ? deserialize(value) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Create a reactive value that synchronizes with a web storage.
 *
 * @param createValue Function returning an accessor and a setter for a value.
 * @param storage Object implementing the Web Storage API (e.g. `localStorage`).
 * @param key Key in the web storage.
 * @param defaultValue Default value.
 * @param options Overrides serializer and deserializer functions.
 *
 * @returns An accessor, a setter, and a remover for the value.
 */
function createStorageValue<
  T,
  F extends (initialValue: T) => [() => unknown, unknown],
>(
  createValue: F,
  storage: Storage,
  key: string,
  defaultValue?: T,
  options?: CreateStorageOptions<T>,
): [ReturnType<F>[0], ReturnType<F>[1], () => void] {
  const serialize = options?.serialize ?? JSON.stringify;
  const deserialize = options?.deserialize ?? JSON.parse;

  const initialValue = getInitialValue(storage, key, defaultValue, deserialize);
  const [value, setValue] = createValue(initialValue);

  createEffect(() => storage.setItem(key, serialize(value())));

  return [value, setValue, () => storage.removeItem(key)];
}

/**
 * Create a signal that synchronizes with `localStorage`.
 *
 * @param key Key in `localStorage`.
 * @param defaultValue Default value.
 * @param options Overrides serializer and deserializer functions.
 *
 * @returns An accessor, a setter, and a remover for the value.
 */
export function createLocalStorageSignal<T>(
  key: string,
  defaultValue?: T,
  options?: CreateStorageOptions<T>,
) {
  return createStorageValue(
    createSignal<T>,
    localStorage,
    key,
    defaultValue,
    options,
  );
}

/**
 * Create a signal that synchronizes with `sessionStorage`.
 *
 * @param key Key in `sessionStorage`.
 * @param defaultValue Default value.
 * @param options Overrides serializer and deserializer functions.
 *
 * @returns An accessor, a setter, and a remover for the value.
 */
export function createSessionStorageSignal<T>(
  key: string,
  defaultValue?: T,
  options?: CreateStorageOptions<T>,
) {
  return createStorageValue(
    createSignal<T>,
    sessionStorage,
    key,
    defaultValue,
    options,
  );
}

/**
 * Create a store that synchronizes with `localStorage`.
 *
 * @param key Key in `localStorage`.
 * @param defaultValue Default value.
 * @param options Overrides serializer and deserializer functions.
 *
 * @returns An accessor, a setter, and a remover for the value.
 */
export function createLocalStorageStore<T extends object>(
  key: string,
  defaultValue?: T,
  options?: CreateStorageOptions<T>,
) {
  return createStorageValue(
    (initialValue) => {
      const [value, setValue] = createStore<T>(initialValue);
      return [() => value, setValue];
    },
    localStorage,
    key,
    defaultValue,
    options,
  );
}

/**
 * Create a store that synchronizes with `sessionStorage`.
 *
 * @param key Key in `sessionStorage`.
 * @param defaultValue Default value.
 * @param options Overrides serializer and deserializer functions.
 *
 * @returns An accessor, a setter, and a remover for the value.
 */
export function createSessionStorageStore<T extends object>(
  key: string,
  defaultValue?: T,
  options?: CreateStorageOptions<T>,
) {
  return createStorageValue(
    (initialValue) => {
      const [value, setValue] = createStore<T>(initialValue);
      return [() => value, setValue];
    },
    sessionStorage,
    key,
    defaultValue,
    options,
  );
}
