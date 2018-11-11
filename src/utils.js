export function resolveToLast(type /*: MemberExpression | Obj | Id*/) {
  switch (type.kind) {
    case 'id':
    case 'object':
    case 'import':
      return type;
    case 'memberExpression':
      return resolveToLast(type.object);
    default:
      console.error(
        `Unexpected initial type of member expression`,
        JSON.stringify(type),
      );
      break;
  }
}

export function resolveFromGeneric(type) {
  if (type.kind !== 'generic') return type;
  if (type.typeParams) {
    // If a generic type is an Array, we don't want to just return the value,
    // But also the entire type object, so we can parse the typeParams later on.
    return type;
  }
  if (type.value.kind === 'generic') {
    return resolveFromGeneric(type.value);
  }
  return type.value;
}

export function reduceToObj(type) {
  if (type.kind === "generic") {
    return reduceToObj(type.value);
  } else if (type.kind === "object") {
    return type.members;
  } else if (type.kind === "intersection") {
    return type.types.reduce((acc, i) => [...acc, ...reduceToObj(i)], []);
  }
  // eslint-disable-next-line no-console
  console.warn("was expecting to reduce to an object and could not", type);
  return [];
}