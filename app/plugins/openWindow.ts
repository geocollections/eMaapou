const EDIT_URL = "https://edit.geocollections.info";
const GEOKIRJANDUS_URL = "https://kirjandus.geoloogia.info";

export default defineNuxtPlugin((_nuxtApp) => {
  function openWindow(url: string) {
    window.open(url, "_blank", "height=800, width=800");
  };

  function openImage(filename: string, size = "large") {
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

  function openEdit(table: string, id: string) {
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

  function openGeokirjandus(table: "reference" | "library", id: string) {
    window.open(
      `${GEOKIRJANDUS_URL}/${table}/${id}`,
      "GeokirjandusWindow",
      "height=800, width=800",
    );
  };

  return {
    provide: {
      openEdit,
      openWindow,
      openImage,
      openGeokirjandus,
    },
  };
});
