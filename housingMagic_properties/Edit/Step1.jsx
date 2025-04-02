import React, { useEffect, useState } from "react";
import {
  step1FormFields,
  fieldData,
  formField,
  step1Fields,
  customFormFields,
} from "./../Form";
import { useForm } from "../../../components/CustomHook";
import Loading from "../../../components/Loading";
import validate from "../../../utils/validation";
import {
  call,
  getCity,
  getLocality,
  updateProperty,
} from "../../../redux/axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl, FormLabel } from "@mui/material";
import {
  setStep,
  setPropType,
  setPropId,
  setPropFor,
  setPropPostFor,
} from "../../../redux/reducers/propertyFormReducer";
import { keyMap } from "./../Form";
import LocationPin from "../../../components/GoogleMap/LocationPin";

import { ToWords } from "to-words";
const toWords = new ToWords({});

const postForOptions = [
  { label: "Self", value: "Self" },
  { label: "Channel Partner Community", value: "CP" },
  { label: "B2C / on Portal For All", value: "B2C" },
];

function Step1({ draftData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocality] = useState([]);
  const { propertyId, step } = useSelector((state) => state.propertyForm);

  const fetchCity = async () => {
    try {
      const res = await call(getCity());
      setCities(res.data.map((ele) => ele?.city));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLocality = async (city) => {
    if (!city) return;
    try {
      const res = await call(getLocality({ city }));
      setLocality(res.data.map((ele) => ele?.locality));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePossChange = (status) => {
    setFormData((prev) =>
      prev.map((ele) => {
        if (ele.key == "availableFrom" && status == "Under Construction") {
          ele.hide = false;
        }
        if (ele.key == "ageOfConstruction" && status == "Under Construction") {
          ele.hide = true;
        }
        if (ele.key == "availableFrom" && status == "Ready to Move") {
          ele.hide = true;
        }
        if (ele.key == "ageOfConstruction" && status == "Ready to Move") {
          ele.hide = false;
        }
        return ele;
      })
    );
  };

  const setDraftData = async () => {
    try {
      const data = {};
      if (draftData?.id) {
        let k;
        for (const key in keyMap) {
          k = keyMap[key];
          if (draftData[k]) {
            data[key] =
              fieldData[key] && fieldData[key]?.type === "checkbox"
                ? draftData[k].split(",")
                : draftData[k];
          }
        }

        handleFieldChange(
          draftData.postFor,
          draftData.forr,
          draftData.property_type
        );
        draftData?.prop_availability &&
          handlePossChange(draftData.prop_availability);
        fetchLocality(draftData?.city ? draftData.city : cities[0]);
        form.setValues({ ...form.values, ...data });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCity();
    setDraftData();
  }, []);

  const handleFieldChange = (postFor, forr, type) => {
    form.setErrors({});
    const isCustom = ["Self", "CP"].includes(postFor);

    if (isCustom) {
      postForOptions.length = 2;
    } else {
      postForOptions.length = 0;
    }

    const data = isCustom
      ? customFormFields[forr].map((ele) => fieldData[ele])
      : step1FormFields[type][forr].map((ele) => fieldData[ele]);
    setFormData(data);
    dispatch(setPropPostFor(postFor));
    dispatch(setPropFor(forr));
    dispatch(setPropType(type));
  };

  const handleForChange = (key, val, type = "") => {
    form.setErrors({});
    form.setFieldValue("for", val);
    form.setFieldValue("type", type);
    setFormData([]);
    dispatch(setPropFor(val));
  };

  const handleTypeChange = (key, val, forr = null) => {
    form.setErrors({});

    const data = step1FormFields[val][forr || form.values?.for].map(
      (ele) => fieldData[ele]
    );

    form.setFieldValue("type", val);
    setFormData(data);
    dispatch(setPropType(val));
  };

  const handlePostForChange = (key, val, forr = null) => {
    form.setErrors({});
    const isCustom = ["Self", "CP"].includes(val);
    const data = isCustom
      ? customFormFields[forr || form.values.for].map((ele) => fieldData[ele])
      : [];

    form.setFieldValue("type", isCustom ? "Flat/Apartment" : "");
    dispatch(setPropType(isCustom ? "Flat/Apartment" : ""));
    form.setFieldValue("postFor", val);
    dispatch(setPropPostFor(val));
    setFormData(data);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await call(updateProperty(propertyId, values));
      const isCustom = ["Self", "CP"].includes(values.postFor);
      dispatch(setStep(step + (isCustom ? 2 : 1)));
      dispatch(setPropId(res?.propertyId));
    } catch (err) {
      setErrors(err);
    }
    setSubmitting(false);
  };

  const handleChange = (key, val) => {
    if (key === "possessionStatus") {
      handlePossChange(val);
    } else if (key === "city") {
      fetchLocality(val);
      form.setFieldValue("locality", "");
      for (let i = 0; i < 4; i++) {
        form.setFieldValue(`nearByLocation${i + 1}`, "");
      }
    } else if (key === "expectedPrice") {
      form.setFieldValue(
        "priceInWord",
        toWords.convert(val ? val : 0, { currency: true })
      );
    }
    form.setFieldValue(key, val);
  };

  const setLocationData = (data) => {
    form.setFieldValue("latitude", data.lat);
    form.setFieldValue("longitude", data.lng);
  };

  const form = useForm({
    initial: {
      ...step1Fields,
      postingAs: draftData?.iam,
      for: draftData?.forr,
    },
    schema: validate.propertyStep1Schema,
    callback: handleSubmit,
  });

  return (
    step === 1 && (
      <form noValidate onSubmit={form.handleSubmit}>
        <div className="p-form-fields-con">
          {/* {formField.radio({
            key: "postingAs",
            type: "radio",
            label: "Posting as",
            options: [
              "Channel Partner",
              "Owner",
              "Builder",
              "Customer",
              "Developer",
            ],
            value: form.values.postingAs,
            onChange: handleChange,
            error: form.errors.postingAs,
          })} */}
          {form.values?.postingAs === "Channel Partner" ? (
            postForOptions.length > 0 ? (
              formField.radio({
                key: "postFor",
                type: "radio",
                label: "Posting For",
                options: postForOptions,
                value: form.values.postFor,
                onChange: handlePostForChange,
                error: form.errors.postFor,
              })
            ) : (
              <FormControl
                sx={{ mb: 2 }}
                className="radio-wrap"
                style={{ flexDirection: "row", gap: 10 }}
              >
                <FormLabel>Posting For: </FormLabel>
                <span>{form.values.postFor}</span>
              </FormControl>
            )
          ) : (
            ""
          )}
          {formField.radio({
            key: "for",
            type: "radio",
            label: "For",
            options: ["Sale", "Rent/Lease"],
            value: form.values.for,
            onChange: handleForChange,
            error: form.errors.for,
          })}
          {["Self", "CP"].includes(form.values.postFor) ? (
            <>
              <FormControl
                sx={{ mb: 2 }}
                className="radio-wrap"
                style={{ flexDirection: "row", gap: 10 }}
              >
                <FormLabel>Property Type: </FormLabel>
                <span>Flat/Apartment</span>
              </FormControl>
              {formField.select({
                key: "city",
                type: "select",
                label: "City",
                options: cities,
                value: form.values.city,
                onChange: handleChange,
                error: form.errors.city,
              })}
              {formField.select({
                key: "locality",
                type: "select",
                label: "Locality",
                options: localities,
                value: form.values.locality,
                onChange: handleChange,
                error: form.errors.locality,
              })}
            </>
          ) : (
            <>
              {formField.text({
                key: "name",
                type: "text",
                label: "Name of Contact Person",
                value: form.values.name,
                onChange: handleChange,
                error: form.errors.name,
              })}
              {formField.text({
                key: "email",
                type: "text",
                label: "Email Id",
                value: form.values.email,
                onChange: handleChange,
                error: form.errors.email,
              })}
              {formField.number({
                key: "mobile",
                type: "number",
                label: "Mobile No",
                value: form.values.mobile,
                onChange: handleChange,
                error: form.errors.mobile,
              })}
              {formField.number({
                key: "whatsapp",
                type: "number",
                label: "Whatsapp No",
                value: form.values.whatsapp,
                onChange: handleChange,
                error: form.errors.whatsapp,
              })}
              {formField.select({
                key: "type",
                type: "select",
                label: "Property Type",
                options:
                  form.values.for === "Sale"
                    ? [
                        "Flat/Apartment",
                        "Residential House",
                        "Villa",
                        "Builder Floor Apartment",
                        "Residential Land/Plot",
                        "Penthouse",
                        "Studio Apartment",
                        "Commercial Office Space",
                        "Office in IT Park/SEZ",
                        "Commercial Shop",
                        "Commercial Showroom",
                        "Commercial Land",
                        "Warehouse/Godown",
                        "Industrial Land",
                        "Industrial Building",
                        "Industrial Shed",
                        "Agricultural Land",
                        "Farm House",
                      ]
                    : [
                        "Flat/Apartment",
                        "Residential House",
                        "Villa",
                        "Builder Floor Apartment",
                        "Penthouse",
                        "Studio Apartment",
                        "Service Apartment",
                        "Commercial Office Space",
                        "Office in IT Park/SEZ",
                        "Commercial Shop",
                        "Commercial Showroom",
                        "Commercial Land",
                        "Warehouse/Godown",
                        "Industrial Land",
                        "Industrial Building",
                        "Industrial Shed",
                        "Agricultural Land",
                        "Farm House",
                      ],
                value: form.values.type,
                onChange: handleTypeChange,
                error: form.errors.type,
              })}
              {formField.text({
                key: "address",
                type: "text",
                label: "Address",
                value: form.values.address,
                onChange: handleChange,
                error: form.errors.address,
              })}
              {formField.select({
                key: "city",
                type: "select",
                label: "City",
                options: cities,
                value: form.values.city,
                onChange: handleChange,
                error: form.errors.city,
              })}
              {formField.select({
                key: "locality",
                type: "select",
                label: "Locality",
                options: localities,
                value: form.values.locality,
                onChange: handleChange,
                error: form.errors.locality,
              })}
              {[1, 2, 3, 4].map((ele) => (
                <React.Fragment key={ele}>
                  {formField.select({
                    key: "nearByLocation" + ele,
                    type: "select",
                    label: "Near By Location " + ele,
                    options: localities,
                    value: form.values["nearByLocation" + ele],
                    onChange: handleChange,
                    error: form.errors["nearByLocation" + ele],
                  })}
                </React.Fragment>
              ))}
              <LocationPin
                location={
                  form.values?.latitude && form.values?.longitude
                    ? {
                        lat: form.values?.latitude,
                        lng: form.values?.longitude,
                      }
                    : null
                }
                setLocationChange={setLocationData}
              />
            </>
          )}
          {formData.map((ele, i) => (
            <React.Fragment key={i}>
              {!ele?.hide &&
                formField[ele.type]({
                  ...ele,
                  value: form.values[ele.key],
                  onChange: handleChange,
                  error: form.errors[ele.key],
                })}
            </React.Fragment>
          ))}
        </div>
        <div className="p-form-btn-con">
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ my: 2 }}
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? <Loading color="#fff" /> : "Next"}
          </Button>
        </div>
      </form>
    )
  );
}

export default Step1;
