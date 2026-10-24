import React, { useEffect, useState } from "react";
import { Badge, Card } from "../design-system/components";
import "./OcrDocumentIntake.css";

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function isMissing(value) {
  return value === null || value === undefined || value === "" ||
    (Array.isArray(value) && value.every((item) => item === null || item === undefined || item === ""));
}

export function flattenOcrFields(value, prefix = "") {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => {
    if (key.toLowerCase() === "stops" || item === null || item === undefined || item === "") return [];
    const label = [...(prefix ? prefix.split(".") : []), key]
      .map((part) => part.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()))
      .join(" / ");
    if (Array.isArray(item)) {
      if (item.every((entry) => entry === null || ["string", "number", "boolean"].includes(typeof entry))) {
        return item.length ? [{ label, value: item, source: "PDF Extracted" }] : [];
      }
      return item.flatMap((entry, index) => flattenOcrFields(entry, `${label}.${index + 1}`));
    }
    if (typeof item === "object") return flattenOcrFields(item, label);
    return [{ label, value: item, source: "PDF Extracted" }];
  });
}

function SourceBadge({ source, needsReview }) {
  if (needsReview) return <Badge tone="warning">Needs Review</Badge>;
  if (source === "IFM Record") return <Badge tone="info">IFM Record</Badge>;
  if (source === "Manual") return <Badge tone="neutral">Manually entered</Badge>;
  if (source === "Unverified") return <Badge tone="warning">Source not verified</Badge>;
  return <Badge tone="neutral">PDF Extracted</Badge>;
}

function ReviewFields({ fields = [] }) {
  if (!fields.length) return <p className="ocr-review__empty">No fields were provided.</p>;
  return (
    <dl className="ocr-review__fields">
      {fields.map((field, index) => {
        const missing = isMissing(field.value);
        const needsReview = field.needsReview ?? missing;
        return (
          <div className="ocr-review__field" key={`${field.label}-${index}`}>
            <dt>{field.label}</dt>
            <dd>
              <span className={missing ? "ocr-review__missing" : ""}>{displayValue(field.value)}</span>
              <SourceBadge source={field.source} needsReview={needsReview} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function brokerStatusTone(status) {
  if (status === "Matched") return "success";
  if (status === "No Match") return "danger";
  return "warning";
}

function StopCard({ stop, index }) {
  const details = [
    ["Name", stop.name],
    ["Address", stop.address],
    ["Location", stop.location && stop.location !== stop.address ? stop.location : ""],
    ["Local date", stop.date],
    ["Local time", stop.time],
    ["Time zone", stop.timezone],
    ["Appointment window", stop.appointmentWindow],
    ["Contact", stop.contactName],
    ["Phone", stop.contactPhone],
    ["Reference", stop.reference],
    ["Instructions", stop.instructions],
  ];
  const hasDetails = details.some(([, value]) => !isMissing(value));

  return (
    <li className="ocr-review__stop">
      <div className="ocr-review__stop-heading">
        <span>Stop {index + 1}</span>
        <Badge tone="neutral">{stop.type || "Type not identified"}</Badge>
      </div>
      {hasDetails ? (
        <dl className="ocr-review__fields ocr-review__fields--compact">
          {details.filter(([, value]) => !isMissing(value)).map(([label, value]) => (
            <div className="ocr-review__field" key={label}><dt>{label}</dt><dd>{displayValue(value)}</dd></div>
          ))}
        </dl>
      ) : <p className="ocr-review__missing">Stop details were not provided.</p>}
      {stop.source
        ? <SourceBadge source={stop.source} needsReview={stop.needsReview} />
        : stop.needsReview && <Badge tone="warning">Needs Review</Badge>}
    </li>
  );
}

export default function OcrExtractionReview({
  id,
  title,
  sourceFile,
  groups = [],
  stops = [],
  broker,
  extraFields = [],
  persistenceNotice,
  savedRecordId,
  savedLink,
  savedLinkLabel,
  onEdit,
  onReviewAndSave,
  isSaving = false,
  headingRef,
}) {
  const [sourceUrl, setSourceUrl] = useState("");

  useEffect(() => {
    if (!sourceFile || !window.URL?.createObjectURL) {
      setSourceUrl("");
      return undefined;
    }
    const url = window.URL.createObjectURL(sourceFile);
    setSourceUrl(url);
    return () => window.URL.revokeObjectURL(url);
  }, [sourceFile]);

  const attentionCount = groups.reduce((count, group) => (
    count + group.fields.filter((field) => field.needsReview ?? isMissing(field.value)).length
  ), 0) + stops.filter((stop) => stop.needsReview).length;

  return (
    <section
      className="ocr-review"
      id={id}
      aria-labelledby={`${id}-heading`}
      ref={headingRef}
      tabIndex={-1}
    >
      <header className="ocr-review__summary" aria-live="polite">
        <div>
          <p className="ocr-intake__eyebrow">EXTRACTION SUMMARY</p>
          <h2 id={`${id}-heading`}>{title}</h2>
          <p>Confirm each extracted value against the source document before saving.</p>
        </div>
        <div className="ocr-review__attention">
          <strong>{attentionCount}</strong>
          <span>items need attention</span>
        </div>
      </header>

      {savedRecordId && (
        <div className="ocr-review__saved" role="status">
          <strong>{title} saved.</strong>
          <span>Record ID: {savedRecordId}</span>
          {savedLink && <a href={savedLink}>{savedLinkLabel || "Open saved record"}</a>}
        </div>
      )}

      {sourceFile && (
        <p className="ocr-review__source">
          Source document: <strong>{sourceFile.name}</strong>
          {sourceUrl && <> · <a href={sourceUrl} target="_blank" rel="noreferrer">Open original document</a></>}
        </p>
      )}

      {broker && (
        <Card as="article" className="ocr-review__card">
          <div className="ocr-review__card-heading">
            <h3>{broker.title || "Broker Information"}</h3>
            <Badge tone={brokerStatusTone(broker.status)}>{broker.status}</Badge>
          </div>
          {broker.ocrFields?.length > 0 && (
            <>
              <h4>PDF Extracted</h4>
              <ReviewFields fields={broker.ocrFields} />
            </>
          )}
          {broker.candidates?.length > 0 && (
            <div className="ocr-review__match">
              <label htmlFor={`${id}-broker-match`}>Select existing broker/customer record</label>
              <select
                id={`${id}-broker-match`}
                className="form-control"
                value={broker.selectedId || ""}
                onChange={(event) => broker.onSelect?.(event.target.value)}
              >
                <option value="">Choose a record</option>
                {broker.candidates.map((candidate) => (
                  <option key={candidate.id} value={String(candidate.id)}>{candidate.name}</option>
                ))}
              </select>
              <button type="button" className="btn btn-default" onClick={broker.onConfirm} disabled={!broker.selectedId}>
                Confirm selection
              </button>
            </div>
          )}
          {broker.record && (
            <details className="ocr-review__profile">
              <summary>{broker.profileLabel || "View Broker Profile"}</summary>
              <ReviewFields fields={broker.recordFields || []} />
            </details>
          )}
          {broker.notice && <p className="ocr-review__notice" role="status">{broker.notice}</p>}
        </Card>
      )}

      {groups.map((group) => (
        <Card as="article" className="ocr-review__card" key={group.title}>
          <div className="ocr-review__card-heading"><h3>{group.title}</h3></div>
          <ReviewFields fields={group.fields} />
        </Card>
      ))}

      <Card as="article" className="ocr-review__card">
        <div className="ocr-review__card-heading"><h3>Stops</h3><span>{stops.length} in document order</span></div>
        {stops.length > 0 ? (
          <ol className="ocr-review__stops">
            {stops.map((stop, index) => <StopCard key={`${stop.reference || stop.address || stop.location || "stop"}-${index}`} stop={stop} index={index} />)}
          </ol>
        ) : <p className="ocr-review__empty">No stops were extracted. Enter pickup and delivery details manually before saving.</p>}
      </Card>

      {extraFields.length > 0 && (
        <Card as="article" className="ocr-review__card">
          <div className="ocr-review__card-heading"><h3>Additional extracted fields</h3></div>
          <ReviewFields fields={extraFields} />
        </Card>
      )}

      {persistenceNotice && <p className="ocr-review__persistence-notice" role="status">{persistenceNotice}</p>}

      <div className="ocr-review__actionbar" role="region" aria-label={`${title} actions`}>
        <button type="button" className="btn btn-default" onClick={onEdit}>Edit Information</button>
        <button type="button" className="btn btn-primary" onClick={onReviewAndSave} disabled={isSaving || Boolean(savedRecordId)}>
          {isSaving ? "Saving…" : `Review & Save ${title.replace(" Review", "")}`}
        </button>
      </div>
    </section>
  );
}
