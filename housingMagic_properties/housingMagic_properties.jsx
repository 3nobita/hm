import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import Profile from "../account/Profile";
import ChangePassword from "../account/ChangePassword";
import Listings from "../account/Listings";
import ListingshousingMagic from "./ListingshousingMagic"
import Requirements from "../account/Requirements";
import CommunityRequirements from "../account/CommunityRequirements";
import CommunityProperties from "../account/CommunityProperties";
// import Leads from "./Leads";
// import Visits from "./Visits";
import { useSelector } from "react-redux";
import DataLoading from "../../components/DataLoading";
import { Button } from "@mui/material";
import RequirementProperties from "../account/RequirementProperties";
import PropertyRequirements from "../account/PropertyRequirements";
import ReportOfCp from "../account/ReportOfCp";
import Notification from "../account/notification/Notification";
import Poster from "../account/poster/Poster";

function housingMagic_properties() {
  const { pathname } = useLocation();
  const [page, setPage] = useState("");
  const { isLoggedIn, isVerify, profile } = useSelector((state) => state.auth);
  const [openMenu, setOpenMenu] = useState(true);

  useEffect(() => {
    setPage((pathname || "").split("/").at(-1));
  }, [pathname]);

  return (
    <div id="account">
      <div className="account-con">
        <div className="account-header-con">
          <div
            className="account-menu-btn"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {icons.menu}
          </div>
          <div className="account-header">My Account</div>
        </div>
        <div className="account-content-wrap">
          <div
            className="acc-sidebar"
            style={{ display: openMenu ? "block" : "none" }}
          >
            <Link
              className={`acc-sb-item ${["listings", "account"].includes(page) ? "active" : ""
                }`}
              to={{ pathname: "/account/listings" }}
            >
              {<span>{icons.listing}</span>}My Properties
            </Link>
            <Link
              className={`acc-sb-item ${page === "community-properties" ? "active" : ""
                }`}
              to={{ pathname: "/search/buy/residential/all" }}
            >
              {<span>{icons.visits}</span>}Community Properties
            </Link>
            {["Admin", "staff"].includes(profile.role_type) && (
              <Link
                className={`acc-sb-item ${["listings", "housingMagic_properties"].includes(page) ? "active" : ""
                  }`}
                to={{ pathname: "/housingMagic_properties" }}
              >
                {<span>{icons.visits}</span>}HousingMagic Properties
              </Link>
            )}
            <Link
              className={`acc-sb-item ${page === "requirements" ? "active" : ""
                }`}
              to={{ pathname: "/account/requirements" }}
            >
              {<span>{icons.visits}</span>}My Requirements
            </Link>
            <Link
              className={`acc-sb-item ${page === "community-requirements" ? "active" : ""
                }`}
              to={{ pathname: "/account/community-requirements" }}
            >
              {<span>{icons.visits}</span>}Community Requirements
            </Link>
            {["Admin", "staff"].includes(profile.role_type) && (
              <>
                <Link
                  className={`acc-sb-item ${page === "report" ? "active" : ""}`}
                  to={{ pathname: "/account/report" }}
                >
                  {<span>{icons.visits}</span>}Report
                </Link>
                <Link
                  className={`acc-sb-item ${page === "notification" ? "active" : ""
                    }`}
                  to={{ pathname: "/account/notification" }}
                >
                  {<span>{icons.visits}</span>}Notifications
                </Link>
                <Link
                  className={`acc-sb-item ${page === "poster" ? "active" : ""}`}
                  to={{ pathname: "/account/poster" }}
                >
                  {<span>{icons.visits}</span>}Poster
                </Link>
              </>
            )}
          </div>

          {!isVerify ? (
            <DataLoading />
          ) : isLoggedIn ? (
            <Switch>
              <Route path="/account/profile" component={Profile} />
              <Route
                path="/account/change-password"
                component={ChangePassword}
              />
              <Route path="/account/listings" component={Listings} />
              <Route path="/account/requirements" component={Requirements} />
              <Route
                path="/account/community-requirements"
                component={CommunityRequirements}
              />
              <Route
                path="/account/community-properties"
                component={CommunityProperties}
              />
              <Route
                path="/account/requirement/property/:requirementId"
                component={RequirementProperties}
              />
              <Route
                path="/account/property/requirement/:propertyId"
                component={PropertyRequirements}
              />
              {["Admin", "staff"].includes(profile.role_type) && (
                <Route path="/account/report" component={ReportOfCp} />
              )}
              {["Admin", "staff"].includes(profile.role_type) && (
                <Route path="/account/notification" component={Notification} />
              )}
              {["Admin", "staff"].includes(profile.role_type) && (
                <Route path="/account/poster" component={Poster} />
              )}
              <Route path="/housingMagic_properties" component={ListingshousingMagic} />
            </Switch>
          ) : (
            <div className="login-mes-wrap">
              <div className="login-mes-box">
                <h3>Login or register</h3>
                <h5>Access your data across devices by registering with us</h5>
                <Link
                  to={{ pathname: "/auth/login" }}
                  state={{ redirect: pathname }}
                >
                  <Button variant="contained" fullWidth>
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default housingMagic_properties;
