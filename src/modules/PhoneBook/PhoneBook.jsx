import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import toastr from 'toastr';

import PhoneBookForm from './PhoneBookForm/PhoneBookForm';
import ContactList from './ContactList/ContactList';
import PhoneBookFilter from './PhoneBookFilter/PhoneBookFilter';
import Box from 'shared/components/Box/Box';

import 'shared/utils/toastr-config';
import 'toastr/build/toastr.min.css';

const PhoneBook = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(localStorage.getItem('contacts'));

    return contacts ? contacts : [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const isDublicate = enteredName => {
    return contacts.some(
      ({ name }) => name.toLowerCase() === enteredName.toLowerCase()
    );
  };

  const addContact = ({ name, number }) => {
    if (isDublicate(name))
      return toastr.warning(`${name} is already in contacts`);

    setContacts(prevContacts => [
      { id: nanoid(), name, number },
      ...prevContacts,
    ]);
  };

  const deleteContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const onFilterChange = ({ target: { value } }) => {
    setFilter(value);
  };

  const getFilteredContacts = () => {
    const normilizedEnteredName = filter.toLowerCase();

    if (!filter) return contacts;

    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normilizedEnteredName)
    );
  };

  const filteredContacts = getFilteredContacts();

  return (
    <Box pt={50} pl={15} pr={15} textAlign="center" as="section">
      <h2>Phonebook</h2>
      <PhoneBookForm onSubmit={addContact} />
      {contacts.length ? (
        <Box border="1px solid black" pt={50} pb={50}>
          <PhoneBookFilter onChange={onFilterChange} filter={filter} />
          <h3>Contacts</h3>
          <ContactList
            filteredContacts={filteredContacts}
            onDelBtnClick={deleteContact}
          />
          {Boolean(filter && !filteredContacts.length) && (
            <p>No matches found</p>
          )}
        </Box>
      ) : (
        <p>You haven`t any contacts added yet</p>
      )}
    </Box>
  );
};

export default PhoneBook;
