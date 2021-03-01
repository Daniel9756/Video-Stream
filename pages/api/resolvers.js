import OpenTok from "opentok";
const opentok = new OpenTok(process.env.API_KEY, process.env.API_SECRET);

const createSessionPromisified = () =>
  new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      if (err) return reject(err);
      resolve(session);
    });
  });

const startRecordingPromisified = (sessionId) =>
  new Promise((resolve, reject) => {
    opentok.startArchive(
      sessionId,
      { name: "Video Stream" },
      function (err, archive) {
        if (err) return reject(err);
        resolve(archive);
      }
    );
  });

const stopRecordingPromisified = (archiveId) =>
  new Promise((resolve, reject) => {
    opentok.stopArchive(archiveId, function (err, archive) {
      if (err) return reject(err);
      resolve(archive);
    });
  });

const getArchivePromisified = (archiveId) =>
  new Promise((resolve, reject) => {
    opentok.getArchive(archiveId, function (err, archive) {
      if (err) return reject(err);
      resolve(archive);
    });
  });

const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const resolvers = {
  Query: {
    me() {
      return "";
    },
  },

  Mutation: {
    async createSessionAndToken(parent, arg) {
      const session = await createSessionPromisified();
      if (session) {
        const token = await opentok.generateToken(session.sessionId);
        return {
          id: session.sessionId,
          token,
        };
      }
    },

    async joinSession(parent, { sessionId }) {
      console.log({ sessionId });
      const token = await opentok.generateToken(sessionId);
      return {
        id: sessionId,
        token,
      };
    },

    async startRecording(parent, { sessionId }) {
      console.log({ sessionId });
      const archive = await startRecordingPromisified(sessionId);
      console.log({ archive });
      return archive;
    },
    async stopRecording(parent, { archiveId }) {
      await stopRecordingPromisified(archiveId);
      // Download link is not avaiable immediately, so there is deay here
      await delay(10000);
      const archive = await getArchivePromisified(archiveId);
      console.log({ archive });
      return archive;
    },
  },
};
