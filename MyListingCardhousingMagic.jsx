import React from "react";
import { Button, Switch } from "@mui/material";
import icons from "./../../utils/icons";
import {
  convertUrl,
  formatNumber,
  propertySmallImg,
  timeAgo,
} from "./../../utils/helper";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setShare } from "../../redux/reducers/appReducer";

function MyListingCardhousingMagic(props) {
  const dispatch = useDispatch();

  return (
    props.data && (
      <div
        className={`mylisting-card property-card ${
          props?.mobile ? "small" : ""
        }`}
        onMouseEnter={props?.onHover || null}
      >
        <Link
          to={{
            pathname: convertUrl(props.data?.project_name, props.data?.id),
          }}
          target="_blank"
          className="c-img-wrap"
        >
          <img src={propertySmallImg(props.data?.img)} alt="" />
        </Link>
        <div className="c-detail-con">
          <div className="c-detail-wrap">
            <h4 className="c-price">
              <span>
                ₹{" "}
                {formatNumber(
                  props.data?.exp_price || props.data?.monthly_rent || 0
                )}{" "}
                {props.data?.monthly_rent ? <small>/ month</small> : ""}
              </span>
              <span>
                <span
                  className="share-icon"
                  title="Share"
                  onClick={() =>
                    dispatch(
                      setShare({
                        open: true,
                        url:
                          import.meta.env.VITE_CLIENT +
                          convertUrl(props.data?.project_name, props.data?.id),
                      })
                    )
                  }
                >
                  {icons.share}
                </span>
              </span>
            </h4>
            <Link
              to={{
                pathname: convertUrl(props.data?.project_name, props.data?.id),
              }}
              target="_blank"
            >
              {props.data?.project_name && (
                <h4 className="c-title">
                  {props.data.project_name}{" "}
                  {props.data?.postFor === "CP" && "(Only CP Group)"}
                </h4>
              )}
              <div className="c-sub-title">
                {props.data?.bedroom && props.data?.bedroom + " BHK"}{" "}
                {props.data?.property_type}, {props.data?.locality},{" "}
                {props.data?.city}
              </div>
              <div className="c-d-items">
                {props.data?.bedroom && (
                  <div className="c-d-item">
                    <span className="icon">{icons.bedroom}</span>
                    {props.data?.bedroom} BHK
                  </div>
                )}
                {(props.data?.carpet_area || props.data?.super_area) && (
                  <div className="c-d-item">
                    <span className="icon">{icons.area}</span>
                    {props.data?.carpet_area || props.data?.super_area}{" "}
                    <span className="c-d-small">{props.data?.area_unit}</span>
                  </div>
                )}

                {props.data?.bathroom && (
                  <div className="c-d-item">
                    <span className="icon">{icons.bathroom}</span>
                    {props.data?.bathroom} Baths
                  </div>
                )}

                {props.data?.plot_area && (
                  <div className="c-d-item">
                    <span className="icon">{icons.plot_area}</span>
                    {props.data?.plot_area} Plot Area
                  </div>
                )}

                {props.data?.washrooms && (
                  <div className="c-d-item">
                    <span className="icon">{icons.washrooms}</span>
                    {props.data?.washrooms} Washrooms
                  </div>
                )}

                {props.data?.land_zone && (
                  <div className="c-d-item">
                    <span className="icon">{icons.land_zone}</span>
                    Land Zone: {props.data?.land_zone}
                  </div>
                )}

                {[
                  "Residential Land/Plot",
                  "Commercial Land",
                  "Warehouse/Godown",
                  "Industrial Land",
                  "Industrial Shed",
                  "Agricultural Land",
                ].includes(props.data?.property_type) && (
                  <>
                    {props.data?.plot_length && (
                      <div className="c-d-item">
                        <span className="icon">{icons.plot_length}</span>
                        Plot Length: {props.data?.plot_length}
                        <span className="c-d-small">
                          {props.data?.area_unit}
                        </span>
                      </div>
                    )}

                    {props.data?.plot_breadth && (
                      <div className="c-d-item">
                        <span className="icon">{icons.plot_breadth}</span>
                        Plot Breadth: {props.data?.plot_breadth}
                        <span className="c-d-small">
                          {props.data?.area_unit}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              {props.data?.prop_availability && (
                <div className="c-d-info">
                  Possession Status: {props.data?.prop_availability}
                </div>
              )}
              <div className="c-d-info">
                Posted By: {props.data?.iam}
                <span className="hidden mobile-time-ago">
                  {timeAgo(props.data?.date)}
                </span>
              </div>
            </Link>
          </div>
          <div className="c-btns-wrap">
            <div className="c-btns-data-box">
              <div className="c-btns-data-item">
                <span className="color-3">{props.data?.contacted}</span> Leads
              </div>
              <div className="c-btns-data-item">
                <span className="color-3">{props.data?.siteVisits}</span> Visits
              </div>
              <div className="c-btns-data-item">
                <span className="color-3">{props.data?.shortlisted}</span>{" "}
                Shortlisted
              </div>
            </div>
            <div className="c-btns-box">
              <Link to={{ pathname: "/edit-housingMagicproperty/" + props.data?.id }}>
                <div title="Edit" className="c-btns-item">
                  {icons.edit}
                </div>
              </Link>
              <div
                title="Delete"
                className="c-btns-item"
                onClick={() =>
                  props?.handleDelete && props?.handleDelete(props.data?.id)
                }
              >
                {icons.delete}
              </div>
              <Switch
                title={props.data?.isActive ? "Deactivate" : "Activate"}
                checked={props.data?.isActive ? true : false}
                onChange={() =>
                  props?.handleStatus &&
                  props?.handleStatus({
                    id: props.data?.id,
                    cur: props.data?.isActive,
                  })
                }
              />
              {props.data?.isActive == 1 && (
                <Link
                  to={{
                    pathname: "/account/property/requirement/" + props.data?.id,
                  }}
                >
                  <Button variant="contained" size="small">
                    View Requirements
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default MyListingCardhousingMagic;
