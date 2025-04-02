import React, { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { call, getEditProperty } from "../../../redux/axios";
import Loading from "../../../components/Loading";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setPropId,
  setStep,
} from "../../../redux/reducers/propertyFormReducer";

function Edit() {
  const dispatch = useDispatch();
  const [draftData, setDraftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { propertyId } = useParams();

  const fetchDraftData = async () => {
    try {
      const res = await call(getEditProperty(propertyId));
      setDraftData(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDraftData();
    dispatch(setPropId(propertyId));
    dispatch(setStep(1));
  }, []);

  return (
    <div className="property-form-con">
      <div className="property-form">
        <div className="page-title" style={{ padding: 20 }}>
          <h1>Edit Property</h1>
        </div>
        {loading ? (
          <div className="data-loader">
            <Loading />
          </div>
        ) : (
          <>
            <Step1 draftData={draftData} />
            <Step2 draftData={draftData} />
            <Step3 draftData={draftData} />
          </>
        )}
      </div>
    </div>
  );
}

export default Edit;
