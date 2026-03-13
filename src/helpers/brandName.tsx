import React from "react";
import Logo from "../assets/images/logo.png";

const BrandName: React.FC = () => {
  return (
    <>
      <img
        style={{
          width: "100px",
          cursor: "pointer"
        }}
        src={Logo}
        alt="logo"
      />
    </>
  );
};

export default BrandName;