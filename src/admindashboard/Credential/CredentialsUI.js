import React from "react";

const CredentialsUI = () => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">OAuth 2.0 Credentials</h5>
          <p className="card-text text-muted">
            OAuth 2.0 uses the client secret mechanism as a means of authorizing a client, the software requesting an access token.
          </p>

          {/* Client ID */}
          <div className="mb-4">
            <label className="form-label fw-bold">Client ID</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value="wKSpljnEBHWG5R7cfTTGGjtQcWcmYtgFKAc_B9GkxvY"
                readOnly
              />
              <button
                className="btn btn-primary"
                onClick={() => handleCopy("wKSpljnEBHWG5R7cfTTGGjtQcWcmYtgFKAc_B9GkxvY")}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="mb-4">
            <label className="form-label fw-bold">Client Secret</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value="a1bHMsP7Hu7nokC7y9Y1Mj_a4p5a_UYmnF--_DF-hEo"
                readOnly
              />
              <button
                className="btn btn-primary"
                onClick={() => handleCopy("a1bHMsP7Hu7nokC7y9Y1Mj_a4p5a_UYmnF--_DF-hEo")}
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <h5 className="card-title">Samsara OAuth 2.0 Credentials</h5>
          <p className="card-text text-muted">
            OAuth 2.0 uses the client secret mechanism as a means of authorizing a client, the software requesting an access token.
          </p>

          {/* Client ID */}
          <div className="mb-4">
            <label className="form-label fw-bold">App ID</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value="999974e2-fc11-45d1-910b-24e55b6a4dd2"
                readOnly
              />
              <button
                className="btn btn-primary"
                onClick={() => handleCopy("999974e2-fc11-45d1-910b-24e55b6a4dd2")}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Client Secret */}
          <div className="mb-4">
            <label className="form-label fw-bold">App Secret</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value="P9qfCiVJ0vRVzNqia6Tax8zMdoR42sOQ"
                readOnly
              />
              <button
                className="btn btn-primary"
                onClick={() => handleCopy("P9qfCiVJ0vRVzNqia6Tax8zMdoR42sOQ")}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsUI;
