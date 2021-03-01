import React, { useEffect, useState } from "react";
import { OTSession, OTStreams, preloadScript } from "opentok-react-nextjs";
import config from "../../config";
import Connection from "../../components/Connection";
import Publisher from "../../components/Publisher";
import Subscriber from "../../components/Subscriber";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const apiKey = config.API_KEY;

const JoinSessionAndToken = gql`
  mutation JoinSessionAndToken($sessionId: String) {
    joinSession(sessionId: $sessionId) {
      id
      token
    }
  }
`;

function Guest() {
  const { query } = useRouter();
  console.log(query);
  const [
    joinSession,
    { data, error: serverError, loading, client },
  ] = useMutation(JoinSessionAndToken);
  console.log(serverError);

  const [connect, setConnect] = useState(false);
  const [error, setError] = useState("");

  const handleSessionOn = () => {
    setConnect(true);
  };

  const onError = (error) => {
    setError(error.message);
    setConnect(false);
  };

  useEffect(() => {
    if (query.session) {
      joinSession({
        variables: {
          sessionId: decodeURIComponent(query.session),
        },
      });
    }
  }, [query.session]);

  if (loading || !data) {
    return <div>loading</div>;
  }

  const { id, token } = (data && data.joinSession) || {};
  return (
    <div>
      Current Session ID: {id}
      {error ? <div>{error}</div> : null}
      <Connection connect={connect} />
      <OTSession
        apiKey={apiKey}
        sessionId={id}
        token={token}
        onConnect={handleSessionOn}
        onError={onError}
      >
        <Publisher />
        <OTStreams>
          <Subscriber />
        </OTStreams>
      </OTSession>
    </div>
  );
}

export default preloadScript(Guest);
