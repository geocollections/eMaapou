import type { RouteLocationRaw } from "vue-router";

const EDIT_URL = "https://edit.geocollections.info";
const DEPOSIT_URL
  = "https://xgis.maaamet.ee/xGIS/bronx/maardlad/showdata.aspx?registrikaart=";
const EELIS_URL = "http://register.keskkonnainfo.ee/envreg/main?reg_kood=";
const TURBA_URL = "https://turba.geoloogia.info";
const EGF_URL = "https://fond.egt.ee/fond/egf/";
const GEOLOGY_URL = "https://geoloogia.info";

export default defineNuxtPlugin((_nuxtApp) => {
  const openWindow = (url: string) => {
    window.open(url, "_blank", "height=800, width=800");
  };

  const openGeoDetail = (table: string, id: string) => {
    if (table && id) {
      window.open(
        `https://geocollections.info/${table}/${id}`,
        "_blank",
        "height=800, width=800",
      );
    }
  };
  // TODO: `route` should be of type Route, not string
  const openNuxtWindow = (_location: RouteLocationRaw | undefined) => {
    // const resolvedRoute = router.resolve(location as RouteLocationRaw);
    // window.open(resolvedRoute?.href, "_blank", "height=800, width=800");
  };

  const openImage = (filename: string, size = "large") => {
    if (filename && size) {
      if (size === "original") {
        window.open(
          `https://files.geocollections.info/${filename}`,
          "ImageWindow",
        );
      }
      else {
        window.open(
          `https://files.geocollections.info/${size}/${filename}`,
          "ImageWindow",
        );
      }
    }
  };

  const openEdit = (table: string, id: string) => {
    if (table && id) {
      if (table === "file")
        table = "attachment";
      window.open(
        `${EDIT_URL}/${table}/${id}`,
        "EditWindow",
        "height=800, width=800",
      );
    }
  };

  const openDeposit = (id: string) => {
    if (id) {
      window.open(
        `${DEPOSIT_URL}${id}`,
        "DepositWindow",
        "height=800, width=800",
      );
    }
  };

  const openEelis = (id: string) => {
    if (id)
      window.open(`${EELIS_URL}${id}`, "EelisWindow", "height=800, width=800");
  };

  const openEgf = (id: string) => {
    if (id)
      window.open(`${EGF_URL}${id}`, "EgfWindow", "height=800, width=800");
  };

  const openTurba = (table: string, id: string, openNewWindow = true) => {
    if (table && id) {
      window.open(
        `${TURBA_URL}/${table}/${id}`,
        openNewWindow ? "TurbaWindow" : "_parent",
        "height=800, width=800",
      );
    }
  };

  const openGeology = (table: string, id: string) => {
    if (table && id) {
      window.open(
        `${GEOLOGY_URL}/${table}/${id}`,
        "GeologyWindow",
        "height=800, width=800",
      );
    }
  };

  return {
    provide: {
      openGeology,
      openTurba,
      openEgf,
      openEelis,
      openDeposit,
      openEdit,
      openWindow,
      openNuxtWindow,
      openImage,
      openGeoDetail,
    },
  };
});
