import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getTabbable } from "./focus";
import { mergeRefs } from "./refs";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  it("owns its state when uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
    act(() => result.current[1](2));
    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("follows the parent when controlled", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 5 } },
    );
    act(() => result.current[1](6));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(6);
    rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });

  it("does not report a change when the value is the same", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: "a", onChange }));
    act(() => result.current[1]("a"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("mergeRefs", () => {
  it("assigns object refs and calls callback refs", () => {
    const objectRef = { current: null as string | null };
    const callback = vi.fn();
    mergeRefs<string>(objectRef, callback, undefined)("node");
    expect(objectRef.current).toBe("node");
    expect(callback).toHaveBeenCalledWith("node");
  });
});

describe("getTabbable", () => {
  it("skips disabled, negative tabindex and hidden elements", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <button id="a">a</button>
      <button id="b" disabled>b</button>
      <a id="c" href="#">c</a>
      <div id="d" tabindex="-1">d</div>
      <div hidden><button id="e">e</button></div>
      <input id="f" />
      <input id="g" type="hidden" />
      <span id="h" tabindex="0">h</span>
    `;
    expect(getTabbable(root).map((el) => el.id)).toEqual(["a", "c", "f", "h"]);
  });
});
