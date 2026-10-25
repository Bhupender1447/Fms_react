import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CheckHos from "./Checkhos";

test("legacy HOS assessment screen stays unavailable and links to SIS requirements", () => {
  render(<MemoryRouter><CheckHos /></MemoryRouter>);

  expect(screen.getByRole("heading", { name: "Hours of Service Assessment" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "HOS calculations are disabled" })).toBeInTheDocument();
  expect(screen.getByText(/No HOS result, violation status, or dispatch clearance is available/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Review SIS Safety requirements" })).toHaveAttribute("href", "/sis/safety");
  expect(screen.queryByRole("button", { name: /check hos/i })).not.toBeInTheDocument();
  expect(screen.queryByText(/No Violations/i)).not.toBeInTheDocument();
});
