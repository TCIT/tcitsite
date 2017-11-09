
export const isRequired = fieldName => `${fieldName} es requerido`;

// Se encapsula la llamada con el otro campo a comparar
export const mustMatch = otherFieldName => {
  return (fieldName) => `${fieldName} debe calzar con ${otherFieldName}`;
};

export const minLength = length => {
  return (fieldName) => `${fieldName} debe tener al menos ${length} caracteres`;
};


