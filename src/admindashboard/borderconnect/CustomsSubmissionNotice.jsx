import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../design-system/components';

export default function CustomsSubmissionNotice() {
  return <Alert tone="warning" title="Manual customs entry enabled">
    You can enter and revise customs details manually without OCR. Values are local to this form, are not saved, and will be lost when you leave or refresh.
    {' '}Live sending remains unavailable: version-bound dispatcher approval, account authorization and durable duplicate-submission protection are not connected. No manifest will be sent.
    {' '}<Link to="/customs/review">Open Customs Manifest Review</Link>.
    Manifest acceptance is not customs release.
  </Alert>;
}
