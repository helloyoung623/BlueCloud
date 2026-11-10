import assert from "node:assert/strict";
import { test } from "node:test";
import { getAvatarInitial } from "./avatar-initial.ts";

test("uppercases the first English character and preserves digits", () => {
  for (const [name, expected] of [["alice", "A"], ["Bob", "B"], ["9user", "9"], ["alice张", "A"]]) {
    assert.equal(getAvatarInitial(name), expected);
  }
});

test("uses the first Chinese character's uppercase pinyin initial", () => {
  for (const [name, expected] of [["张三", "Z"], ["吴那", "W"], ["钱桂英", "Q"], ["赵玉芝", "Z"], ["李冠英", "L"], ["孙雨薇", "S"], ["中文abc", "Z"], ["陳明", "C"]]) {
    assert.equal(getAvatarInitial(name), expected);
  }
});

test("ignores surrounding whitespace and handles missing display text", () => {
  assert.equal(getAvatarInitial("  bob  "), "B");
  assert.equal(getAvatarInitial(" 张三 "), "Z");
  assert.equal(getAvatarInitial(""), "");
  assert.equal(getAvatarInitial("   "), "");
});
