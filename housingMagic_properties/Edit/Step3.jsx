import React, { useEffect, useState } from "react";
import { imgFields } from "./../Form";
import FileUpload from "../../../components/FileUpload";
import Loading from "../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { setStep } from "../../../redux/reducers/propertyFormReducer";
import { error, success } from "../../../components/Toast";
import { call, uploadPropImg } from "../../../redux/axios";
import { useHistory } from "react-router-dom";
import { propertySmallImg } from "../../../utils/helper";

function Step3({ draftData }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { propertyId, type, postFor, step } = useSelector(
    (state) => state.propertyForm
  );
  const [files, setFiles] = useState({});
  const [existingFiles, setExistingFiles] = useState({});
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [deleteVideo, setDeleteVideo] = useState(false);
  const [imgType, setImgType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDraftData = () => {
    const data = {};
    if (draftData?.images) {
      draftData.images.map((ele) => {
        if (!data[ele.type]) {
          data[ele.type] = [];
        }
        data[ele.type].push({
          fileType: "img",
          id: ele.id,
          name: ele.img,
          url: propertySmallImg(ele.img),
        });
      });
    }
    if (draftData?.brochure) {
      data["Brochure"] = [
        {
          fileType: "pdf",
          id: 1,
          name: draftData.brochure,
          url: "",
        },
      ];
    }
    if (draftData?.video) {
      data["Videos"] = [
        {
          fileType: "video",
          id: 1,
          name: draftData.video,
          url: "",
        },
      ];
    }
    setExistingFiles(data);
  };

  useEffect(() => {
    handleDraftData();
  }, [draftData]);

  useEffect(() => {
    type && setImgType(imgFields[type][0] || "");
  }, [type]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("propId", propertyId);

      for (let i = 0; i < deleteFiles.length; i++) {
        fd.append("deleteFiles", deleteFiles[i]);
      }

      fd.append("deleteVideo", deleteVideo);

      for (const [key, arr] of Object.entries(files)) {
        arr.forEach((ele) => {
          fd.append(key, ele);
        });
      }

      const res = await call(uploadPropImg(fd));

      success(res?.message);

      history.push(`/account/listings`);
    } catch (err) {}
    setLoading(false);
  };

  const handleUpload = (key, val) => {
    setFiles((prev) => {
      return { ...prev, [key]: val };
    });
  };

  const handleDelete = (key, id) => {
    if (key === "Videos") {
      setDeleteVideo(true);
    } else if (key === "Brochure") {
    } else {
      setDeleteFiles([...deleteFiles, id]);
    }

    setExistingFiles((prev) => {
      return {
        ...prev,
        [key]: prev[key].filter((ele) => ele.id != id),
      };
    });
  };

  const handleRemove = (key, index) => {
    const newFiles = files[key].filter((f, i) => {
      if (i === index) {
        return false;
      }
      return true;
    });
    setFiles({ ...files, [key]: newFiles });
  };

  return (
    step === 3 && (
      <div>
        <div className="p-form-img-con">
          <div className="p-form-img-sidebar">
            {type &&
              imgFields[type].map((ele, i) => (
                <div
                  key={i}
                  className={`p-form-img-s-item ${
                    ele === imgType ? "active" : ""
                  }`}
                  onClick={() => setImgType(ele)}
                >
                  {ele}
                </div>
              ))}
          </div>
          <div className="p-form-img-uploader">
            {type && (
              <FileUpload
                type={imgType}
                data={files[imgType] || []}
                existingData={existingFiles[imgType] || []}
                handleUpload={handleUpload}
                handleRemove={handleRemove}
                deleteFile={handleDelete}
                fileLimit={
                  ["Main Image", "Brochure", "Videos"].includes(imgType)
                    ? 1
                    : 10
                }
                accept={
                  imgType === "Brochure"
                    ? { "application/pdf": [".pdf"] }
                    : imgType === "Videos"
                    ? { "video/mp4": [".mp4"] }
                    : {
                        "image/png": [".png", ".jpg", ".jpeg", ".webp"],
                      }
                }
                fileSize={
                  imgType === "Brochure" ? 10 : imgType === "Videos" ? 20 : 2
                }
              />
            )}
          </div>
        </div>
        <div className="p-form-btn-con">
          <Button
            variant="contained"
            size="large"
            sx={{ my: 2 }}
            onClick={() =>
              dispatch(
                setStep(step - (["Self", "CP"].includes(postFor) ? 2 : 1))
              )
            }
            disabled={loading}
          >
            Prev
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ my: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Loading color="#fff" /> : "Submit"}
          </Button>
        </div>
      </div>
    )
  );
}

export default Step3;
