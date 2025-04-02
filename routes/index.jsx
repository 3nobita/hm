import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Test from "../pages/Test";
import Home from "../pages/Home";
import ContactUs from "../pages/info/ContactUs";
import AboutUs from "../pages/info/AboutUs";
import Terms from "../pages/info/Terms";
import Privacy from "../pages/info/Privacy";
import Feedback from "../pages/info/Feedback";
import FAQ from "../pages/info/FAQ";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Forgot from "../pages/auth/Forgot";
import AccountVerify from "../pages/auth/AccountVerify";
// import SearchResult from "../pages/SearchResult";
import ForgotVerify from "../pages/auth/ForgotVerify";
import Account from "../pages/account/Account";
import Activity from "../pages/activity/Activity";
import PropertyDetail from "../pages/PropertyDetail";
import LoginSuccess from "../pages/auth/LoginSuccess";
import PostProperty from "../pages/property/Add";
import PostRequirements from "../pages/requirement/PostRequirements";
import EditProperty from "../pages/property/Edit";
// import EmiCalculator from "../pages/tools/EmiCalculator";
// import MortgageCalculator from "../pages/tools/MortgageCalculator";
// import RentalYeildCalculator from "../pages/tools/RentalYeildCalculator";
import Error from "../components/Error";
import { useDispatch } from "react-redux";
import { setMetadata } from "../redux/reducers/seoReducer";
import metadata from "../utils/metadata";
import Result from "../pages/searchResult/Result";
import TicketList from "../pages/support/TicketList";
import Support from "../pages/support/Support";
import Compare from "../pages/compare/Compare";
import EditRequirements from "../pages/requirement/EditRequirements";
import housingMagic_properties from "../pages/housingMagic_properties/housingMagic_properties";
import EdithousingMagicProperty from "../pages/housingMagic_properties/Edit"

function AppRouter() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const meta = metadata[pathname === "/" ? "home" : pathname.split("/").at(-1)];
  meta && dispatch(setMetadata(meta));

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/test" component={Test} />

      <Route path="/post-property" component={PostProperty} />
      <Route path="/edit-property/:propertyId" component={EditProperty} />
      <Route path="/post-requirement" component={PostRequirements} />
      <Route
        path="/edit-requirement/:requirementId"
        component={EditRequirements}
      />

      <Route path="/info/contact-us" component={ContactUs} />
      <Route path="/info/about-us" component={AboutUs} />
      <Route path="/info/terms-and-conditions" component={Terms} />
      <Route path="/info/privacy-policy" component={Privacy} />
      <Route path="/info/feedback" component={Feedback} />
      <Route path="/info/faq" component={FAQ} />

      <Route path="/search/:for/:type/:query" component={Result} />
      <Route path="/property/:query" component={PropertyDetail} />
      {/* <Route path="/m/property/:query" component={PropertyDetail} /> */}
      <Route
        path="/m/property/:query"
        render={(props) => <PropertyDetail {...props} isMobile={true} />}
      />

      {/* <Route path="/tools/emi-calculator" component={EmiCalculator} />
      <Route path="/tools/mortgage-calculator" component={MortgageCalculator} />
      <Route
        path="/tools/rental-yield-calculator"
        component={RentalYeildCalculator}
      /> */}

      <Route exact path="/auth/login" component={Login} />
      <Route path="/auth/login/success/:token" component={LoginSuccess} />
      <Route path="/auth/register" component={Register} />
      <Route path="/auth/forgot-password" component={Forgot} />
      <Route path="/auth/reset-password/:token" component={ForgotVerify} />
      <Route path="/auth/account-verify/:token" component={AccountVerify} />
      <Route path="/activity" component={Activity} />
      <Route path="/account" component={Account} />
      <Route path="/housingMagic_properties" component={housingMagic_properties} />
      <Route path="/edit-housingMagicproperty/:propertyId" component={EdithousingMagicProperty} />

      <Route exact path="/support" component={TicketList} />
      <Route path="/support/new" component={Support} />

      <Route path="/compare-properties" component={Compare} />

      <Route path="*" component={Error} />
    </Switch>
  );
}

export default AppRouter;
