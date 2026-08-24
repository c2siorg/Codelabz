import React, { useRef, useState } from "react";
import { useEditorState } from "@tiptap/react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";

const HEADING_OPTIONS = [
  { value: "0", label: "Normal" },
  { value: "1", label: "Heading 1" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
  { value: "4", label: "Heading 4" },
  { value: "5", label: "Heading 5" },
  { value: "6", label: "Heading 6" }
];

const FONT_SIZE_OPTIONS = [
  { value: "0.75em", label: "Small" },
  { value: "", label: "Normal" },
  { value: "1.5em", label: "Large" },
  { value: "2.5em", label: "Huge" }
];

const FONT_FAMILY_OPTIONS = [
  { value: "", label: "Sans Serif" },
  { value: "Georgia, 'Times New Roman', serif", label: "Serif" },
  { value: "Monaco, 'Courier New', monospace", label: "Monospace" }
];

const EditorToolbar = ({ editor }) => {
  const fileInputRef = useRef(null);
  const [linkAnchor, setLinkAnchor] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");

  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return null;
      return {
        bold: currentEditor.isActive("bold"),
        italic: currentEditor.isActive("italic"),
        underline: currentEditor.isActive("underline"),
        strike: currentEditor.isActive("strike"),
        blockquote: currentEditor.isActive("blockquote"),
        codeBlock: currentEditor.isActive("codeBlock"),
        bulletList: currentEditor.isActive("bulletList"),
        orderedList: currentEditor.isActive("orderedList"),
        subscript: currentEditor.isActive("subscript"),
        superscript: currentEditor.isActive("superscript"),
        link: currentEditor.isActive("link"),
        linkHref: currentEditor.getAttributes("link").href || "",
        alignLeft: currentEditor.isActive({ textAlign: "left" }),
        alignCenter: currentEditor.isActive({ textAlign: "center" }),
        alignRight: currentEditor.isActive({ textAlign: "right" }),
        alignJustify: currentEditor.isActive({ textAlign: "justify" }),
        heading: currentEditor.isActive("heading", { level: 1 })
          ? "1"
          : currentEditor.isActive("heading", { level: 2 })
            ? "2"
            : currentEditor.isActive("heading", { level: 3 })
              ? "3"
              : currentEditor.isActive("heading", { level: 4 })
                ? "4"
                : currentEditor.isActive("heading", { level: 5 })
                  ? "5"
                  : currentEditor.isActive("heading", { level: 6 })
                    ? "6"
                    : "0"
      };
    }
  });

  if (!editor || !state) return null;

  const toggle = command => () => editor.chain().focus()[command]().run();

  const handleHeadingChange = event => {
    const level = Number(event.target.value);
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const handleFontSizeChange = event => {
    const value = event.target.value;
    if (value) {
      editor.chain().focus().setFontSize(value).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
  };

  const handleFontFamilyChange = event => {
    const value = event.target.value;
    if (value) {
      editor.chain().focus().setFontFamily(value).run();
    } else {
      editor.chain().focus().unsetFontFamily().run();
    }
  };

  const handleColorChange = event => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  const handleBackgroundChange = event => {
    editor.chain().focus().setBackgroundColor(event.target.value).run();
  };

  const openLinkPopover = event => {
    setLinkUrl(state.linkHref);
    setLinkAnchor(event.currentTarget);
  };

  const applyLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkAnchor(null);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkAnchor(null);
  };

  const handleImageSelected = event => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      data-testid="editor-toolbar"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.5,
        border: "1px solid",
        borderColor: "divider",
        borderBottom: "none",
        p: 1
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          size="small"
          data-testid="editor-bold-button"
          color={state.bold ? "primary" : "default"}
          onClick={toggle("toggleBold")}
        >
          <FormatBoldIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          size="small"
          data-testid="editor-italic-button"
          color={state.italic ? "primary" : "default"}
          onClick={toggle("toggleItalic")}
        >
          <FormatItalicIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton
          size="small"
          data-testid="editor-underline-button"
          color={state.underline ? "primary" : "default"}
          onClick={toggle("toggleUnderline")}
        >
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Strikethrough">
        <IconButton
          size="small"
          data-testid="editor-strike-button"
          color={state.strike ? "primary" : "default"}
          onClick={toggle("toggleStrike")}
        >
          <StrikethroughSIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Blockquote">
        <IconButton
          size="small"
          data-testid="editor-blockquote-button"
          color={state.blockquote ? "primary" : "default"}
          onClick={toggle("toggleBlockquote")}
        >
          <FormatQuoteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Code block">
        <IconButton
          size="small"
          data-testid="editor-codeblock-button"
          color={state.codeBlock ? "primary" : "default"}
          onClick={toggle("toggleCodeBlock")}
        >
          <CodeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Select
        size="small"
        data-testid="editor-heading-select"
        value={state.heading}
        onChange={handleHeadingChange}
        sx={{ minWidth: 110 }}
      >
        {HEADING_OPTIONS.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Bulleted list">
        <IconButton
          size="small"
          data-testid="editor-bulletlist-button"
          color={state.bulletList ? "primary" : "default"}
          onClick={toggle("toggleBulletList")}
        >
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered list">
        <IconButton
          size="small"
          data-testid="editor-orderedlist-button"
          color={state.orderedList ? "primary" : "default"}
          onClick={toggle("toggleOrderedList")}
        >
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Subscript">
        <IconButton
          size="small"
          data-testid="editor-subscript-button"
          color={state.subscript ? "primary" : "default"}
          onClick={toggle("toggleSubscript")}
        >
          <SubscriptIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Superscript">
        <IconButton
          size="small"
          data-testid="editor-superscript-button"
          color={state.superscript ? "primary" : "default"}
          onClick={toggle("toggleSuperscript")}
        >
          <SuperscriptIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Select
        size="small"
        data-testid="editor-fontsize-select"
        defaultValue=""
        onChange={handleFontSizeChange}
        displayEmpty
        sx={{ minWidth: 90 }}
      >
        {FONT_SIZE_OPTIONS.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        data-testid="editor-fontfamily-select"
        defaultValue=""
        onChange={handleFontFamilyChange}
        displayEmpty
        sx={{ minWidth: 110 }}
      >
        {FONT_FAMILY_OPTIONS.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Text color">
        <IconButton
          size="small"
          component="label"
          data-testid="editor-color-button"
          sx={{ position: "relative" }}
        >
          <FormatColorTextIcon fontSize="small" />
          <input
            type="color"
            onChange={handleColorChange}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              border: "none",
              padding: 0
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Background color">
        <IconButton
          size="small"
          component="label"
          data-testid="editor-background-button"
          sx={{ position: "relative" }}
        >
          <FormatColorFillIcon fontSize="small" />
          <input
            type="color"
            onChange={handleBackgroundChange}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              border: "none",
              padding: 0
            }}
          />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Align left">
        <IconButton
          size="small"
          data-testid="editor-align-left-button"
          color={state.alignLeft ? "primary" : "default"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <FormatAlignLeftIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align center">
        <IconButton
          size="small"
          data-testid="editor-align-center-button"
          color={state.alignCenter ? "primary" : "default"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <FormatAlignCenterIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align right">
        <IconButton
          size="small"
          data-testid="editor-align-right-button"
          color={state.alignRight ? "primary" : "default"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <FormatAlignRightIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Justify">
        <IconButton
          size="small"
          data-testid="editor-align-justify-button"
          color={state.alignJustify ? "primary" : "default"}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <FormatAlignJustifyIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Remove formatting">
        <IconButton
          size="small"
          data-testid="editor-clean-button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <FormatClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Link">
        <IconButton
          size="small"
          data-testid="editor-link-button"
          color={state.link ? "primary" : "default"}
          onClick={openLinkPopover}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(linkAnchor)}
        anchorEl={linkAnchor}
        onClose={() => setLinkAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1.5, display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="https://example.com"
            value={linkUrl}
            data-testid="editor-link-input"
            onChange={event => setLinkUrl(event.target.value)}
          />
          <Button size="small" onClick={applyLink} data-testid="editor-link-apply">
            Apply
          </Button>
          {state.link && (
            <Button size="small" color="error" onClick={removeLink}>
              Remove
            </Button>
          )}
        </Box>
      </Popover>

      <Tooltip title="Image">
        <IconButton
          size="small"
          data-testid="editor-image-button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageSelected}
      />
    </Box>
  );
};

export default EditorToolbar;
