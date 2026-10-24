import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import OcrDocumentIntake, { MAX_OCR_FILE_SIZE, validateOcrFile } from "./OcrDocumentIntake";
import OcrExtractionReview from "./OcrExtractionReview";

function renderIntake(overrides = {}) {
  const props = {
    id: "test-document",
    file: null,
    scanning: false,
    scanError: "",
    onFileSelected: jest.fn(),
    onRemoveFile: jest.fn(),
    onScan: jest.fn(),
    onEnterManually: jest.fn(),
    ...overrides,
  };
  return { ...render(<OcrDocumentIntake {...props} />), props };
}

test("validates supported OCR formats and the backend's 15 MB limit", () => {
  expect(validateOcrFile(new File(["pdf"], "rate.pdf", { type: "application/pdf" }))).toBe("");
  expect(validateOcrFile(new File(["image"], "rate.tiff", { type: "image/tiff" }))).toBe("");
  expect(validateOcrFile(new File([], "empty.pdf", { type: "application/pdf" }))).toMatch(/empty/);
  expect(validateOcrFile(new File(["bad"], "rate.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }))).toMatch(/Unsupported file type/);
  expect(validateOcrFile({ name: "large.pdf", type: "application/pdf", size: MAX_OCR_FILE_SIZE + 1 })).toMatch(/15 MB/);
});

test("accepts files from the chooser and exposes manual entry", () => {
  const { props } = renderIntake();
  const file = new File(["rate"], "confirmation.pdf", { type: "application/pdf" });

  fireEvent.change(screen.getByLabelText("Upload rate confirmation document"), { target: { files: [file] } });

  expect(props.onFileSelected).toHaveBeenCalledWith(file);
  fireEvent.click(screen.getByRole("button", { name: "Enter Manually" }));
  expect(props.onEnterManually).toHaveBeenCalledTimes(1);
});

test("accepts files dropped onto the upload zone", () => {
  const { props } = renderIntake();
  const file = new File(["rate"], "dropped.pdf", { type: "application/pdf" });
  fireEvent.drop(screen.getByRole("button", { name: /Drop a rate confirmation here/ }), {
    dataTransfer: { files: [file] },
  });
  expect(props.onFileSelected).toHaveBeenCalledWith(file);
});

test("rejects unsupported files and disables duplicate scans while scanning", () => {
  const { rerender } = renderIntake({ scanning: true, file: new File(["rate"], "rate.pdf", { type: "application/pdf" }) });
  expect(screen.getByRole("button", { name: "Scanning…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Enter Manually" })).toBeDisabled();

  rerender(<OcrDocumentIntake
    id="test-document"
    file={null}
    onFileSelected={jest.fn()}
    onRemoveFile={jest.fn()}
    onScan={jest.fn()}
    onEnterManually={jest.fn()}
  />);
  fireEvent.change(screen.getByLabelText("Upload rate confirmation document"), {
    target: { files: [new File(["bad"], "rate.txt", { type: "text/plain" })] },
  });
  expect(screen.getByRole("alert")).toHaveTextContent(/Unsupported file type/);
});

test("renders extracted details and every stop in sequence on the review surface", () => {
  render(
    <OcrExtractionReview
      id="order-review"
      title="Order Review"
      sourceFile={new File(["pdf"], "rate.pdf", { type: "application/pdf" })}
      groups={[{ title: "Rates & Charges", fields: [
        { label: "Gross amount", value: "1200", source: "PDF Extracted" },
        { label: "Currency", value: "", needsReview: true },
      ] }]}
      stops={[
        { type: "Pickup", name: "Origin", address: "1 Main St", time: "08:00" },
        { type: "Delivery", name: "Destination", address: "2 Main St", reference: "REF-2" },
      ]}
      onEdit={jest.fn()}
      onReviewAndSave={jest.fn()}
    />
  );

  expect(screen.getByRole("heading", { name: "Order Review" })).toBeInTheDocument();
  expect(screen.getByText("items need attention")).toBeInTheDocument();
  expect(screen.getByText("Stop 1")).toBeInTheDocument();
  expect(screen.getByText("Stop 2")).toBeInTheDocument();
  expect(screen.getByText("1 Main St")).toBeInTheDocument();
  expect(screen.getByText("REF-2")).toBeInTheDocument();
  expect(screen.getByText("rate.pdf")).toBeInTheDocument();
});
