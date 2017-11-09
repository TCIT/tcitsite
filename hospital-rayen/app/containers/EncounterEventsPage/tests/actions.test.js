
import {
  defaultAction, selectContact, addContact, editContact, removeContact
} from '../actions';
import {
  DEFAULT_ACTION, CONTACT_SELECTED, ADD_CONTACT, EDIT_CONTACT, REMOVE_CONTACT
} from '../constants';

describe('ContactList actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: DEFAULT_ACTION,
      };
      expect(defaultAction()).toEqual(expected);
    });
  });
  describe('Select Contact Action', () => {
    it('has a type of CONTACT_SELECTED', () => {
      const expected = {
        type: CONTACT_SELECTED,
      };
      expect(selectContact()).toEqual(expected);
    });
  });
  describe('Add Contact Action', () => {
    it('has a type of ADD_CONTACT', () => {
      const expected = {
        type: ADD_CONTACT,
      };
      expect(addContact()).toEqual(expected);
    });
  });
  describe('Edit Contact Action', () => {
    it('has a type of EDIT_CONTACT', () => {
      const expected = {
        type: EDIT_CONTACT,
      };
      expect(editContact()).toEqual(expected);
    });
  });
  describe('Remove Contact Action', () => {
    it('has a type of REMOVE_CONTACT', () => {
      const expected = {
        type: REMOVE_CONTACT,
      };
      expect(removeContact()).toEqual(expected);
    });
  });
});
