/*
 * ActionModal Messages
 *
 * This contains all the text for the ActionModal component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.components.ActionModal.header',
    defaultMessage: 'Advertencia',
  },
  headerDeleteOne: {
    id: 'app.components.ActionModal.headerDeleteOne',
    defaultMessage: 'Eliminar Contacto',
  },
  headerDeleteMany: {
    id: 'app.components.ActionModal.headerDeleteMany',
    defaultMessage: 'Eliminar Contactos',
  },
  body: {
    id: 'app.components.ActionModal.body',
    defaultMessage: '¿Deseas proseguir?',
  },
  bodyDeleteOne: {
    id: 'app.components.ActionModal.bodyDeleteOne',
    defaultMessage: '¿Deseas eliminar este contacto?',
  },
  bodyDeleteMany: {
    id: 'app.components.ActionModal.bodyDeleteMany',
    defaultMessage: '¿Deseas eliminar estos contactos?',
  },
  bodyBackform: {
    id: 'app.components.ActionModal.bodyBackform',
    defaultMessage: '¿Deseas volver al home? Se perderan tus cambios',
  },
  actionDelete: {
    id: 'app.components.ActionModal.actionDelete',
    defaultMessage: 'Eliminar',
  },
  action: {
    id: 'app.components.ActionModal.action',
    defaultMessage: 'Si',
  },
  cancel: {
    id: 'app.components.ActionModal.cancel',
    defaultMessage: 'Cancelar',
  },
});
