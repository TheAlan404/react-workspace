export type Vec2 = {
    x: number;
    y: number;
};

interface Vec2Contructor {
    (x?: number, y?: number): Vec2;
    (vec: Partial<Vec2>, _: never): Vec2;
};

export const vec2t = (v?: number) => vec2(v, v);
export const vec2: Vec2Contructor = (x, y) => {
    if(typeof x == "object") return { x: x.x || 0, y: x.y || 0 };
    return { x: x || 0, y: y || 0 };
}

export const vec2client = ({ clientX, clientY }: { clientX: number; clientY: number }) =>
    vec2(clientX, clientY);

export type Vec2Like = Vec2 | number | null | undefined;
const asVec2 = (x: Vec2Like) => typeof x == "object" ? x : vec2t(x);

export const vec2add = (...vecs: Vec2Like[]) => {
    return vecs.map(asVec2).reduce((acc, cur) => vec2(acc.x + cur.x, acc.y + cur.y));
};

export const vec2mul = (...vecs: Vec2Like[]) => {
    return vecs.map(asVec2).reduce((acc, cur) => vec2(acc.x * cur.x, acc.y * cur.y));
};

export const vec2sub = (a: Vec2Like, b: Vec2Like) =>
    vec2add(a, vec2mul(b, -1));

export const vec2div = (a: Vec2Like, b: Vec2Like) => {
    let _a = asVec2(a);
    let _b = asVec2(b);
    return vec2(_a.x / _b.x, _a.y / _b.y);
};

export const vec2average = (vecs: Vec2Like[]) =>
    vec2div(vec2add(...vecs), vecs.length);

export const vec2middle = (a: Vec2Like, b: Vec2Like) =>
    vec2average([a, b]);

export const vec2distance = (a: Vec2Like, b: Vec2Like) => {
    let _a = asVec2(a);
    let _b = asVec2(b);
    return Math.sqrt((_a.x - _b.x) ** 2 + (_a.y - _b.y) ** 2);
};

export const vec2apply = (vec: Vec2Like, fn: (v: number) => number) => {
    let _vec = asVec2(vec);
    return vec2(fn(_vec.x), fn(_vec.y));
};

export const vec2round = (vec: Vec2Like) => vec2apply(vec, Math.round);
export const vec2floor = (vec: Vec2Like) => vec2apply(vec, Math.floor);
export const vec2ceil = (vec: Vec2Like) => vec2apply(vec, Math.ceil);
