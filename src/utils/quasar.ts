export function required() {
  return (val: string | number) => {
    if (typeof val === "string") val = val.trim();
    if (!val && val !== 0) return "Required";
    return true;
  };
}

export function gt(min: number) {
  return (val: number) => {
    if (typeof val === "number" && val > min) return true;
    return `Value must be greater than ${min}`;
  };
}

export function gte(min: number) {
  return (val: number) => {
    if (typeof val === "number" && val >= min) return true;
    return `Value must be greater than or equal to ${min}`;
  };
}

export function lt(max: number) {
  return (val: number) => {
    if (typeof val === "number" && val < max) return true;
    return `Value must be less than ${max}`;
  };
}

export function lte(max: number) {
  return (val: number) => {
    if (typeof val === "number" && val <= max) return true;
    return `Value must be less than or equal to ${max}`;
  };
}

export function minLength(min: number) {
  return (val: string) => {
    if (typeof val === "string" && val.length >= min) return true;
    return `Value must be at least ${min} characters long`;
  };
}

export function maxLength(max: number) {
  return (val: string) => {
    if (typeof val === "string" && val.length <= max) return true;
    return `Value must be at most ${max} characters long`;
  };
}

export function int() {
  return (val: number) => {
    if (Number.isInteger(val)) return true;
    return "Value must be an integer";
  };
}
