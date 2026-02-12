import { SimpleCache } from "../src/utils/SimpleCache";

test("returns null for missing keys", () => {
    const cache = new SimpleCache({ ttlMs: 1000 });
    expect(cache.get("missing")).toBeNull();
});

test("returns stored value before expiry", () => {
    const cache = new SimpleCache({ ttlMs: 1000 });
    cache.set("k", { a: 1 });
    expect(cache.get("k")).toEqual({ a: 1 });
});

test("expires values after ttlMs", () => {
    const cache = new SimpleCache({ ttlMs: 1 });
    cache.set("k", "v");

    const hit = cache.store.get("k");
    hit.expiresAt = Date.now() - 1;

    expect(cache.get("k")).toBeNull();
    expect(cache.store.has("k")).toBe(false);
});
