import React from "react";
import Logo from "../assets/images/logo.png";

function BrandName(): React.ReactElement {
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
}

export default BrandName;
