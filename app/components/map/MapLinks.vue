<script setup lang="ts">
withDefaults(defineProps<
  {
    latitude?: number;
    longitude?: number;
    tooltip?: string;
  }
>(), {
  latitude: 0,
  longitude: 0,
  tooltip: "",
});

function geoToLest(north: number, east: number) {
  const LAT = north * (Math.PI / 180);
  const LON = east * (Math.PI / 180);
  const a = 6378137.0;
  let F = 298.257222100883;
  const RF = F;
  F = 1 / F;
  const B0 = (57.0 + 31.0 / 60.0 + 3.194148 / 3600.0) * (Math.PI / 180);
  const L0 = 24.0 * (Math.PI / 180);
  const FN = 6375000.0;
  const FE = 500000.0;
  const B1 = (59.0 + 20.0 / 60.0) * (Math.PI / 180);
  const B2 = 58.0 * (Math.PI / 180);
  const f1 = 1 / RF;
  const er = 2.0 * f1 - f1 * f1;
  let e = Math.sqrt(er);
  const t1 = Math.sqrt(
    ((1.0 - Math.sin(B1)) / (1.0 + Math.sin(B1)))
    * ((1.0 + e * Math.sin(B1)) / (1.0 - e * Math.sin(B1))) ** e,
  );
  const t2 = Math.sqrt(
    ((1.0 - Math.sin(B2)) / (1.0 + Math.sin(B2)))
    * ((1.0 + e * Math.sin(B2)) / (1.0 - e * Math.sin(B2))) ** e,
  );
  const t0 = Math.sqrt(
    ((1.0 - Math.sin(B0)) / (1.0 + Math.sin(B0)))
    * ((1.0 + e * Math.sin(B0)) / (1.0 - e * Math.sin(B0))) ** e,
  );
  const t = Math.sqrt(
    ((1.0 - Math.sin(LAT)) / (1.0 + Math.sin(LAT)))
    * ((1.0 + e * Math.sin(LAT)) / (1.0 - e * Math.sin(LAT))) ** e,
  );
  const m1
    = Math.cos(B1) / (1.0 - er * Math.sin(B1) * Math.sin(B1)) ** 0.5;
  const m2
    = Math.cos(B2) / (1.0 - er * Math.sin(B2) * Math.sin(B2)) ** 0.5;
  let n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
  const FF = m1 / (n * t1 ** n);
  const p0 = a * FF * t0 ** n;
  const FII = n * (LON - L0);
  const p = a * FF * t ** n;
  n = p0 - p * Math.cos(FII) + FN;
  e = p * Math.sin(FII) + FE;

  return [n.toFixed(2), e.toFixed(2)];
}
</script>

<template>
  <div class="text-right text-no-wrap px-2">
    <span class="google-map">
      <a
        class="text-link text-body-2"
        :href="`https://www.google.com/maps/?q=${latitude},${longitude}`"
        :title="`https://www.google.com/maps/?q=${latitude},${longitude}`"
        target="GoogleMap"
      >{{ $t("map.google_maps") }}</a>
    </span>
    <span> | </span>
    <span class="xgis2">
      <a
        class="text-link text-body-2"
        :href="`https://xgis.maaamet.ee/xgis2/page/app/geoloogia400k?punkt=${geoToLest(
          latitude,
          longitude,
        )}&moot=20000&tooltip=${tooltip}`"
        :title="`https://xgis.maaamet.ee/xgis2/page/app/geoloogia400k?punkt=${geoToLest(
          latitude,
          longitude,
        )}&moot=20000&tooltip=${tooltip}`"
        target="EstonianMap"
      >{{ $t("map.estonian_geoportal") }}</a>
    </span>
  </div>
</template>
