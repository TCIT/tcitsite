import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.components.CleanModal.title',
    defaultMessage: '¿Descartar [FORM]?'
  },
  body: {
    id: 'app.components.CleanModal.body',
    defaultMessage: 'Se descartará la información ingresada y no se agregará a la ficha clínica.'
  },
  ok: {
    id: 'app.components.CleanModal.ok',
    defaultMessage: 'Descartar'
  },
  cancel: {
    id: 'app.components.CleanModal.cancel',
    defaultMessage: 'Volver'
  },
});
