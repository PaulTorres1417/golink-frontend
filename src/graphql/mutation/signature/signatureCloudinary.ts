import { gql } from '@apollo/client';

export const GET_SIGNATURE = gql`
  mutation get_signature($folder: String) {
    generateUploadSignature(folder: $folder) {
      timestamp
      signature
      apikey
      cloudName
    }
  }
`;