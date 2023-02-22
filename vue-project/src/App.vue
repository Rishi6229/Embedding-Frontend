<script lang = "ts">
import { embedDashboard } from "@superset-ui/embedded-sdk"
import MsalService from './services/MsalService'
import axios from 'axios';
export default
  {
    setup() {
      const msalService = new MsalService();
      const initateLogin = function () {
        msalService.initiateLogin();
      }
      const getAccessToken = function () {
        msalService.getAccessToken().then((token) => {
          localStorage.setItem('Access_token' , token)
          axios.post('http://localhost:5000/api/accesstoken',
            {
              headers:
              {
                Authorization: `Bearer ${token}`
              }
            })
            .then(response => {
              console.log(response.data)
            })
            .catch(error => {
              console.log(error);
            })
        });
      }
      return { initateLogin, getAccessToken, };
    },
    mounted() 
    {
      const accesstoken = localStorage.getItem("Access_token")

      async function getGuestToken() {
        const response = await axios.post('http://localhost:5000/api/accesstoken', {
          headers:
          {
            'Authorization': `Bearer ${accesstoken}`
          }
        });
        const guestToken = response.data.guestToken;
        console.log(guestToken);

        if (!guestToken)
        {
          throw new Error('Guest token has not been generated')
        }
        return guestToken;
      }
      embedDashboard
        ({
          id: "87552012-9dab-4abc-81a6-663366c54272",
          supersetDomain: "http://localhost:8088",
          mountPoint: document.getElementById("superset-container"),
          fetchGuestToken: getGuestToken,
          dashboardUiConfig:
          {
            hideTitle: true,
          },
        })
    },
  }
</script>


<template>
  <div id="buttons">
  </div>
  <div ref="mySupersetContainer" class="my-superset-container" id="superset-container">
  </div>
</template>

<style>
#app {
  font-family: 'Maersk-Regular';
  margin-left: auto;
  margin-right: auto;
  float: left;
}

iframe {
  height: 100vh;
  width: 100vw;
}

body {
  margin: 0px;
  margin-left: auto;
  margin-right: auto;
  height: 100vh;
  width: 100vw;
}
</style>
