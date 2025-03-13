import ConfigAxios from "./configAxios";
import ConfigError from "./configError";
import ServiceBase from "./serviceBase";
import { useAppStore } from "@/stores/app";
import qs from "qs";

export default class ServiceHttp extends ServiceBase {
  static api = "";
  static entity = "";

  constructor(api = "", entity = "", options = {}, http = null) {
    super(options);
    this.api = api;
    this.entity = entity;
    this.http = http || ConfigAxios;
  }

  static build(options) {
    return new this(this.api, this.entity, options);
  }

  static setHeader() {
    const store = useAppStore();
    ConfigAxios.defaults.headers.common['Authorization'] = `Bearer ${store.getToken()}`
    // ConfigAxios.defaults.headers.common["x-app-token"] = `${store.getToken()}`;
    ConfigAxios.defaults.headers.common["apikey"] = import.meta.env.VITE_AGATA_API_KEY;
    ConfigAxios.defaults.headers.common["Content-Type"] = "application/json";
    ConfigAxios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  }

  static removeHeader() {
    ConfigAxios.defaults.headers.common = {};
  }

  // DEFAULT
  get(url = "", queryParam = {}) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .get(setURL, { params: queryParam })
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  post(url = "", payload = null, queryParam = {}) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .post(setURL, payload, { params: queryParam })
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  put(url = "", payload = null) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .put(setURL, payload)
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  patch(url = "") {
    const setURL = url == "" ? this.api : url;
    return this.http
      .patch(setURL)
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  delete(url = "", payload = {}) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .delete(setURL, { data: payload })
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  // DOWNLOAD FILE
  upload(url = "", payload = null) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .post(setURL, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        maxContentLength: 100000000,
        maxBodyLength: 1000000000,
      })
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  downloadFile(url = "", queryParam = {}) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .get(setURL, {
        params: queryParam,
        responseType: "blob",
        timeout: 300000,
      })
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  downloadMultiFile(url = "", queryParam = {}) {
    const setURL = url == "" ? this.api : url;
    return this.http
      .get(setURL, {
        params: queryParam,
        responseType: "blob",
        timeout: 300000,
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then(this.constructor.then)
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          const configError = new ConfigError(e);
          configError.showError();
        } else {
          throw e;
        }
      });
  }

  // CUSTOM
  postLogin(data, url = "", token) {
    const username = data.email;
    const password = data.password;
    const basicAuth = "Basic " + btoa(username + ":" + password);
    const headers = {
      headers: { Authorization: basicAuth, "Content-Type": "application/json" },
    };
    const api = url === "" ? this.api : url;

    return this.http
      .post(api, data, headers)
      .then(this.constructor.then)
      .catch((e) => {
        throw e;
        // if (e instanceof ErrorService) {
        //   e.showError();
        // } else {
        //   const alert = new ErrorService(e);
        //   alert.showError();
        // }
      });
  }
}
