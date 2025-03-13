import Alert from "@/components/Alert";
import { useAppStore } from '@/stores/app';
import ServiceHttp from '@/services/serviceHttp';

export default class ConfigError extends Error {
  constructor(error) {
    super(error);
    this.error = error.response || error; 
  }

  showError() {
    const store = useAppStore();
    let ini = this;

    if (this.error.status == 401) {
      Alert.errorResponse(
        function () {
          if (ini.error.status == 401) {
            store.clearToken();
            ServiceHttp.removeHeader();
            // location.reload();
            window.open('https://sso.pegadaian.co.id/logout', "_self");
          }
        },
        "warning",
        "Expired Token",
        "Silahkan login ulang",
        "#306BDD"
      );
    } else {
      throw this.error;
    }
  }
}
