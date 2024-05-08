import React, { useEffect, useState } from "react";

import "./Header.scss";
import Button from "../Button";

import PlusIcon from "../../assets/Icons/plus.svg";
import { ReactComponent as HeaderLogo } from "../../assets/Logos/ischool-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [login, setLogin] = useState(false);
  useEffect(() => {
    const loginDetails = sessionStorage.getItem("login");
    if (loginDetails) {
      setLogin(true);
    }
  }, [login]);

  return (
    <div className="header-container">
      <div className="mx">
        <div className="header-wrapper">
          <HeaderLogo />
          {login && currentPath !== "/login" && (
            <Button
              children="New Admission"
              variant="primary"
              leftIcon={<img src={PlusIcon} alt="alt" />}
              onClick={() => [
                navigate("/newadmission"),
                window.location.reload(),
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
