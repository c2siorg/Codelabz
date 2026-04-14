import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={prism}>
      {value}
    </SyntaxHighlighter>
  );
};

export const ImageRenderer = props => {
  let a = props.alt;
  let src = props.src;
  let imageScale = 100;
  let parts,
    alt = a,
    scale;
  try {
    parts = a.split(";");
    alt = parts[0].replace("alt=", "");
    scale = parts[1].replace("scale=", "");
    imageScale = 100 * parseFloat(scale);
  } catch (error) {}

  return (
    <img style={{ width: "100px", cursor: "pointer" }} src={Logo} alt="CodeLabz logo" />
  );
};
