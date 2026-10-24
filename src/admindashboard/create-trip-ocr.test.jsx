import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Createtrips from "./trips/Createtrips";

jest.mock("axios");
jest.mock("./Distancepopup", () => () => null);

beforeEach(() => {
  localStorage.setItem("logindetail", JSON.stringify({ id: 1 }));
  axios.get.mockReturnValue(new Promise(() => {}));
});

afterEach(() => jest.clearAllMocks());

test("starts with top-aligned document intake and no trip form", () => {
  render(<MemoryRouter><Createtrips /></MemoryRouter>);

  expect(screen.getByRole("heading", { name: /Create trip/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Rate Confirmation PDF" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Scan & Autofill" })).toBeDisabled();
  expect(screen.getByLabelText("Company")).not.toBeVisible();
});

test("keeps OCR review and all returned stops below upload without saving the trip", async () => {
  axios.post.mockResolvedValue({
    data: {
      success: true,
      data: {},
      gpt_response: {
        structured_json: {
          broker_name: "Northwind Logistics",
          loadno: "LOAD-42",
          stops: [
            { stoptype: "Pickup", name: "Origin", address: "1 Main St", date: "2026-11-01", time: "08:00" },
            { stoptype: "Delivery", name: "Destination", address: "2 Main St", reference: "REF-2" },
          ],
        },
      },
    },
  });
  render(<MemoryRouter><Createtrips /></MemoryRouter>);
  const file = new File(["pdf"], "rate-confirmation.pdf", { type: "application/pdf" });
  fireEvent.change(screen.getByLabelText("Upload rate confirmation document"), { target: { files: [file] } });
  fireEvent.click(screen.getByRole("button", { name: "Scan & Autofill" }));

  expect(await screen.findByRole("heading", { name: "Trip Review" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Rate Confirmation PDF" })).toBeInTheDocument();
  expect(screen.getAllByText("LOAD-42").length).toBeGreaterThan(0);
  expect(screen.getByText("Stop 1")).toBeInTheDocument();
  expect(screen.getByText("Stop 2")).toBeInTheDocument();
  expect(screen.getByText("1 Main St")).toBeInTheDocument();
  expect(screen.getByText("2 Main St")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Review & Save Trip" })).toBeInTheDocument();
  expect(axios.post.mock.calls.some(([url]) => String(url).includes("api/create"))).toBe(false);
  expect(screen.getByLabelText("Company")).not.toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Edit Information" }));
  expect(screen.getByLabelText("Company")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Apply Changes / Back to Review" }));
  expect(screen.getByRole("heading", { name: "Trip Review" })).toBeInTheDocument();
});
