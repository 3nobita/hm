import React from "react";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment/moment";

export const textField = (data) => {
  return (
    <TextField
      className="input-field"
      multiline={!!data?.multiLine}
      rows={data?.multiLine || 1}
      required={true}
      label={data.label}
      name={data.key}
      autoComplete={data.key}
      value={data?.value}
      onChange={(e) => data.onChange(data.key, e.target.value)}
      helperText={data?.error}
    />
  );
};
export const numberField = (data) => {
  return (
    <TextField
      className="input-field"
      type="number"
      required={true}
      label={data.label}
      name={data.key}
      autoComplete={data.key}
      value={data?.value}
      onChange={(e) => data.onChange(data.key, e.target.value)}
      helperText={data?.error}
    />
  );
};
export const radioField = (data) => {
  return (
    <FormControl className="radio-wrap">
      <FormLabel id={data.key}>{data.label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={data.key}
        name={data.key}
        value={data?.value}
        onChange={(e) => data.onChange(data.key, e.target.value)}
      >
        {data?.options &&
          data.options.map((ele, i) => (
            <FormControlLabel
              key={i}
              control={<Radio />}
              label={ele?.label || ele}
              value={ele?.value || ele}
              style={{ fontSize: 23 }}
            />
          ))}
      </RadioGroup>
      <FormHelperText>{data?.error}</FormHelperText>
    </FormControl>
  );
};
export const checkboxField = (data) => {
  return (
    <FormControl className="checkbox-wrap">
      <FormLabel id={data.key}>{data.label}</FormLabel>
      <FormGroup row>
        {data?.options &&
          data.options.length > 0 &&
          data.options.map((ele, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  style={{ fontSize: 23 }}
                  name={data.key}
                  checked={data?.value ? data?.value.includes(ele) : false}
                  value={ele}
                  onChange={(e) => {
                    data.onChange(
                      data.key,
                      e.target.checked
                        ? [...(data.value || []), ele]
                        : data.value.filter((e) => e != ele)
                    );
                  }}
                />
              }
              label={ele}
            />
          ))}
        <FormHelperText style={{ width: "100%" }}>{data?.error}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};
export const selectField = (data) => {
  return (
    <Autocomplete
      className="select-wrap"
      value={data.value}
      onChange={(e, val) =>
        data.onChange(data.key, typeof val === "object" ? val.value : val)
      }
      disableClearable
      options={data.options}
      renderInput={(params) => (
        <>
          <TextField {...params} label={data.label} variant="outlined" />
          <FormHelperText>{data?.error}</FormHelperText>
        </>
      )}
    />
  );
};
export const btnSingleField = (data) => {
  return (
    <div className="single-btns-wrap">
      <InputLabel id={data.key} className="post-inp-label">
        {data.label}
      </InputLabel>
      <div className="single-btns-con">
        {data?.options &&
          data.options.map((ele, i) => (
            <div
              className={`btn-item ${data?.value == ele ? "active" : ""}`}
              key={i}
              onClick={() => data.onChange(data.key, ele)}
            >
              {ele}
            </div>
          ))}
      </div>
      <FormHelperText>{data?.error}</FormHelperText>
    </div>
  );
};
export const dateField = (data) => {
  return (
    <FormControl className="date-wrap">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          openTo="year"
          views={["year", "month"]}
          // defaultValue={moment(data.value)}
          label={data.label}
          onChange={(val) => data.onChange(data.key, val)}
        />
        <FormHelperText>{data?.error}</FormHelperText>
      </LocalizationProvider>
    </FormControl>
  );
};
