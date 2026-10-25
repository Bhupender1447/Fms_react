import React from "react";
import axios from "axios";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Assigntrip from "./Assign";

jest.mock("axios");

test("trip assignment makes clear that HOS is not assessed or cleared", async () => {
  axios.get.mockResolvedValue({ data: { trailors: [], trucks: [], drivers: [], product_data: {} } });
  render(
    <MemoryRouter initialEntries={["/trips/assign/42"]}>
      <Routes>
        <Route path="/trips/assign/:id" element={<Assigntrip />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(/HOS status: Not assessed\./)).toBeInTheDocument();
  expect(screen.getByText(/Trip assignment does not evaluate driver hours/i)).toBeInTheDocument();
  expect(screen.getByText(/is not HOS or dispatch compliance clearance/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Review SIS Safety requirements" })).toHaveAttribute("href", "/sis/safety");
});
