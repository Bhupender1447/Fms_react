import React, { useRef, useState } from "react";
import "./OcrDocumentIntake.css";

export const MAX_OCR_FILE_SIZE = 15 * 1024 * 1024;

const acceptedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "tif", "tiff"]);
const acceptedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
]);

export function validateOcrFile(file) {
  if (!file) return "Choose a PDF, JPG, PNG, or TIFF document.";
  if (file.size === 0) return "The selected document is empty.";
  if (file.size > MAX_OCR_FILE_SIZE) return "The document must be 15 MB or smaller.";

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!acceptedExtensions.has(extension)) {
    return "Unsupported file type. Choose a PDF, JPG, PNG, or TIFF document.";
  }
  if (file.type && !acceptedMimeTypes.has(file.type.toLowerCase())) {
    return "The selected file type is not supported. Choose a PDF, JPG, PNG, or TIFF document.";
  }

  return "";
}

function formatFileSize(size) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OcrDocumentIntake({
  id,
  file,
  scanning = false,
  scanError = "",
  onFileSelected,
  onRemoveFile,
  onScan,
  onEnterManually,
}) {
  const inputRef = useRef(null);
  const [validationError, setValidationError] = useState("");

  const acceptFiles = (files) => {
    const selectedFile = files?.[0];
    const error = validateOcrFile(selectedFile);
    if (error) {
      setValidationError(error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const accepted = onFileSelected(selectedFile);
    if (accepted !== false) setValidationError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    acceptFiles(event.dataTransfer.files);
  };

  const error = validationError || scanError;

  return (
    <section className="ocr-intake" aria-labelledby={`${id}-title`}>
      <div className="ocr-intake__heading">
        <div>
          <p className="ocr-intake__eyebrow">DOCUMENT-FIRST ENTRY</p>
          <h2 id={`${id}-title`}>Rate Confirmation PDF</h2>
          <p>Upload a rate confirmation to extract details for review. Nothing is saved until you confirm.</p>
        </div>
        <span className="ocr-intake__limit">PDF, JPG, PNG, TIFF · 15 MB max</span>
      </div>

      <input
        ref={inputRef}
        id={id}
        className="ocr-intake__file-input"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,application/pdf,image/jpeg,image/png,image/tiff"
        aria-label="Upload rate confirmation document"
        aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
        onChange={(event) => acceptFiles(event.target.files)}
      />

      <label
        className={`ocr-intake__dropzone${file ? " ocr-intake__dropzone--selected" : ""}`}
        htmlFor={id}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <span className="ocr-intake__dropzone-icon" aria-hidden="true">
          <i className="fa fa-file-pdf-o" />
        </span>
        <span>
          <strong>{file ? file.name : "Drop a rate confirmation here"}</strong>
          <small>{file ? formatFileSize(file.size) : "or browse to select a supported document"}</small>
        </span>
      </label>

      <p className="ocr-intake__help" id={`${id}-help`}>
        Extracted values are unverified until reviewed. The original document stays in this page session.
      </p>

      {error && <p className="ocr-intake__error" id={`${id}-error`} role="alert">{error}</p>}
      {scanning && <p className="ocr-intake__progress" role="status" aria-live="polite">Scanning document. Keep this page open; your selected file and edits are preserved.</p>}

      <div className="ocr-intake__actions">
        <button type="button" className="btn btn-default" onClick={() => inputRef.current?.click()} disabled={scanning}>
          {file ? "Replace document" : "Browse files"}
        </button>
        {file && (
          <button type="button" className="btn btn-link" onClick={onRemoveFile} disabled={scanning}>
            Remove document
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={onScan} disabled={!file || scanning}>
          {scanning ? "Scanning…" : scanError ? "Retry Scan & Autofill" : "Scan & Autofill"}
        </button>
        <button type="button" className="btn btn-link" onClick={onEnterManually} disabled={scanning}>
          Enter Manually
        </button>
      </div>
    </section>
  );
}
