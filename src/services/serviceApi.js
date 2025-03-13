import ServiceHttp from "./serviceHttp";

export default class ServiceApi extends ServiceHttp {
  static api = import.meta.env.VITE_BASE_API;

  authLogin(url, param, data) {
    const api = this.api + url;

    return this.postLogin(param, api, data);
  }

  getData(url, queryParam) {
    const api = this.api + url;
    return this.get(api, queryParam);
  }

  postData(url, payload, queryParam) {
    const api = this.api + url;
    let Payload = payload ? payload : null;
    let QueryParam = queryParam ? queryParam : Object.assign({});
    return this.post(api, Payload, QueryParam);
  }

  putData(url, payload) {
    const api = this.api + url;
    return this.put(api, payload);
  }

  patchData(url) {
    const api = this.api + url;
    return this.patch(api);
  }

  deleteData(url, payload) {
    const api = this.api + url;
    return this.delete(api, payload);
  }

  uploadData(url, payload) {
    const api = this.api + url;
    return this.upload(api, payload);
  }

  downloadFileData(url, queryParam) {
    const api = this.api + url;
    return this.downloadFile(api, queryParam);
  }

  downloadMultiFileData(url, queryParam) {
    const api = this.api + url;
    return this.downloadMultiFile(api, queryParam);
  }
}
