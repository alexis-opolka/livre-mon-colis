export function guard(arg: unknown): arg is object {
  return arg !== undefined;
}
