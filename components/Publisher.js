import React, { useState } from "react";
import { OTPublisher } from "opentok-react-nextjs";

function Publisher() {
  const [error, setError] = useState("");

  const onError = (err) => {
    setError(`Failed to publish: ${err.message}`);
  };

  const onPubish = (pubishedData) => {
    console.log({ pubishedData });
  };

  const onInit = (initData) => {
    console.log({ initData });
  };

  return (
    <div className="publisher">
      Me
      {error ? <div id="error">{error}</div> : null}
      <OTPublisher
        properties={{
          publishAudio: true,
          publishVideo: true,
        }}
        onError={onError}
        onPublish={onPubish}
        onInit={onInit}
      />
    </div>
  );
}

export default Publisher;
