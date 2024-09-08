import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "<YOUR_CLIENT_ID>";
const API_KEY = "<YOUR_API_KEY>";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

const GoogleDriveFile = () => {
  const [fileData, setFileData] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());

        authInstance.isSignedIn.listen(setIsSignedIn);

        if (authInstance.isSignedIn.get()) {
          listFiles();
        }
      });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const listFiles = () => {
    gapi.client.drive.files
      .list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
      })
      .then((response: any) => {
        setFileData(response.result.files);
      })
      .catch((error: any) => {
        console.error("Error fetching files: ", error);
      });
  };

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <button onClick={handleSignOut}>Sign out</button>
      )}

      <h2>Google Drive Files</h2>
      <ul>
        {fileData?.map((file: any) => (
          <li key={file.id}>
            {file.name} (ID: {file.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleDriveFile;
