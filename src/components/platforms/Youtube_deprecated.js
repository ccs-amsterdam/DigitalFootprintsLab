import React, { useState } from "react";

import GoogleLogin from "react-google-login";
import Axios from "axios";

import { Modal } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";

// THIS WAS A PLAYGROUND FOR TESTING OAUTH2
// THE OAUTH2 WORKS GREAT...
// IT'S JUST THAT IT DOESN'T REALLY PROVIDE ACCESS TO RELEVANT DATA

const getYoutube = async (token) => {
  const api = Axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/",
    headers: { Authorization: `Bearer ${token}` },
  });
  const params = { key: process.env.REACT_APP_GOOGLE_CLIENT_ID };
  console.log(api);
  const test = await api.get(`/channels/`, { params });
  console.log(test);
};

const Youtube = () => {
  // this
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);
  console.log(token);

  const handleLogin = (data) => {
    setToken(data);
    console.log(data);
    getYoutube(data.accessToken);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <CardTemplate
          name={"Youtube"}
          website={"www.youtube.com"}
          icon={"youtube"}
          onClick={() => setOpen(true)}
        />
      }
    >
      <Modal.Header>Connect with your Google account</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <p>Log in to you Google account.</p>
        </Modal.Description>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Log in with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={"single_host_origin"}
          scope="profile email https://www.googleapis.com/auth/youtube.readonly"
        />
      </Modal.Content>
      <Modal.Actions>
        <div style={{ float: "center" }}></div>
      </Modal.Actions>
    </Modal>
  );
};

export default Youtube;
