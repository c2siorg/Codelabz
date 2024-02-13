import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import "../../../css/quillEditor.css";
// import "quill/dist/quill.snow.css";

const HtmlTextRenderer = ({ html = "<p>Html Text Renderer</p>" }) => {
  // used to remove any sensitive tags like <script> which might me malicious
  const sanitizedHTML = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default HtmlTextRenderer;
