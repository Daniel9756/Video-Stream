import React, { useState } from "react";
import PropTypes from "prop-types"

function Connection(props, context) {
  // const classes = useStyles();
  console.log(context)

  const { connect } = props;
  const status = connect ? "Connected" : "Disconnected";

  return (
    <div>
      <strong>Status:</strong> {status}
    </div>
  );
}

export default Connection;

Connection.contextTypes={
   session: PropTypes.any,
   streams: PropTypes.any,
}