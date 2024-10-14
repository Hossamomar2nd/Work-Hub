import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import "./Language.scss";
import $ from "jquery";
import { useState } from 'react';


export default function Languages() {
  var [selectedOptions, setSelectedOptions] = useState();
  const [inputValue, setInputValue] = useState('');

  const handleOptionChange = (event, newValue) => {
    setSelectedOptions(newValue);
    selectedOptions = newValue;
    console.log(newValue);
    console.log(selectedOptions);
  };

  const submit = () => {
    $(".MuiIconButton-sizeMedium").click();
  }

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={top100Languages}
        getOptionLabel={(option) => option}
        value={selectedOptions}
        onChange={handleOptionChange}
        // onInputChange={handleInputChange}
        // onClose={handleCloseAutocomplete}
        // filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            placeholder="Add Language"
          />
        )}
      />
    </Stack>
  );
}
const top100Languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Chinese",
  "Japanese",
  "Russian",
  "Italian",
  "Portuguese",
  "Hindi",
  "Bengali",
  "Punjabi",
  "Urdu",
  "Indonesian",
  "Turkish",
  "Dutch",
  "Polish",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Korean",
  "Thai",
  "Vietnamese",
  "Hebrew",
  "Czech",
  "Hungarian",
  "Romanian",
  "Slovak",
  "Malay",
  "Ukrainian",
  "Bulgarian",
  "Serbian",
  "Croatian",
  "Slovenian",
  "Lithuanian",
  "Estonian",
  "Latvian",
  "Maltese",
  "Albanian",
  "Macedonian",
  "Montenegrin",
  "Luxembourgish",
  "Icelandic",
  "Gaelic",
  "Welsh",
  "Basque",
  "Catalan",
  "Galician",
  "Esperanto",
  "Klingon",
  "Esperanto",
  "Latin",
];
