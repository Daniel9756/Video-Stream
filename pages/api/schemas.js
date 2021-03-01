import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Session {
    id: ID
    token: String
  }
  type Archive {
    id: ID
    url: String
  }

  type Query {
    me: String
  }

  type Mutation {
    createSessionAndToken: Session!
    joinSession(sessionId: String): Session!
    startRecording(sessionId: String): Archive
    stopRecording(archiveId: String): Archive
  }
`;
