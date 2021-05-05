import React, { useEffect, useState } from "react";
import { OTSession, OTStreams, preloadScript } from "opentok-react-nextjs";
import config from "../../config";
import Connection from "../../components/Connection";
import Publisher from "../../components/Publisher";
import Subscriber from "../../components/Subscriber";
import { gql, useMutation } from "@apollo/client";

const apiKey = config.API_KEY;

const CreateSessionAndToken = gql`
  mutation CreateSessionAndToken {
    createSessionAndToken {
      id
      token
    }
  }
`;
const StartRecording = gql`
  mutation StartRecording($sessionId: String) {
    startRecording(sessionId: $sessionId) {
      id
      url
    }
  }
`;

const StopRecording = gql`
  mutation StopRecording($archiveId: String) {
    stopRecording(archiveId: $archiveId) {
      id
      url
    }
  }
`;

function Host() {
  const [createSession, { data, error: serverError, loading }] = useMutation(
    CreateSessionAndToken
  );
  const [startRecording] = useMutation(StartRecording);
  const [stopRecording] = useMutation(StopRecording);

  const { id, token } = (data && data.createSessionAndToken) || {};

  const [connect, setConnect] = useState(false);
  const [archive, setArchive] = useState(null);
  const [error, setError] = useState("");
  const [archiveUr, setArchiveUr] = useState("");

  const handleSessionOn = () => {
    setConnect(true);
  };
  const handleRecordOn = async () => {
    console.log("record", id);
    const resut = await startRecording({
      variables: {
        sessionId: id,
      },
    });
    console.log({ resut });
    setArchive(resut.data.startRecording);
  };

  const handleStop = async () => {
    console.log("record");
    const resut = await stopRecording({
      variables: {
        archiveId: archive.id,
      },
    });
    console.log({ resut });
    setArchive(null);
    setArchiveUr(resut.data.stopRecording.url);
  };
  const onError = (error) => {
    setError(error.message);
    setConnect(false);
  };

  useEffect(() => {
    createSession();
  }, []);

  if (loading || !data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <a href={`/host/${encodeURIComponent(id)}`} target="_blank">
        Join here
      </a>
      <br />
      Session ID: {id}
      <br />
      {archiveUr && (
        <a href={archiveUr} target="_blank">
          Download recording HERE
        </a>
      )}
      {error ? <div>{error}</div> : null}
      <Connection connect={connect} sessionId={id}/>
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
      <div>
        {archive ? (
          <button onClick={handleStop}>Stop</button>
        ) : (
          <button onClick={handleRecordOn}>Record</button>
        )}
        </div>
      </div>  );
}

export default preloadScript(Host);
