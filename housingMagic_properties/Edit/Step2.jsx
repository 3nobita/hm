import React, { useEffect, useState } from "react";
import { step2FormFields, formField, keyMap, step2Fields } from "./../Form";
import { useForm } from "../../../components/CustomHook";
import Loading from "../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { setStep } from "../../../redux/reducers/propertyFormReducer";
import validate from "../../../utils/validation";
import { call, updateProperty } from "../../../redux/axios";

function Step2({ draftData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(step2FormFields);
  const { propertyId, step } = useSelector((state) => state.propertyForm);

  const handleApprovalChange = (status) => {
    setFormData((prev) => {
      return {
        ...prev,
        approvedBy: {
          ...prev.approvedBy,
          hide: status == "No",
        },
      };
    });
  };

  const setDraftData = async () => {
    try {
      const data = {};
      if (draftData?.id) {
        for (const key in step2Fields) {
          if (step2FormFields[key]?.type == "checkbox") {
            data[key] =
              draftData[keyMap[key]] && draftData[keyMap[key]].split(",");
          } else {
            data[key] = draftData[keyMap[key]];
          }
        }
        draftData?.appr_authority &&
          handleApprovalChange(draftData.appr_authority);
        form.setValues({ ...form.values, ...data });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setDraftData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await call(updateProperty(propertyId, values));
      dispatch(setStep(step + 1));
    } catch (err) {
      setErrors(err);
    }
    setSubmitting(false);
  };

  const handleChange = (key, val) => {
    if (key === "plotApprovalAuthority") {
      setFormData((prev) => {
        return {
          ...prev,
          approvedBy: {
            ...prev.approvedBy,
            hide: val == "No",
          },
        };
      });
    }
    form.setFieldValue(key, val);
  };

  const form = useForm({
    initial: step2Fields,
    schema: validate.propertyStep2Schema,
    callback: handleSubmit,
  });

  return (
    step === 2 && (
      <form noValidate onSubmit={form.handleSubmit}>
        <div className="p-form-fields-con">
          {Object.values(formData).map((ele, i) => (
            <React.Fragment key={i}>
              {!ele?.hide &&
                formField[ele.type]({
                  ...ele,
                  value: form.values[ele.key],
                  onChange: handleChange,
                  error: form.touched[ele.key] && form.errors[ele.key],
                })}
            </React.Fragment>
          ))}
        </div>
        <div className="p-form-btn-con">
          <Button
            variant="contained"
            size="large"
            sx={{ my: 2 }}
            onClick={() => dispatch(setStep(step - 1))}
          >
            Prev
          </Button>
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

export default Step2;
