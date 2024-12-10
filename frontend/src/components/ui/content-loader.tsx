import * as React from "react"

const ContentLoader: React.ReactNode = (
  <>
    <div className="d-flex vw-100 vh-100 justify-content-center align-items-center">
      <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem", borderWidth: "0.4rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </>
);

export default ContentLoader;
