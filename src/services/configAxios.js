import axios from "axios"

const ConfigAxios = axios.create({
  timeout: 3000000000,
  transformResponse: [
    function (data) {
      if (typeof data === "string") {
        try {
          data = JSON.parse(data)
        } catch (e) { /* Ignore */ }
      }

      return data
    }
  ]
})

export default ConfigAxios