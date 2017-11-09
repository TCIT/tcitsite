import React from 'react';
import { Avatar, FontIcon, TextField, List, ListItem } from 'react-md';
import { CircularProgress } from 'react-md';

export default function CacheSearch({label, searchTextValue, onChangeSearch, primaryDescCode, secondaryDescCode, onSelect, resultObjects, selectedObject, searching}) {
  return <div>
    <TextField
      type="text"
      label={label}
      value={searchTextValue}
      fullWidth={true}
      onChange={onChangeSearch}
    />
    {resultObjects.length > 0 &&
      <List style={{position: 'absolute', zIndex: 9}} className="md-cell md-cell--11 md-paper md-paper--1 autocomplete-list">
        {resultObjects.map(resultObject =>
          <ListItem
            leftAvatar={<Avatar suffix="amber" icon={<FontIcon>local_pharmacy</FontIcon>} />}
            primaryText={resultObject[primaryDescCode]}
            secondaryText={resultObject[secondaryDescCode]}
            onClick={() => onSelect(resultObject)}
          />)
        }
      </List>
    }
    {searching && 
      <CircularProgress />
    }
  </div>;
}