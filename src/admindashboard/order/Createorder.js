/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from "axios";
import { Alert } from "../../design-system/components";
import "../../design-system/forms.css";
import EntryFormGuide from "../EntryFormGuide";
import { useEffect, useRef, useState } from "react";
import Distancepopup from "../Distancepopup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import AddressAutocomplete from "../../components/Map/AddressAutocomplete";
import OcrDocumentIntake from "../../components/OcrDocumentIntake";
import OcrExtractionReview, { flattenOcrFields } from "../../components/OcrExtractionReview";

const Createorder = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const [referenceError, seterror] = useState(null);
  const [getdataid, setgetdataid] = useState(0);
  let userdata = JSON.parse(localStorage.getItem("logindetail"));
  const initialState = {
    company: "",
    customerorderno: "",
    shipmenttype: "Regular",
    loadtype: "",
    loadno: "",
    pickupnote: "",
    customer_id: "",
    salesman: "",
    commodity: [""],
    weight: [""],
    unit: [""],
    package: [""],
    trailortype: "",
    hazmat: "",
    refer: "",
    temprature: "",
    pip: "",
    ctpat: "",
    pickup_from: "",
    pickup_address: "",
    pickupdate: "",
    pickuptime: "",
    appt: "NO",
    pickup_refno: "",
    pickup_desc: "",
    manageTablestops_length: "",
    delivery: "",
    delivery_address: "",
    deliverydate: "",
    deliverytime: "",
    delivery_refno: "",
    dappointment: "",
    delivery_desc: "",
    revitem: [],
    ratemethod: [],
    rate: "",
    ratevalue: "",
    gross_amount: "",
    hst: "",
    hstamount: "",
    cst: "",
    cstamount: "",
    net_amount: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  // OCR Logic
  const [ocrFile, setOcrFile] = useState(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrScanError, setOcrScanError] = useState("");
  const [ocrResult, setOcrResult] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isEditingOcr, setIsEditingOcr] = useState(false);
  const [ocrCustomerName, setOcrCustomerName] = useState("");
  const [ocrCustomerCandidates, setOcrCustomerCandidates] = useState([]);
  const [selectedOcrCustomerId, setSelectedOcrCustomerId] = useState("");
  const [manualFields, setManualFields] = useState(() => new Set());
  const ocrBaselineRef = useRef(null);
  const reviewHeadingRef = useRef(null);

  const flattenObject = (obj, prefix = "", res = {}) => {
    for (let key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (typeof value === "object" && value !== null) {
        flattenObject(value, newKey, res);
      } else {
        res[newKey.toLowerCase()] = String(value);
      }
    }
    return res;
  };

  const handleOcrFileChange = (file) => {
    if ((manualFields.size > 0 || isEditingOcr) && !window.confirm("Replace the source document? Your manual edits will be retained where possible.")) {
      return false;
    }
    if (ocrResult && ocrBaselineRef.current) {
      const baseline = ocrBaselineRef.current;
      setFormData((previous) => {
        const restored = { ...baseline.formData };
        manualFields.forEach((field) => { restored[field] = previous[field]; });
        return restored;
      });
      setStops(manualFields.has("stops") ? stops : baseline.stops);
      ocrBaselineRef.current = null;
    }
    setOcrFile(file);
    setOcrResult(null);
    setOcrScanError("");
    setOcrCustomerName("");
    setOcrCustomerCandidates([]);
    setSelectedOcrCustomerId("");
    return true;
  };

  const handleOcrFileRemoved = () => {
    if (manualFields.size > 0 && !window.confirm("Remove the source document? Your manual edits will be retained.")) return;
    if (ocrResult && ocrBaselineRef.current) {
      const baseline = ocrBaselineRef.current;
      setFormData((previous) => {
        const restored = { ...baseline.formData };
        manualFields.forEach((field) => { restored[field] = previous[field]; });
        return restored;
      });
      setStops(manualFields.has("stops") ? stops : baseline.stops);
      ocrBaselineRef.current = null;
    }
    setOcrFile(null);
    setOcrResult(null);
    setOcrScanError("");
    setOcrCustomerName("");
    setOcrCustomerCandidates([]);
    setSelectedOcrCustomerId("");
  };

  const normalizeOcrStops = (response) => {
    const structured = response?.gpt_response?.structured_json || {};
    const raw = response?.data || {};
    const extracted = Array.isArray(structured.stops) ? structured.stops : Array.isArray(raw.stops) ? raw.stops : [];
    const text = (value) => value === null || value === undefined ? "" : String(value).trim();
    if (extracted.length) {
      return extracted.filter((stop) => stop !== null && stop !== undefined).map((stop) => {
        if (typeof stop === "string") {
          return { stoptype: "Type not identified", name: "", location: stop.trim(), address: stop.trim(), needsReview: true };
        }
        if (typeof stop !== "object") return null;
        const rawType = text(stop.stoptype || stop.stop_type || stop.type);
        return {
          stoptype: /pickup|origin|shipper|load/i.test(rawType) ? "Pickup" : /delivery|destination|consignee/i.test(rawType) ? "Delivery" : "Type not identified",
          name: text(stop.name || stop.location_name || stop.company || stop.label),
          location: text(stop.address || stop.full_address || stop.location || stop.address1),
          address: text(stop.address || stop.full_address || stop.location || stop.address1),
          date: text(stop.date || stop.stop_date || stop.arrival_date),
          time: text(stop.time || stop.stop_time || stop.arrival_time),
          timezone: text(stop.timezone || stop.time_zone),
          appointmentWindow: text(stop.appointment_window || stop.appointmentWindow),
          contactName: text(stop.contact_name || stop.contact),
          contactPhone: text(stop.contact_phone || stop.phone),
          reference: text(stop.reference || stop.reference_number || stop.refno),
          instructions: text(stop.instructions || stop.notes),
          needsReview: !rawType,
        };
      }).filter(Boolean);
    }
    return [];
  };

  const handleOcrUpload = async () => {
    if (!ocrFile) {
      setOcrScanError("Choose a document before scanning.");
      return;
    }
    
    setOcrScanError("");
    setIsOcrLoading(true);
    if (!ocrBaselineRef.current) ocrBaselineRef.current = { formData, stops };
    
    const ocrData = new FormData();
    ocrData.append("file", ocrFile);
    ocrData.append("module_type", "order");
    ocrData.append("prompt", `Extract only information visible on the document into strict JSON. Use empty strings or empty arrays for missing values; do not infer amounts, dates, addresses, or identities. Include: company, loadno, salesman, customer_id, pickup_from, pickup_address, delivery, delivery_address, pickupdate (YYYY-MM-DD), pickuptime, deliverydate (YYYY-MM-DD), deliverytime, rate, currency, gross_amount, accessorials, payment_terms, trailortype, commodity, weight, unit, package, seal_numbers, temprature, pickup_refno, delivery_refno, pickup_desc, delivery_desc, and stops. stops must be an array in exact document sequence; each stop has stoptype, name, address, date, time, timezone, appointment_window, contact_name, contact_phone, reference, and instructions. Return ONLY valid JSON.`);

    try {
      const response = await axios.post(
        `${BASE_URL}OCRController/simple_openai_process`,
        ocrData,
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        setOcrResult(response.data);
        setShowManualEntry(false);
        setIsEditingOcr(false);
        const extractedStops = normalizeOcrStops(response.data);
        if (extractedStops.length && !manualFields.has("stops")) setStops(extractedStops);
        else if (!manualFields.has("stops")) {
          const extracted = response.data.gpt_response?.structured_json || response.data.data || {};
          const getExtracted = (key, fallback = "") => {
            const value = extracted[key];
            return value === null || value === undefined || value === "" ? fallback || formData[key] || "" : value;
          };
          const pickupLocation = (data.locations || []).find((location) => String(location.id) === String(formData.pickup_from));
          const deliveryLocation = (data.locations || []).find((location) => String(location.id) === String(formData.delivery));
          const fallbackStops = [
            (getExtracted("pickup_address", formData.pickup_address) || getExtracted("pickup_from") || pickupLocation) && {
              stoptype: "Pickup",
              name: getExtracted("pickup_from", pickupLocation?.name),
              location: getExtracted("pickup_address", pickupLocation?.address1),
              address: getExtracted("pickup_address", pickupLocation?.address1),
              date: getExtracted("pickupdate", ""),
              time: getExtracted("pickuptime", ""),
              reference: getExtracted("pickup_refno", ""),
              instructions: getExtracted("pickup_desc", ""),
            },
            (getExtracted("delivery_address", formData.delivery_address) || getExtracted("delivery") || deliveryLocation) && {
              stoptype: "Delivery",
              name: getExtracted("delivery", deliveryLocation?.name),
              location: getExtracted("delivery_address", deliveryLocation?.address1),
              address: getExtracted("delivery_address", deliveryLocation?.address1),
              date: getExtracted("deliverydate", ""),
              time: getExtracted("deliverytime", ""),
              reference: getExtracted("delivery_refno", ""),
              instructions: getExtracted("delivery_desc", ""),
            },
          ].filter(Boolean);
          setStops(fallbackStops);
        }
        let matchCount = 0;
        const gptData = response.data.gpt_response?.structured_json || {};
        const ocrDataRaw = response.data.data || {};
        const flatOCR = flattenObject(ocrDataRaw);

        // --- UNIVERSAL MAPPING SOURCE GENERATION ---
        const combinedSource = { ...flatOCR };

        if (gptData.names) gptData.names.forEach((n, i) => combinedSource[`gpt_name_${i}`] = n);
        if (gptData.addresses) gptData.addresses.forEach((a, i) => combinedSource[`gpt_address_${i}`] = a);
        if (gptData.dates) Object.entries(gptData.dates).forEach(([k, v]) => combinedSource[`gpt_date_${k}`] = v);
        if (gptData.numbers) Object.entries(gptData.numbers).forEach(([k, v]) => combinedSource[`gpt_number_${k}`] = v);
        if (gptData.records?.[0]) {
          Object.entries(gptData.records[0]).forEach(([k, v]) => {
            combinedSource[`rec_${k}`] = String(v);
          });
        }

        const flatGPT = flattenObject(gptData);
        Object.entries(flatGPT).forEach(([k, v]) => {
          combinedSource[`gpt_${k}`] = String(v);
        });

        const extractedCustomer = gptData.customer_id || gptData.customer || gptData.client ||
          ocrDataRaw.customer_id || ocrDataRaw.customer || ocrDataRaw.client || "";
        if (extractedCustomer) {
          const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
          const normalizedValue = normalize(extractedCustomer);
          const candidates = (data.customers || []).filter((customer) => {
            const name = customer.name || customer.legal || customer.company_name || customer.customer_name;
            const normalizedName = normalize(name);
            return normalizedValue && normalizedName &&
              (normalizedName.includes(normalizedValue) || normalizedValue.includes(normalizedName));
          });
          setOcrCustomerName(String(extractedCustomer).trim());
          setOcrCustomerCandidates(candidates);
          setSelectedOcrCustomerId(candidates.length === 1 ? String(candidates[0].id) : "");
        } else {
          setOcrCustomerName("");
          setOcrCustomerCandidates([]);
          setSelectedOcrCustomerId("");
        }

        setFormData((prev) => {
          const updated = { ...prev };
          const sourceKeys = Object.keys(combinedSource);

          const isFieldEmpty = (val) => {
            if (val === null || val === undefined) return true;
            const s = String(val).trim();
            if (s === "") return true;
            if (Array.isArray(val)) return val.length === 0 || (val.length === 1 && String(val[0]).trim() === "");
            return false;
          };

          const getMatch = (synonyms) => {
            const key = sourceKeys.find(k => synonyms.some(s => {
              const kLower = k.toLowerCase();
              const sLower = s.toLowerCase();
              return kLower === sLower || kLower === `gpt_${sLower}` || kLower.includes(sLower);
            }));
            return key ? combinedSource[key] : null;
          };

          // 1. Map existing pickup/delivery locations; customer matches require confirmation.
          const pickupLoc = getMatch(['pickup_from', 'shipper', 'origin']);
          if (pickupLoc && !manualFields.has("pickup_from") && isFieldEmpty(updated.pickup_from)) {
            const loc = data.locations?.find(l => l.name?.toLowerCase().includes(String(pickupLoc).toLowerCase()));
            if (loc) { updated.pickup_from = loc.id; matchCount++; }
          }

          const deliveryLoc = getMatch(['delivery', 'consignee', 'destination']);
          if (deliveryLoc && !manualFields.has("delivery") && isFieldEmpty(updated.delivery)) {
            const loc = data.locations?.find(l => l.name?.toLowerCase().includes(String(deliveryLoc).toLowerCase()));
            if (loc) { updated.delivery = loc.id; matchCount++; }
          }

          // Format specific units
          const unitVal = getMatch(['unit']);
          if (unitVal && !manualFields.has("unit") && isFieldEmpty(updated.unit)) {
            let uStr = String(unitVal).toUpperCase();
            if (uStr.includes("LBS") || uStr.includes("POUND")) uStr = "Pounds";
            else if (uStr.includes("KGS") || uStr.includes("KILOS")) uStr = "KGs";
            else if (uStr.includes("TON")) uStr = "Tons";
            updated.unit = [uStr];
            matchCount++;
          }

          // 4. Final catch-all & Logic for Arrays/Numbers
          Object.keys(updated).forEach(field => {
            const isDefault = ["No", "Regular", "LTL", "Hazmat", "13", "0"].includes(String(updated[field]));
            if (manualFields.has(field) || (!isFieldEmpty(updated[field]) && !isDefault && field !== 'loadno')) return;
            if (field === "customer_id") return;

            const val = getMatch([field]);
            if (val) {
              if (Array.isArray(updated[field])) {
                updated[field] = [String(val)];
              } else if (!isNaN(prev[field]) && typeof prev[field] === 'number') {
                updated[field] = String(val).replace(/[^\d.]/g, "");
              } else {
                updated[field] = String(val).substring(0, 300);
              }
              matchCount++;
            }
          });

          if (matchCount > 0) {
            toast.success(`OCR processed successfully. Mapped ${matchCount} details.`);
          } else {
            toast.warning("OCR processed but no matching fields found.");
          }

          return updated;
        });

      } else {
        setOcrScanError("The document could not be read. Retry the scan or enter the details manually.");
      }
    } catch (err) {
      console.error(err);
      setOcrScanError("The document could not be scanned. Check your connection and retry, or enter the details manually.");
    } finally {
      setIsOcrLoading(false);
    }
  };


  const [stops, setStops] = useState([]);
  const addStop = () => {
    setManualFields((previous) => new Set(previous).add("stops"));
    const newStop = {
      stoptype: "Delivery", // Default value
      location: "", // Default value
    };
    setStops([...stops, newStop]);
  };

  const handleStopChange = (index, field, value) => {
    setManualFields((previous) => new Set(previous).add("stops"));
    const updatedStops = [...stops];
    updatedStops[index] = { ...updatedStops[index], [field]: value };
    setStops(updatedStops);
  };

  const handleRemoveRow = (index) => {
    setManualFields((previous) => new Set(previous).add("commodity").add("weight").add("unit").add("package"));
    setFormData((prev) => {
      const newData = { ...prev };
      newData.commodity = prev.commodity.filter((_, i) => i !== index);
      newData.weight = prev.weight.filter((_, i) => i !== index);
      newData.unit = prev.unit.filter((_, i) => i !== index);
      newData.package = prev.package.filter((_, i) => i !== index);
      return newData;
    });
  };

  const handleAddRow = () => {
    setManualFields((previous) => new Set(previous).add("commodity").add("weight").add("unit").add("package"));
    setFormData((prev) => ({
      ...prev,
      commodity: [...prev.commodity, ""],
      weight: [...prev.weight, ""],
      unit: [...prev.unit, ""],
      package: [...prev.package, ""],
    }));
  };
  const [, setmessage] = useState();
  const [popup, setpopup] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualFields((previous) => new Set(previous).add(name));

    if (name === "delivery") {
      // Find the selected location based on the value (id)
      const selectedLocation = data.locations.find((item) => item.id === value);

      // Update formData with the new delivery address and delivery id
      setFormData({
        ...formData,
        [name]: value,
        delivery_address: selectedLocation ? selectedLocation.address1 : "",
      });
    } else if (name === "pickup_from") {
      const selectedLocation = data.locations.find((item) => item.id === value);

      // Update formData with the new delivery address and delivery id
      setFormData({
        ...formData,
        [name]: value,
        pickup_address: selectedLocation ? selectedLocation.address1 : "",
      });
    } else {
      // For other input fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Perform calculations if relevant fields change
    if (["gross_amount", "hst", "cst", "rate", "ratevalue"].includes(name)) {
      calculateAmounts(name, value);
    }
  };

  const calculateAmounts = (name, value) => {
    const rate = parseFloat(name === "rate" ? value : formData.rate) || 0;
    const rateValue =
      parseFloat(name === "ratevalue" ? value : formData.ratevalue) || 0;

    // Calculate gross amount dynamically
    const gross =
      name === "rate" || name === "ratevalue"
        ? rate * rateValue
        : parseFloat(formData.gross_amount) || 0;

    const hst = parseFloat(name === "hst" ? value : formData.hst) || 0;
    const cst = parseFloat(name === "cst" ? value : formData.cst) || 0;

    // Calculate HST and CST amounts
    const hstAmount = (gross * hst) / 100;
    const cstAmount = (gross * cst) / 100;

    // Calculate Net Amount
    const netAmount = gross + hstAmount + cstAmount;

    // Update formData with calculated values
    setFormData((prev) => ({
      ...prev,
      gross_amount: gross.toFixed(2),
      hstamount: hstAmount.toFixed(2),
      cstamount: cstAmount.toFixed(2),
      net_amount: netAmount.toFixed(2),
    }));
  };
  const handleInputChange2 = (e, index, field) => {
    const { value } = e.target;
    setManualFields((previous) => new Set(previous).add(field));

    setFormData((prevState) => {
      const updatedFormData = { ...prevState };
      updatedFormData[field] = [...(prevState[field] || [])];

      // Update the value at the specified index
      updatedFormData[field][index] = value;

      return updatedFormData;
    });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}api/getOrderData`)
      .then((res) => {
        setdata(res.data);
        setFormData(prev => ({ ...prev, customerorderno: res && res.data.orderno }));
        console.log(res.data);
      })
      .catch((error) => seterror(error));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (ocrResult && !isEditingOcr) {
      window.requestAnimationFrame?.(() => reviewHeadingRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }));
    }
  }, [ocrResult, isEditingOcr]);

  useEffect(() => {
    if ((!ocrResult && !ocrFile && manualFields.size === 0 && !isOcrLoading) || getdataid) return undefined;
    const warnBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [ocrResult, ocrFile, manualFields, getdataid, isOcrLoading]);

  let handleonSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || (ocrResult && getdataid)) return;

    if (!formData.company || !formData.customer_id || !formData.pickup_from || !formData.delivery) {
      const message = "Please fill in required fields: Company, Customer, Pickup, and Delivery.";
      setSaveError(message);
      toast.error(message);
      return;
    }
    if (ocrCustomerName && !customerRecord) {
      setSaveError("Confirm the OCR customer against an existing IFM record or choose the correct customer manually before saving.");
      toast.error("Confirm the customer record before saving.");
      return;
    }

    setSaveError("");
    setIsSubmitting(true);

    const form = new FormData();
    form.append("userid", userdata.id);
    form.append("company", formData.company);
    form.append("customerorderno", formData.customerorderno);
    form.append("shipmenttype", formData.shipmenttype);
    form.append("loadtype", formData.loadtype);
    form.append("pickupnote", formData.pickupnote);
    form.append("customer_id", formData.customer_id);
    form.append("salesman", formData.salesman);
    form.append("loadno", formData.loadno);
    form.append("commodity[]", formData.commodity);
    form.append("weight[]", formData.weight);
    form.append("unit[]", formData.unit);
    form.append("package[]", formData.package);
    form.append("trailortype", formData.trailortype);
    form.append("hazmat", formData.hazmat);
    form.append("refer", formData.refer);
    form.append("temprature", formData.temprature);
    form.append("pip", formData.pip);
    form.append("ctpat", formData.ctpat);
    form.append("pickup_from", formData.pickup_from);
    form.append("pickup_address", formData.pickup_address);
    form.append("pickupdate", formData.pickupdate);
    form.append("pickuptime", formData.pickuptime);
    form.append("pickup_refno", formData.pickup_refno);
    form.append("appt", formData.appt);
    form.append("pickup_desc", formData.pickup_desc);
    form.append("Location12", JSON.stringify(stops));
    form.append("manageTablestops_length", formData.manageTablestops_length);
    form.append("delivery", formData.delivery);
    form.append("delivery_address", formData.delivery_address);
    form.append("deliverydate", formData.deliverydate);
    form.append("deliverytime", formData.deliverytime);
    form.append("delivery_refno", formData.delivery_refno);
    form.append("dappointment", formData.dappointment);
    form.append("delivery_desc", formData.delivery_desc);
    form.append("revitem[]", formData.revitem);
    form.append("ratemethod[]", formData.ratemethod);
    form.append("rate[]", formData.rate);
    form.append("ratevalue[]", formData.ratevalue);
    form.append("gross_amount", formData.gross_amount);
    form.append("hst", formData.hst);
    form.append("hstamount", formData.hstamount);
    form.append("cst", formData.cst);
    form.append("cstamount", formData.cstamount);
    form.append("net_amount", formData.net_amount);

    try {
      const response = await axios.post(
        `${BASE_URL}api/create`,
        form
      );
      setmessage(response.data.message);

      setgetdataid(response.data.id);
      setpopup(false);
      toast.success("Successfully created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      if (!ocrResult) {
        setFormData(initialState);
        navigate(-1);
      }

    } catch (error) {
      setSaveError("The order could not be saved. Your entries are preserved. Check your connection before retrying.");
      toast.error("The order could not be saved. Check your connection and try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const customerRecord = (data.customers || []).find((customer) => String(customer.id) === String(formData.customer_id));
  const customerDisplayName = (customer) => customer?.name || customer?.legal || customer?.company_name || customer?.customer_name || "";
  const orderSourceFields = {
    "Order reference": ["customerorderno"], "Load ID": ["loadno"], Company: ["company"],
    "Shipment type": ["shipmenttype"], "Load type": ["loadtype"], Service: ["trailortype"],
    Salesperson: ["salesman"], Commodity: ["commodity"], Weight: ["weight"],
    "Weight unit": ["unit"], "Quantity / packages": ["package"], "Equipment type": ["trailortype"],
    Hazmat: ["hazmat"], "Temperature requirements": ["temprature"], "Seal / reference": ["refer"],
    Rate: ["rate"], "Rate value": ["ratevalue"], "Gross amount": ["gross_amount"],
    HST: ["hst", "hstamount"], CST: ["cst", "cstamount"], "Net amount": ["net_amount"],
    "Pickup instructions": ["pickup_desc", "pickupnote"], "Delivery instructions": ["delivery_desc"],
    "Special instructions": ["pip"], CTPAT: ["ctpat"],
  };
  const orderReviewGroups = [
    { title: "Order Overview", fields: [
      { label: "Order reference", value: formData.customerorderno },
      { label: "Load ID", value: formData.loadno },
      { label: "Company", value: formData.company },
      { label: "Shipment type", value: formData.shipmenttype },
      { label: "Load type", value: formData.loadtype },
      { label: "Service", value: formData.trailortype },
      { label: "Salesperson", value: formData.salesman },
    ] },
    { title: "Cargo & Equipment", fields: [
      { label: "Commodity", value: formData.commodity },
      { label: "Weight", value: formData.weight },
      { label: "Weight unit", value: formData.unit },
      { label: "Quantity / packages", value: formData.package },
      { label: "Equipment type", value: formData.trailortype },
      { label: "Hazmat", value: formData.hazmat },
      { label: "Temperature requirements", value: formData.temprature },
      { label: "Seal / reference", value: formData.refer },
    ] },
    { title: "Rates & Charges", fields: [
      { label: "Rate", value: formData.rate },
      { label: "Rate value", value: formData.ratevalue },
      { label: "Gross amount", value: formData.gross_amount },
      { label: "HST", value: formData.hstamount },
      { label: "CST", value: formData.cstamount },
      { label: "Net amount", value: formData.net_amount },
    ] },
    { title: "Documents, Notes & Special Instructions", fields: [
      { label: "Pickup instructions", value: formData.pickup_desc || formData.pickupnote },
      { label: "Delivery instructions", value: formData.delivery_desc },
      { label: "Special instructions", value: formData.pip },
      { label: "CTPAT", value: formData.ctpat },
    ] },
  ].map((group) => ({
    ...group,
    fields: group.fields.map((field) => ({
      ...field,
      source: (orderSourceFields[field.label] || []).some((key) => manualFields.has(key))
        ? "Manual" : ocrResult ? "Unverified" : "Manual",
    })),
  }));
  const orderReviewStops = stops.map((stop) => ({
    type: stop.stoptype,
    name: stop.name,
    address: stop.address || stop.location,
    date: stop.date || stop.stop_date,
    time: stop.time || stop.stop_time,
    timezone: stop.timezone,
    appointmentWindow: stop.appointmentWindow,
    contactName: stop.contactName,
    contactPhone: stop.contactPhone,
    reference: stop.reference || stop.refno,
    instructions: stop.instructions || stop.notes,
    source: manualFields.has("stops") ? "Manual" : "Unverified",
    needsReview: !(stop.address || stop.location) || stop.stoptype === "Type not identified",
  }));
  const confirmOrderCustomer = () => {
    if (!selectedOcrCustomerId) return;
    setManualFields((previous) => new Set(previous).add("customer_id"));
    setFormData((previous) => ({ ...previous, customer_id: selectedOcrCustomerId }));
  };

  return (
    <div className="content-wrapper iso-ui iso-form-workspace iso-entry-page" data-iso-theme="light">
      <section className="content-header">
        <h1>
          Create order
          <small>Customer, route and pricing details</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Orders</li>
        </ol>
      </section>
      <section className="content">
        <OcrDocumentIntake
          id="order-ocr-document"
          file={ocrFile}
          scanning={isOcrLoading}
          scanError={ocrScanError}
          onFileSelected={handleOcrFileChange}
          onRemoveFile={handleOcrFileRemoved}
          onScan={handleOcrUpload}
          onEnterManually={() => { setShowManualEntry(true); setIsEditingOcr(false); }}
        />
        {ocrResult && !isEditingOcr && (
          <OcrExtractionReview
            id="order-review"
            title="Order Review"
            sourceFile={ocrFile}
            groups={orderReviewGroups}
            stops={orderReviewStops}
            extraFields={flattenOcrFields(ocrResult?.gpt_response?.structured_json || ocrResult?.data || {})}
            broker={{
              title: "Customer Information",
              status: customerRecord ? "Matched" : ocrCustomerName ? (ocrCustomerCandidates.length > 1 ? "Multiple Matches / Confirm" : ocrCustomerCandidates.length === 1 ? "Match Requires Confirmation" : "No Match") : "No Match",
              ocrFields: [{ label: "Customer from PDF", value: ocrCustomerName, source: "PDF Extracted" }],
              candidates: ocrCustomerCandidates.map((customer) => ({ id: customer.id, name: customerDisplayName(customer) })),
              selectedId: selectedOcrCustomerId,
              profileLabel: "View Customer Profile",
              onSelect: setSelectedOcrCustomerId,
              onConfirm: confirmOrderCustomer,
              record: customerRecord,
              recordFields: Object.entries(customerRecord || {}).filter(([key, value]) =>
                /name|legal|address|city|state|postal|zip|country|phone|email|\bmc\b/i.test(key) &&
                key.toLowerCase() !== "id" && value !== null && value !== undefined && String(value).trim()
              ).map(([label, value]) => ({ label, value, source: "IFM Record" })),
              notice: customerRecord ? "Customer selected from the IFM record. PDF values do not modify the customer profile." : "Confirm a single IFM customer record or edit the customer manually. No customer profile is created or changed.",
            }}
            persistenceNotice="The current create API stores stop type and location/address, but does not persist OCR stop appointments, contacts, references, time zones, or instructions."
            savedRecordId={getdataid || undefined}
            savedLink={getdataid ? `/assign/${getdataid}` : undefined}
            savedLinkLabel="Assign order"
            onEdit={() => { setIsEditingOcr(true); setShowManualEntry(true); }}
            onReviewAndSave={() => setpopup(true)}
            isSaving={isSubmitting}
            headingRef={reviewHeadingRef}
          />
        )}
        {isEditingOcr && (
          <div className="ocr-review__actionbar">
            <button type="button" className="btn btn-primary" onClick={() => { setIsEditingOcr(false); setShowManualEntry(false); }}>
              Apply Changes / Back to Review
            </button>
          </div>
        )}
        {showManualEntry && <EntryFormGuide kind="order" values={formData} onReview={() => setpopup(true)} />}
        {referenceError && <Alert tone="danger" title="Order reference data could not be loaded">Company and customer options may be unavailable. Check your connection and reload this page before saving.</Alert>}
        {/* Small boxes (Stat box) */}
        <div className="row" hidden={!showManualEntry} style={!showManualEntry ? { display: "none" } : undefined}>
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <div className="box">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <h4 id="order-customer-details">
                    <span className="label label-success">
                      CUSTOMER DETAILS
                    </span>
                  </h4>
                  <h3 align="center">Order # : {data && data.orderno}</h3>
                </div>
              </div>
              {/* /.box-header */}
              <form
                role="form"
                action=""
                method="post"
                encType="multipart/form-data"
              >
                <div className="box-body">
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <select
                          className="form-control"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Company</option>
                          {data.company_data?.map((item) => (
                            <option value={item.company_name}>
                              {item.company_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <input
                      type="hidden"
                      className="form-control"
                      id="customerorderno"
                      name="customerorderno"
                      value={data && data.triprno}
                    />
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="shipmenttype">Shipment Type</label>
                        <select
                          className="form-control"
                          id="shipmenttype"
                          name="shipmenttype"
                          value={formData.shipmenttype}
                          onChange={handleInputChange}
                        >
                          <option value="Regular">Regular</option>
                          <option value="into Canada">into Canada</option>
                          <option value="into USA">into USA</option>
                          <option value="round">round</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="commission">Commmission</label>
                        <select
                          className="form-control"
                          id="commission"
                          name="commission"
                          value={formData.commission}
                          onChange={handleInputChange}
                        >
                          <option value="Order">Order</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-right">
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="customer_id">Brokers</label>
                        <select
                          className="form-control"
                          id="customer_id"
                          name="customer_id"
                          value={formData.customer_id}
                          onChange={handleInputChange}
                        >
                          <option value={23}>
                            RELIANCE LOGISTICS GROUP INC.
                          </option>
                          <option value={19}>LOYAL EXPRESS TRANSPORT</option>
                          <option value={18}>META FACEBOOK</option>
                          <option value={17}>BAKERS FIELD</option>
                          <option value={15}>
                            NATIONAL PRODUCE MARKETING INC
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="loadtype">Load Type</label>
                        <select
                          className="form-control"
                          id="loadtype"
                          name="loadtype"
                          value={formData.loadtype}
                          onChange={handleInputChange}
                        >
                          <option> Select Load type</option>
                          <option value="FTL">FTL</option>
                          <option value="LTL">LTL</option>
                          <option value="single">Single </option>
                          <option value="team">Team (Option)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="frieghton">Frieght on</label>
                        <select
                          className="form-control"
                          id="frieghton"
                          name="frieghton"
                          value={formData.frieghton}
                          onChange={handleInputChange}
                        >
                          <option value="Order">Order</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="salesman">Salesman</label>
                        <select
                          className="form-control"
                          id="salesman"
                          name="salesman"
                          value={formData.salesman}
                          onChange={handleInputChange}
                        >
                          {data.customers?.map((item) => (
                            <option value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="scaleticketno">Scale #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          value={
                            formData.scaleticketno
                              ? formData.scaleticketno
                              : data && data.triprno
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="scaleticketno">Load no #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          value={
                            formData.loadno
                              ? formData.loadno
                              : data && data.loadno
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    {/*
          
           <div class="col-md-12 col-xs-12 pull pull-left">
          
          <div class="form-group">
            <label htmlFor="carrier_desc">Description</label>
            <textarea type="text" class="form-control" id="carrier_desc" name="carrier_desc"  autocomplete="off">
                              </textarea>
          </div> 
          </div>
          */}
                  </div>
                </div>
                {/*   
             <div class="col-md-4 col-xs-12 pull pull-left">
              <div class="form-group">
              <label htmlFor="weight">Weight</label>
               <select class="form-control" id="weight" name="weight">
                      
                      <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>

              </select>
              </div>
          </div>
          */}
                {/*
              <div class="col-md-3 col-xs-12 pull pull-left">
              <div class="form-group">
              <label htmlFor="measurement">Measurement*</label>
              <select class="form-control" id="measurement" name="measurement">
              <option value="Centimeter">Centimeter</option>
               <option value="Feet">Feet</option>
                <option value="Inches">Inches</option>
                 <option value="Meter">Meter</option>
               
              </select>
              </div>
          </div>
              
             <div class="col-md-3 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label htmlFor="l">L*</label>
                  <input type="text" class="form-control" id="l" name="l"  autocomplete="off">
                  </div>
              
              </div>
                 <div class="col-md-3 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label htmlFor="b">B*</label>
                  <input type="text" class="form-control" id="b" name="b"  autocomplete="off">
                  </div>
              
              </div>
                 <div class="col-md-3 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label htmlFor="h">H*</label>
                  <input type="text" class="form-control" id="h" name="h"  autocomplete="off">
                  </div>
              
              </div>
          
             
              
        
        <!--
          
           <div class="col-md-12 col-xs-12 pull pull-left">
          
          <div class="form-group">
            <label htmlFor="shipment_desc">Description</label>
            <textarea type="text" class="form-control" id="shipment_desc" name="shipment_desc" placeholder="Enter Shipment  Notes" autocomplete="off">
                              </textarea>
          </div> 
          </div>
          */}
              </form>
            </div>
            <div className="col-md-6 col-xs-12 pull pull-right">
              {/*
              <div class="col-md-3 col-xs-12 pull pull-left">
               <label for="store">Pack. Type</label>
              <div class="form-group">
              <input type="text" class="form-control"   name="carr_weight"  list="select-list-id1"/>
              </div>
              <datalist id="select-list-id1">
             
                     
                      <option value="Bag">Bag</option>
                      <option value="Bale">Bale</option>
                      <option value="Barrel">Barrel</option>
                      <option value="Basket">Basket</option>
                      <option value="Bin">Bin</option>
                      <option value="Bing Chest">Bing Chest</option>
                      <option value="Box">Box</option>
                      <option value="Bucket">Bucket</option>
                      <option value="Bundle">Bundle</option>
                      <option value="Can">Can</option>
                      <option value="Can Case">Can Case</option>
                      <option value="Carooy">Carooy</option>
                      <option value="Carcass">Carcass</option>
                      <option value="Carton">Carton</option>
                      <option value="Case">Case</option>
                      <option value="Cask">Cask</option>
                      <option value="Centimeter">Centimeter</option>
                      <option value="Chest">Chest</option>
                      <option value="Coil">Coil</option>
                      <option value="Container Bulk Cargo">Container Bulk Cargo</option>
                      <option value="Cord">Cord</option>
                      <option value="Crate">Crate</option>
                      
                      
                      <option value="Cyilnder">Cyilnder</option>
                      <option value="Drum">Drum</option>
                      <option value="Dry Bulk">Dry Bulk</option>
                      <option value="Feet">Feet</option>
                      <option value="Gallon">Gallon</option>
                      
                      <option value="Hamper">Hamper</option>
                      <option value="Heads of Beef">Heads of Beef</option>
                      <option value="Inches">Inches</option>
                      <option value="Keg">Keg</option>
                      <option value="Lift Van">Lift Van</option>
                      <option value="Liquid Bulk">Liquid Bulk</option>
                      <option value="Logos">Logos</option>
                      <option value="Lugs">Lugs</option>
                      <option value="Meter">Meter</option>
                      <option value="Package">Package</option>
                      <option value="Pail">Pail</option>
                      <option value="Parcel">Parcel</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Private Vehicle">Private Vehicle</option>
                      
                      
                      <option value="Quarters of Beef">Quarters of Beef</option>
                      <option value="Reel">Reel</option>
                      <option value="Roll">Roll</option>
                      <option value="Sack">Sack</option>
                      <option value="Sheet">Sheet</option>
                      <option value="Side of Beef">Side of Beef</option>
                      <option value="Skid">Skid</option>
                      <option value="Tank">Tank</option>
                      <option value="Tin">Tin</option>
                      <option value="Tote Bin">Tote Bin</option>
                      <option value="Truck Load">Truck Load</option>
                      <option value="Tube">Tube</option>
                      <option value="Unit">Unit</option>
                      <option value="Vanpack">Vanpack</option>
                      
                      <option value="Vehicle">Vehicle</option>
                      <option value="Wooden Case">Wooden Case</option>

                                            
                          
                      
              </datalist>
              </div>
              
           */}
            </div>
            <div className="col-md-12 col-xs-12 pull pull-left">
              <div className="form-group">
                <h4 id="order-route-details">
                  <span className="label label-success">
                    PICKUP/DELIVERY DETAIL
                  </span>
                </h4>
              </div>
            </div>
            <div className="col-md-6 col-xs-12 pull pull-left">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">
                    Pickup From |{" "}
                    <Link to="/locations/create">Add Location</Link>{" "}
                  </label>
                  <select
                    className="form-control"
                    id="pickup_from"
                    value={formData.pickup_from}
                    onChange={handleInputChange}
                    name="pickup_from"
                  >
                    <option>Select Pickup Location</option>
                    {data.locations?.map((item) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <AddressAutocomplete id="pickup_address" name="pickup_address" label="Pickup Address" value={formData.pickup_address} onChange={handleInputChange} />
              </div>
              <div className="col-md-4 col-xs-12 pull pull-left">
                <label htmlFor="store">Pickup Date</label>
                <div className="input-group date">
                  <input
                    type="date"
                    name="pickupdate"
                    id="pickupdate"
                    className="form-control"
                    value={formData.pickupdate}
                    onChange={handleInputChange}
                  />
                  <div className="input-group-addon">
                    <span className="glyphicon glyphicon-th" />
                  </div>
                </div>
                <input
                  className="form-control"
                  type="time"
                  id="pickuptime"
                  placeholder="Set Time"
                  name="pickuptime"
                  value={formData.pickuptime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="pickup_refno">Refrence No.*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pickup_refno"
                    value={
                      formData.pickup_refno !== undefined
                        ? formData.pickup_refno
                        : data && data.orderno
                          ? data.orderno
                          : "ISV_TRIP-1230"
                    }
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* 
              <div class="col-md-6 col-xs-12 pull pull-left">
               <label for="store">Weight</label>
              <div class="form-group">
              <input type="text" class="form-control" placeholder="Search/Select  Values" list="select-list-id"/>
              </div>
              <datalist id="select-list-id">
             
               <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>
              </datalist>
              </div> */}
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="pickup_desc">Pickup Description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="pickup_desc"
                    name="pickup_desc"
                    placeholder="Enter Pickup Notes"
                    autoComplete="off"
                    value={formData.pickup_desc || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xs-12 pull pull-right">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="delivery">Deliver To</label>
                  <select
                    className="form-control"
                    id="delivery"
                    name="delivery"
                    value={formData.delivery}
                    onChange={handleInputChange}
                  >
                    <option>Select Drop Location</option>
                    {data.locations?.map((item) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <AddressAutocomplete id="delivery_address" name="delivery_address" label="Delivery Address" value={formData.delivery_address} onChange={handleInputChange} />
              </div>
              <div className="col-md-4 col-xs-12 pull pull-left">
                <label htmlFor="store">Delivery Date</label>
                <div className="input-group date">
                  <input
                    type="date"
                    name="deliverydate"
                    id="deliverydate"
                    className="form-control"
                    value={formData.deliverydate}
                    onChange={handleInputChange}
                  />
                  <div className="input-group-addon">
                    <span className="glyphicon glyphicon-th" />
                  </div>
                </div>
                <input
                  className="form-control"
                  type="time"
                  id="deliverytime"
                  placeholder="Set Time"
                  name="deliverytime"
                  value={formData.deliverytime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="delivery_refno">Refrence No.*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="delivery_refno"
                    name="delivery_refno"
                    autoComplete="off"
                    value={
                      formData.delivery_refno
                        ? formData.delivery_refno
                        : data && data.orderno
                    }
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* 
              <div class="col-md-6 col-xs-12 pull pull-left">
               <label for="store">Weight</label>
              <div class="form-group">
              <input type="text" class="form-control" placeholder="Search/Select  Values" list="select-list-id"/>
              </div>
              <datalist id="select-list-id">
             
               <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>
              </datalist>
              </div> */}
              <div className="col-md-4 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="dappointment">Appointment</label>
                  <select
                    className="form-control"
                    id="dappointment"
                    name="dappointment"
                    value={formData.dappointment}
                    onChange={handleInputChange}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="delivery_desc">Delivery Description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="delivery_desc"
                    name="delivery_desc"
                    placeholder="Enter Delivery Notes"
                    autoComplete="off"
                    value={formData.delivery_desc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <input
                type="hidden"
                className="form-control"
                id="lat"
                name="lat"
                autoComplete="off"
              />
              <input
                type="hidden"
                className="form-control"
                id="lng"
                name="lng"
                autoComplete="off"
              />
              <input
                type="hidden"
                className="form-control"
                id="source_lat"
                name="source_lat"
                autoComplete="off"
              />
              <input
                type="hidden"
                className="form-control"
                id="source_lng"
                name="source_lng"
                autoComplete="off"
              />
            </div>
            {/*
                      <div class="col-md-2 col-xs-12 pull pull-left">
                      <div class="form-group">
                      <label htmlFor="stoptype">Stop Type</label>
                      <select class="form-control" id="stoptype" name="stoptype">
                      
                      <option value="Delivery">Delivery</option>
                      <option value="Pickup">Pickup</option>
                      </select>
                      </div>
                      </div>
                      
                      
                      <div class="col-md-6 col-xs-12 pull pull-left">
                      <div class="form-group">
                      <label htmlFor="pac-location">Location</label>
                      <input id="pac-location" name="pac-location" type="text" class="form-control" placeholder="Enter Location Name, Address etc." autocomplete="off" />
                      
                      </div>
                      </div>
                    
                 */}
          </div>
          {/* Add Pickup/Delivery Stops Button */}
          <div className="col-md-12 col-xs-12 pull pull-left">
            <div className="form-group">
              <button
                type="button"
                className="btn btn-info btn-sm"
                onClick={addStop}
              >
                Add Pickup/Delivery Stops
              </button>
            </div>
          </div>

          {/* Render Stops Dynamically */}
          {stops.map((stop, index) => (
            <div key={index} style={{ marginTop: "15px" }}>
              <div className="form-group">
                <label>Stop Type</label>
                <select
                  className="form-control"
                  value={stop.stoptype}
                  onChange={(e) =>
                    handleStopChange(index, "stoptype", e.target.value)
                  }
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <select
                  className="form-control"
                  value={stop.location}
                  onChange={(e) =>
                    handleStopChange(index, "location", e.target.value)
                  }
                >
                  <option value="">Select Location</option>
                  {data.locations?.map((item) => (
                    <option key={item.id} value={item.address1}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className="col-md-12 col-xs-12 pull pull-left">
            <div
              id="manageTablestops_wrapper"
              className="dataTables_wrapper form-inline dt-bootstrap no-footer"
            >
              <div className="row">
                <div className="col-sm-6">
                  <div
                    className="dataTables_length"
                    id="manageTablestops_length"
                  >
                    <label>
                      Show{" "}
                      <select
                        name="manageTablestops_length"
                        aria-controls="manageTablestops"
                        className="form-control input-sm"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>{" "}
                      entries
                    </label>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div
                    id="manageTablestops_filter"
                    className="dataTables_filter"
                  >
                    <label>
                      Search:
                      <input
                        type="search"
                        className="form-control input-sm"
                        placeholder=""
                        aria-controls="manageTablestops"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <table
                    id="manageTablestops"
                    className="table table-bordered table-striped dataTable no-footer"
                    role="grid"
                    aria-describedby="manageTablestops_info"
                    style={{ width: 1260 }}
                  >
                    <thead>
                      <tr role="row">
                        <th
                          className="sorting"
                          tabIndex={0}
                          aria-controls="manageTablestops"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Type: activate to sort column ascending"
                          style={{ width: "494.2px" }}
                        >
                          Type
                        </th>
                        <th
                          className="sorting"
                          tabIndex={0}
                          aria-controls="manageTablestops"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Location: activate to sort column ascending"
                          style={{ width: 669 }}
                        >
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="odd">
                        <td
                          valign="top"
                          colSpan={2}
                          className="dataTables_empty"
                        >
                          No data available in table
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5">
                  <div
                    className="dataTables_info"
                    id="manageTablestops_info"
                    role="status"
                    aria-live="polite"
                  >
                    Showing 0 to 0 of 0 entries
                  </div>
                </div>
                <div className="col-sm-7">
                  <div
                    className="dataTables_paginate paging_simple_numbers"
                    id="manageTablestops_paginate"
                  >
                    <ul className="pagination">
                      <li
                        className="paginate_button previous disabled"
                        id="manageTablestops_previous"
                      >
                        <Link
                          to="#"
                          aria-controls="manageTablestops"
                          data-dt-idx={0}
                          tabIndex={0}
                        >
                          Previous
                        </Link>
                      </li>
                      <li
                        className="paginate_button next disabled"
                        id="manageTablestops_next"
                      >
                        <Link
                          to="#"
                          aria-controls="manageTablestops"
                          data-dt-idx={1}
                          tabIndex={0}
                        >
                          Next
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-xs-12 pull pull-left">
            <div className="form-group">
              <h4 id="order-shipment-details">
                <span className="label label-success">SHIPMENT DETAIL</span>
              </h4>
            </div>
          </div>
          <div className="col-md-12 col-xs-12 pull pull-left">
            <div className="table-responsive">
              <table className="table table-bordered" id="dynamic_weight">
                <tbody>

                  {formData.commodity?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="col-md-12 col-xs-12 pull pull-left">
                          <div className="form-group">
                            <label htmlFor={`commodity-${index}`}>Commodities(s)</label>
                            <input
                              type="text"
                              className="form-control"
                              id={`commodity-${index}`}
                              name={`commodity[${index}]`}
                              placeholder="Enter Commodity"
                              autoComplete="off"
                              value={formData.commodity[index]}
                              onChange={(e) => handleInputChange2(e, index, "commodity")}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="col-md-12 col-xs-12 pull pull-left">
                          <div className="form-group">
                            <label htmlFor={`weight-${index}`}>Weight</label>
                            <input
                              type="text"
                              className="form-control"
                              id={`weight-${index}`}
                              name={`weight[${index}]`}
                              placeholder="Enter Weight"
                              autoComplete="off"
                              value={formData.weight[index]}
                              onChange={(e) => handleInputChange2(e, index, "weight")}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="col-md-12 col-xs-12 pull pull-left">
                          <div className="form-group">
                            <label htmlFor={`unit-${index}`}>Unit</label>
                            <select
                              className="form-control"
                              id={`unit-${index}`}
                              name={`unit[${index}]`}
                              value={formData.unit[index]}
                              onChange={(e) => handleInputChange2(e, index, "unit")}
                            >
                              <option value="na" disabled>
                                Select Unit
                              </option>
                              <option value="Gallons">Gallons</option>
                              <option value="KG">KG</option>
                              <option value="TON">TON</option>
                              <option value="Metric Ton">Metric Ton</option>
                              <option value="Ounces">Ounces</option>
                              <option value="MBF">MBF</option>
                              <option value="Pounds">Pounds</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="col-md-12 col-xs-12 pull pull-left">
                          <div className="form-group">
                            <label htmlFor={`package-${index}`}>Packages(s)</label>
                            <input
                              type="text"
                              className="form-control"
                              id={`package-${index}`}
                              name={`package[${index}]`}
                              placeholder="Enter Packages"
                              autoComplete="off"
                              value={formData.package[index]}
                              onChange={(e) => handleInputChange2(e, index, "package")}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="col-md-12 col-xs-12 pull pull-left">
                          <div className="form-group">
                            <label>Action</label>
                            {index === formData.commodity.length - 1 ? (
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleAddRow}
                              >
                                +
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveRow(index)}
                              >
                                X
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="trailortype">Selecct Trailor Type</label>
                  <select
                    className="form-control"
                    id="trailortype"
                    name="trailortype"
                    value={formData.trailortype}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Choose Trailor Type
                    </option>
                    {data.trailors?.map((item) => (
                      <option value={item.trailortype}>
                        {item.trailortype}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="manifest">View Manifest</label>
                  <select
                    className="form-control"
                    id="manifest"
                    name="manifest"
                    value={formData.manifest}
                    onChange={handleInputChange}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="hazmat">Hazmat</label>
                  <select
                    className="form-control"
                    id="hazmat"
                    name="hazmat"
                    value={formData.hazmat}
                    onChange={handleInputChange}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="addlcharge">Addl. Charges</label>
                  <input
                    type="text"
                    className="form-control"
                    id="addlcharge"
                    name="addlcharge"
                    autoComplete="off"
                    value={formData.addlcharge}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*
               <div class="col-md-2 col-xs-12 pull pull-left">
              <div class="form-group">
              <label htmlFor="refer">Refer</label>
              <select class="form-control" id="refer" name="refer">
             <option value="C">C</option>
                <option value="F">F</option>
               
              </select>
              </div>
          </div>
          */}
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="appt">Delivery by APPT*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="appt"
                    name="appt"
                    autoComplete="off"
                    value={formData.appt}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="pip">PIP</label>
                  <select
                    className="form-control"
                    id="pip"
                    name="pip"
                    value={formData.pip}
                    onChange={handleInputChange}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="ctpat">CTPAT</label>
                  <select
                    className="form-control"
                    id="ctpat"
                    name="ctpat"
                    value={formData.ctpat}
                    onChange={handleInputChange}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-xs-12 pull pull-left">
              <div className="form-group">
                <h4 id="order-revenue-details">
                  <span className="label label-success">REVENUE DETAILS</span>
                </h4>
              </div>
            </div>
            <div className="col-md-6 col-xs-12 pull pull-left">
              <div className="table-responsive">
                <label htmlFor="store">Revenue Item | Revenue Method</label>
                <table className="table table-bordered" id="dynamic_field">
                  <tbody>
                    <tr>
                      {/*
              	<td><select name="revitem[]" class="form-control name_list" required >
						     <option value="na" disabled selected>Select Revenue Item</option>
						  <option value="Frieght Charge">Frieght Charge</option>
						  <option value="Fuel Surcharge">Fuel Surcharge</option>
						  </select> </td>	
					
              	<td><select name="ratemethod[]"  class="form-control name_list" required >
              	     <option value="na" disabled selected>Select Rate Type</option>
              	     <option value="Flat">Flat</option>   <option value="RateMile">RateMile</option>    <option value="RateHour">RateHour</option>  <option value="RateItem">RateItem</option>   <option value="Rate/Packages">Rate/Packages</option>   <option value="Rate/Weight">Rate/Weight</option>  <option value="MBF">MBF</option>
						  </select> </td> */}
                      <td>
                        <input
                          type="number"
                          name="rate"
                          placeholder="Enter Rate (0.00)"
                          className="form-control name_list"
                          required=""
                          value={formData.rate}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="ratevalue"
                          onKeyUp={() => { }}
                          placeholder="Enter Qty"
                          className="form-control name_list"
                          required=""
                          value={formData.ratevalue}
                          onChange={handleInputChange}
                        />{" "}
                      </td>
                      <td>
                        <button
                          type="button"
                          name="add"
                          id="add"
                          className="btn btn-success"
                        >
                          Add More
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row" />
                      <td />
                      <td />
                      <td>Gross Amount</td>
                      <td className="text-right">
                        {" "}
                        <input
                          type="number"
                          className="form-control"
                          id="gross_amount"
                          name="gross_amount"
                          autoComplete="off"
                          value={formData.gross_amount}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" />
                      <td />
                      <td>HST(%)</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          id="hst"
                          name="hst"
                          autoComplete="off"
                          value={formData.hst}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          type="number"
                          className="form-control"
                          id="hstamount"
                          name="hstamount"
                          autoComplete="off"
                          value={formData.hstamount}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" />
                      <td />
                      <td>CST Amount(%)</td>
                      <td>
                        {" "}
                        <input
                          type="number"
                          className="form-control"
                          id="cst"
                          name="cst"
                          autoComplete="off"
                          value={formData.cst}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          id="cstamount"
                          name="cstamount"
                          autoComplete="off"
                          value={formData.cstamount}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" />
                      <td />
                      <td />
                      <td>Net Amount</td>
                      <td>
                        {" "}
                        <input
                          type="number"
                          className="form-control"
                          id="net_amount"
                          name="net_amount"
                          autoComplete="off"
                          value={formData.net_amount}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /.box-body */}
          {/* /.box-body */}
        </div>
        {/* /.box */}
        <div className="text-center entry-footer-actions" hidden={!showManualEntry} style={!showManualEntry ? { display: "none" } : undefined}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setpopup(!popup)}
          >
            Review &amp; save order
          </button>
          <button onClick={() => {
            if ((ocrResult || ocrFile || isOcrLoading || manualFields.size > 0) && !getdataid && !window.confirm("Leave this order? Unsaved information will be lost.")) return;
            navigate(-1);
          }} className="btn btn-warning">
            Back
          </button>
        </div>
      </section >

      {popup && (
        <div
          className="modal fade show"
          role="dialog"
          aria-labelledby="order-save-title"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" style={{ maxWidth: "90%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="order-save-title">Review route and save order</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close order review"
                  onClick={() => setpopup(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div
                className="modal-body"
                style={{ height: "500px", overflow: "auto" }}
              >
                <Distancepopup
                  closePopup={() => setpopup(false)}
                  places1={formData.pickup_address}
                  places2={formData.delivery_address}
                  places3={stops}
                />
              </div>
              <div className="modal-footer">
                {saveError && <Alert tone="danger" title="Order save failed">{saveError} If a request timed out, check the list for an existing record before retrying.</Alert>}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleonSubmit}
                  disabled={isSubmitting || Boolean(ocrResult && getdataid)}
                >
                  {isSubmitting ? "Saving..." : "Save Order"}
                </button>
                {getdataid ? (
                  <>
                    <Link
                      to={"/assign/" + getdataid}
                      className="btn btn-success btn-sm"
                    >
                      Assign
                    </Link>
                    <Link
                      target="_blank"
                      to={`https://isovia.ca/fms_api/pdf/invoice_log.php?id=${getdataid}`}
                      className="btn btn-danger btn-xs"
                    >
                      Dispatch
                    </Link>
                  </>
                ) : (
                  <>
                    <button className="btn btn-success btn-sm" disabled>
                      Assign
                    </button>
                    <button className="btn btn-danger btn-xs" disabled>
                      Dispatch
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => setpopup(false)}
                >
                  Close
                </button>
                {/* Rest of your footer buttons */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Createorder;
