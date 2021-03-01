import React, { useState } from "react";
import { OTSubscriber } from "opentok-react-nextjs";

function Subscriber() {
  const [error, setError] = useState("");

  const onError = (err) => {
    setError(`Failed to subscribe: ${err.message}`);
  };

  const onSubscribe = (err) => {
    console.log("subscribed");
  };

  return (
    <div className="subscriber">
      {error ? <div id="error">{error}</div> : null}
      <OTSubscriber
        properties={{
          width: 300,
          height: 300,
         
        }}
        onError={onError}
        onSubscribe={onSubscribe}
      />
    </div>
  );
}
export default Subscriber;
