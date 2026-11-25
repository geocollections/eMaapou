<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui/components/Table.vue";
import type {
  CatalogueValue,
  Specimen,
  SpecimenAgent,
  SpecimenAnalysis,
  SpecimenAttachmentLink,
  SpecimenChild,
  SpecimenFile,
  SpecimenIndexEntry,
  SpecimenPhoto,
  SpecimenPublication,
  SpecimenReference,
  SpecimenRock,
  SpecimenTaxon,
} from "~/types/specimen";
import { mdiArchive, mdiLayersTriple, mdiMapMarkerOutline } from "@mdi/js";
import { h } from "vue";
import { ULink, UTooltip } from "#components";
import { fetchCataloguePages } from "~/utils/fetchCataloguePages";

const props = defineProps<{
  specimen: Specimen;
  specimenAlt?: Nullable<SpecimenIndexEntry>;
  images: SpecimenPhoto[];
  otherFiles: SpecimenFile[];
  hasSupplementaryError?: boolean;
}>();

const localePath = useLocalePath();
const { locale, t } = useI18n();
const specimenCardUi = {
  root: "overflow-hidden rounded-portal-card border border-portal-border bg-white shadow-sm ring-0 divide-y-0",
  body: "p-0",
} as const;
const relatedCardUi = {
  root: "overflow-hidden rounded-portal-card border border-portal-border ring-0 divide-y-0",
  body: "flex min-h-24 min-w-0 items-center gap-3 p-4",
} as const;
const activeImage = ref(props.images?.[0] ?? null);
const imagePreviewOpen = ref(false);
const previewImage = ref<{
  id: number;
  filename: string;
  info: { title: string; author?: string; date?: string };
} | null>(null);
const previewImages = computed(() => previewImage.value
  ? [previewImage.value]
  : []);
function openImagePreview(
  image: SpecimenPhoto & {
    image_author?: string;
    image_date?: string;
    author?: SpecimenAgent;
  },
  title: string | null | undefined,
) {
  previewImage.value = {
    id: Number(image.id),
    filename: image.filename,
    info: {
      title: title || String(image.id),
      author: image.image_author || image.agent || image.author_free || agentName(image.author) || undefined,
      date: image.image_date || image.date_created_free || image.date_created || undefined,
    },
  };
  imagePreviewOpen.value = true;
}

watch(() => props.images, (images) => {
  activeImage.value = images?.[0] ?? null;
});

const activeImageIndex = computed(() =>
  props.images?.findIndex(image => image.id === activeImage.value?.id) ?? -1,
);

function showRelativeImage(offset: number) {
  const images = props.images;
  if (!images?.length)
    return;

  const currentIndex = activeImageIndex.value >= 0
    ? activeImageIndex.value
    : 0;
  const nextIndex = (currentIndex + offset + images.length) % images.length;
  activeImage.value = images[nextIndex] ?? null;
}

const collection = computed(() => props.specimen.collection);
const classification = computed(() => props.specimen.classification);
const locality = computed(() => props.specimen.locality_is_private ? null : props.specimen.locality);
const stratigraphy = computed(() => props.specimen.stratigraphy);
const lithostratigraphy = computed(() => props.specimen.lithostratigraphy);
const { $apiFetch, $solrFetch, $translate, $formatDate, $openGeokirjandus } = useNuxtApp();

interface DetailField {
  label: string;
  value?: string | number | null;
  to?: string | null;
  external?: boolean;
}

function webLink(value?: Nullable<string>) {
  return value && /^https?:\/\//i.test(value)
    ? value
    : undefined;
}

function visibleFields(fields: DetailField[]) {
  return fields.filter(({ value }) => value != null && String(value).trim() !== "");
}

function localized(et?: Nullable<string>, en?: Nullable<string>) {
  return $translate({ et, en }) || et || en;
}

function catalogueValue(entry: Nullable<CatalogueValue>) {
  return localized(entry?.value, entry?.value_en);
}

function agentName(agent?: Nullable<SpecimenAgent>) {
  return agent?.name || [agent?.forename, agent?.surname].filter(Boolean).join(" ");
}

function formatDate(date?: Nullable<string>) {
  return date
    ? $formatDate(date)
    : null;
}

const specimenFields = computed(() => {
  const { specimen, specimenAlt } = props;
  const collector = agentName(specimen.collector);
  const collectedDate = formatDate(specimen.date_collected);
  const sample = specimen.sample;

  return visibleFields([
    {
      label: t("specimen.id"),
      value: specimen.id,
    },
    {
      label: t("specimen.number"),
      value: specimen.number,
    },
    {
      label: t("specimen.collectionNr"),
      value: specimen.collection?.number,
      to: specimen.collection && localePath({
        name: "collection-id",
        params: { id: specimen.collection.id },
      }),
    },
    {
      label: t("portal.specimenDetail.collectionName"),
      value: localized(specimen.collection?.name, specimen.collection?.name_en),
    },
    {
      label: t("specimen.oldNumber"),
      value: specimen.old_number,
    },
    {
      label: t("portal.specimenDetail.fieldNumber"),
      value: specimen.number_field,
    },
    {
      label: t("specimen.parent"),
      value: specimen.parent?.number || specimen.parent?.id,
      to: specimen.parent && localePath({
        name: "specimen-id",
        params: { id: specimen.parent.id },
      }),
    },
    {
      label: t("specimen.sample"),
      value: sample?.number || specimen.sample_number || sample?.id,
      to: sample && localePath({
        name: "sample-id",
        params: { id: sample.id },
      }),
    },
    {
      label: t("portal.specimenDetail.recordedSampleNumber"),
      value: sample?.number && sample.number !== specimen.sample_number
        ? specimen.sample_number
        : null,
    },
    {
      label: t("specimen.type"),
      value: catalogueValue(specimen.type),
    },
    {
      label: t("portal.specimenDetail.subtype"),
      value: catalogueValue(specimen.subtype),
    },
    {
      label: t("portal.specimenDetail.kind"),
      value: catalogueValue(specimen.kind),
    },
    {
      label: t("portal.specimenDetail.materialCategory"),
      value: catalogueValue(specimen.fossil),
    },
    {
      label: t("specimen.group"),
      value: localized(classification.value?.name, classification.value?.name_en),
    },
    {
      label: t("specimen.fossilGroup"),
      value: specimenAlt?.fossilgroup,
    },
    {
      label: t("specimen.part"),
      value: specimen.part,
    },
    {
      label: t("portal.specimenDetail.numberOfPieces"),
      value: specimen.number_pieces,
    },
    {
      label: t("specimen.originalStatus"),
      value: catalogueValue(specimen.original_status),
    },
    {
      label: t("portal.specimenDetail.status"),
      value: catalogueValue(specimen.status),
    },
    {
      label: t("portal.specimenDetail.presence"),
      value: catalogueValue(specimen.presence),
    },
    {
      label: t("storage.storage"),
      value: specimen.storage?.name,
    },
    {
      label: t("portal.specimenDetail.accessionNumber"),
      value: specimen.accession?.number,
    },
    {
      label: t("portal.specimenDetail.deaccessionNumber"),
      value: specimen.deaccession?.number,
    },
    {
      label: t("specimen.depth"),
      value: specimen.depth,
    },
    {
      label: t("specimen.depthInterval"),
      value: specimen.depth_interval,
    },
    {
      label: t("specimen.collector"),
      value: collector || specimen.collector_text,
    },
    {
      label: t("portal.specimenDetail.recordedCollector"),
      value: collector && collector !== specimen.collector_text
        ? specimen.collector_text
        : null,
    },
    {
      label: t("specimen.dateCollected"),
      value: collectedDate || specimen.date_collected_text,
    },
    {
      label: t("portal.specimenDetail.recordedCollectionDate"),
      value: collectedDate && collectedDate !== specimen.date_collected_text
        ? specimen.date_collected_text
        : null,
    },
    {
      label: t("portal.specimenDetail.collectingRemarks"),
      value: specimen.remarks_collecting,
    },
    {
      label: t("specimen.remarks"),
      value: specimen.remarks,
    },
    {
      label: t("portal.specimenDetail.tags"),
      value: specimen.tags,
    },
    {
      label: t("specimen.institution"),
      value: localized(specimen.database?.name, specimen.database?.name_en),
      to: webLink(specimen.database?.url),
      external: true,
    },
    {
      label: t("locality.dateAdded"),
      value: formatDate(specimen.date_added),
    },
    {
      label: t("locality.dateChanged"),
      value: formatDate(specimen.date_changed),
    },
  ]);
});

function fileLabel(file: SpecimenFile) {
  return localized(file.title, file.title_en) || file.original_filename || file.filename || String(file.id);
}

function fileFields(file: SpecimenFile) {
  return visibleFields([
    {
      label: t("file.title"),
      value: localized(file.title, file.title_en),
    },
    {
      label: t("file.filename"),
      value: file.original_filename,
    },
    {
      label: t("portal.specimenDetail.imageNo"),
      value: file.image_number,
    },
    {
      label: t("attachment.author"),
      value: file.agent || file.author_free,
    },
    {
      label: t("portal.specimenDetail.date"),
      value: file.date_created_free || formatDate(file.date_created),
    },
    {
      label: t("portal.specimenDetail.description"),
      value: localized(file.description, file.description_en),
    },
    {
      label: t("portal.specimenDetail.resolution"),
      value: file.image_width && file.image_height
        ? `${[file.image_width, file.image_height].join(" × ")} px`
        : null,
    },
    {
      label: t("portal.specimenDetail.scaleBar"),
      value: file.image_scalebar,
    },
    {
      label: t("portal.specimenDetail.device"),
      value: file.device_txt,
    },
    {
      label: t("file.licence"),
      value: file.licence,
    },
    {
      label: t("portal.specimenDetail.fileFormat"),
      value: file.format_value,
    },
    {
      label: t("portal.specimenDetail.fileSize"),
      value: file.size_mb != null
        ? t("portal.specimenDetail.sizeInMegabytes", { size: file.size_mb })
        : null,
    },
    {
      label: t("specimen.remarks"),
      value: file.remarks,
    },
  ]);
}

type PhotoLicence = Pick<NonNullable<SpecimenAttachmentLink["attachment"]>, "id" | "licence">;

const { data: photoLicence } = useAsyncData(
  () => `specimen-photo-licence-${activeImage.value?.id ?? "empty"}`,
  async (): Promise<PhotoLicence> => {
    const photo = activeImage.value;
    if (!photo || photo.licence)
      return { id: photo?.id ?? 0, licence: null };

    return $apiFetch<PhotoLicence>(`/attachments/${photo.id}/`, {
      query: { expand: "licence", fields: "id,licence.name,licence.name_en" },
    });
  },
  { server: false, lazy: true },
);

const activeImageFields = computed(() => {
  const photo = activeImage.value;
  if (!photo)
    return [];

  const licence = Number(photoLicence.value?.id) === Number(photo.id)
    ? photoLicence.value?.licence
    : null;

  return fileFields({ ...photo, licence: localized(licence?.name, licence?.name_en) || photo.licence });
});

const geographyFields = computed(() => visibleFields([
  {
    label: t("portal.specimenDetail.recordedLocality"),
    value: props.specimen.locality_is_private ? null : props.specimen.locality_text,
  },
  {
    label: t("specimen.stratigraphy"),
    value: localized(stratigraphy.value?.name, stratigraphy.value?.name_en),
    to: stratigraphy.value && localePath({
      name: "stratigraphy-id",
      params: { id: stratigraphy.value.id },
    }),
  },
  {
    label: t("specimen.lithostratigraphy"),
    value: localized(lithostratigraphy.value?.name, lithostratigraphy.value?.name_en),
    to: lithostratigraphy.value && localePath({
      name: "stratigraphy-id",
      params: { id: lithostratigraphy.value.id },
    }),
  },
  {
    label: t("portal.specimenDetail.stratigraphyRemarks"),
    value: props.specimen.stratigraphy_text,
  },
]));

const route = useRoute();
const router = useRouter();
const { data: localityPreview } = await useAsyncData(
  `specimen-locality-preview-${props.specimen.id}`,
  async () => {
    if (!locality.value)
      return null;

    try {
      const response = await $apiFetch<GeoloogiaListResponse>(`/localities/${locality.value.id}/locality-images/`, {
        query: {
          expand: "attachment,attachment.author",
          fields: "attachment.id,attachment.filename,attachment.author.name,attachment.date_created,attachment.date_created_free",
          limit: 1,
        },
      });
      return response.results?.[0]?.attachment?.filename
        ? response.results[0].attachment
        : null;
    }
    catch (error) {
      console.error("Could not load a preview image for the related locality.", error);
      return null;
    }
  },
  {
    default: () => null,
  },
);
const coordinatePageSize = 12;
const initialCoordinatePage = Number(route.query.coordinatePage);
const coordinatePage = ref(Number.isInteger(initialCoordinatePage) && initialCoordinatePage > 0
  ? initialCoordinatePage
  : 1);
const specimenPath = `/specimens/${props.specimen.id}/`;

async function getRelated<T>(path: string, query: Record<string, string | number>) {
  try {
    const items = await fetchCataloguePages(offset => $apiFetch<GeoloogiaListResponse<T>>(path, {
      query: { ...query, limit: 100, offset },
    }));
    return { items, failed: false };
  }
  catch (error) {
    console.error("Could not load specimen relations.", path, error);
    return { items: [] as T[], failed: true };
  }
}

const emptyRelation = { items: [], failed: false };
const { data: relatedData, refresh: refreshRelated } = await useAsyncData(
  `specimen-related-${props.specimen.id}`,
  async () => {
    const [identifications, rockIdentifications, references, children, analyses] = await Promise.all([
      getRelated<SpecimenTaxon>(`${specimenPath}specimen-taxa/`, {
        expand: "taxon,agent,reference,identification_type",
        fields: "id,is_current,name,date_identified,taxon.id,taxon.name,taxon.full_name,agent.name,agent.forename,agent.surname,reference.id,reference.reference,reference.title,identification_type.value,identification_type.value_en",
        ordering: "id",
      }),
      getRelated<SpecimenRock>(`${specimenPath}specimen-rocks/`, {
        expand: "rock,agent,reference,type",
        fields: "id,is_current,name,name_en,date_identified,remarks,rock.id,rock.name,rock.name_en,agent.name,agent.forename,agent.surname,reference.id,reference.reference,reference.title,type.value,type.value_en",
        ordering: "id",
      }),
      getRelated<SpecimenReference>(`${specimenPath}specimen-references/`, {
        expand: "reference,reference.journal",
        fields: [
          "id",
          "pages",
          "figures",
          "remarks",
          ...[
            "id",
            "reference",
            "title",
            "title_original",
            "title_translated",
            "author",
            "author_original",
            "year",
            "journal.name",
            "journal_text",
            "journal_additional",
            "book",
            "book_original",
            "book_translated",
            "book_editor",
            "publisher",
            "publisher_place",
            "volume",
            "number",
            "pages",
            "figures",
            "doi",
            "isbn",
            "issn",
            "abstract",
            "author_keywords",
            "location_text",
            "url",
            "pdf",
          ].map(field => `reference.${field}`),
        ].join(","),
        ordering: "-reference__year,id",
      }),
      getRelated<SpecimenChild>("/specimens/", {
        parent: props.specimen.id,
        expand: "database",
        fields: "id,number,database.acronym",
        ordering: "id",
      }),
      getRelated<SpecimenAnalysis>(`${specimenPath}analyses/`, {
        expand: "analysis_method,analyst",
        fields: "id,analysis_method.name,analysis_method.name_en,analyst.name",
        ordering: "id",
      }),
    ]);

    return {
      identifications,
      rockIdentifications,
      references,
      children,
      analyses,
    };
  },
  {
    default: () => ({
      identifications: emptyRelation,
      rockIdentifications: emptyRelation,
      references: emptyRelation,
      children: emptyRelation,
      analyses: emptyRelation,
    }),
  },
);

const hasSupplementaryError = computed(() =>
  props.hasSupplementaryError || Object.values(relatedData.value).some(result => result.failed),
);

async function retrySupplementaryData() {
  await Promise.all([
    refreshNuxtData(`specimen-${route.params.id}`),
    refreshRelated(),
  ]);
}

const linkedRecordSections = computed(() => [
  {
    heading: t("portal.specimenDetail.childSpecimens"),
    records: relatedData.value.children.items.map(record => ({
      id: record.id,
      label: [record.database?.acronym, record.number].filter(Boolean).join(" ") || String(record.id),
      details: "",
      to: localePath({
        name: "specimen-id",
        params: { id: record.id },
      }),
    })),
  },
  {
    heading: t("portal.specimenDetail.relatedAnalyses"),
    records: relatedData.value.analyses.items.map(record => ({
      id: record.id,
      label: t("portal.specimenDetail.analysisRecord", { id: record.id }),
      details: [
        localized(record.analysis_method?.name, record.analysis_method?.name_en),
        agentName(record.analyst),
      ].filter(Boolean).join(" · "),
      to: localePath({
        name: "analysis-id",
        params: { id: record.id },
      }),
    })),
  },
].filter(section => section.records.length));

const {
  data: coordinateData,
  status: coordinateStatus,
  error: coordinateError,
} = await useAsyncData(
  `specimen-coordinate-records-${props.specimen.id}`,
  async () => {
    const { latitude, longitude } = locality.value ?? {};
    if (latitude == null || longitude == null)
      return { records: [], count: 0 };

    const response = await $solrFetch<SolrResponse>("/specimen", {
      query: {
        q: "*:*",
        fq: [
          `latitude:${latitude}`,
          `longitude:${longitude}`,
          `-id:${props.specimen.id}`,
          "-is_private:1",
        ],
        rows: coordinatePageSize,
        start: (coordinatePage.value - 1) * coordinatePageSize,
        sort: "specimen_full_name asc",
        fl: "id,specimen_full_name",
      },
    });
    const records = response.response.docs;
    const imageQuery = records
      .map(record => `specimen_id:${record.id}`)
      .join(" OR ");
    const imagesBySpecimen = new Map<number, any>();

    if (imageQuery) {
      try {
        const imageResponse = await $solrFetch<SolrResponse>("/specimen_image", {
          query: {
            q: imageQuery,
            rows: 100,
            sort: "id asc",
            fq: "-is_private:1",
            fl: "id,specimen_id,filename,image_author,image_date",
          },
        });
        for (const image of imageResponse.response.docs) {
          const specimenId = Number(image.specimen_id);
          if (!imagesBySpecimen.has(specimenId))
            imagesBySpecimen.set(specimenId, image);
        }
      }
      catch (error) {
        console.error("Could not load preview images for same-coordinate specimens.", error);
      }
    }

    return {
      records: records.map(record => ({
        ...record,
        preview: imagesBySpecimen.get(Number(record.id)),
      })),
      count: response.response.numFound,
    };
  },
  {
    watch: [coordinatePage],
    default: () => ({ records: [], count: 0 }),
  },
);

const coordinateRecords = computed(() => coordinateData.value.records);
const coordinateRecordCount = computed(() => coordinateData.value.count);
const coordinatePageCount = computed(() => Math.ceil(coordinateRecordCount.value / coordinatePageSize));
const coordinateFrom = computed(() => coordinateRecordCount.value
  ? (coordinatePage.value - 1) * coordinatePageSize + 1
  : 0);
const coordinateTo = computed(() => Math.min(coordinatePage.value * coordinatePageSize, coordinateRecordCount.value));

function setCoordinatePage(page: number) {
  coordinatePage.value = page;
  const query = { ...route.query };
  if (page === 1)
    delete query.coordinatePage;
  else
    query.coordinatePage = String(page);
  void router.replace({ query });
}

watch(() => route.query.coordinatePage, (value) => {
  const page = Number(value);
  const validPage = Number.isInteger(page) && page > 0
    ? page
    : 1;
  if (validPage !== coordinatePage.value)
    coordinatePage.value = validPage;
});

watch(coordinatePageCount, (pageCount) => {
  if (pageCount > 0 && coordinatePage.value > pageCount)
    setCoordinatePage(pageCount);
});
const identifiedTaxon = computed(() => props.specimenAlt?.taxon_full || props.specimenAlt?.taxon);
const identifiedRock = computed(() => localized(props.specimenAlt?.rock, props.specimenAlt?.rock_en));
const titleAlt = computed(() => props.specimenAlt?.rock_txt?.[0] || identifiedRock.value || identifiedTaxon.value);

interface IdentificationTableRow {
  id: string | number;
  subject: string;
  subjectId?: number;
  name?: Nullable<string>;
  secondaryName?: Nullable<string>;
  identifiedBy?: string;
  dateIdentified?: Nullable<string>;
  type?: Nullable<string>;
  status?: string;
  reference?: Nullable<SpecimenPublication>;
  remarks?: Nullable<string>;
}

function identificationStatus(current: Nullable<boolean>) {
  return current == null
    ? undefined
    : t(current ? "portal.specimenDetail.current" : "portal.specimenDetail.previous");
}

const identificationRows = computed<IdentificationTableRow[]>(() => {
  const items = relatedData.value.identifications.items;
  if (!items.length && identifiedTaxon.value) {
    return [
      {
        id: "indexed-taxon",
        subject: identifiedTaxon.value,
        subjectId: props.specimenAlt?.taxon_id,
      },
    ];
  }

  return items.map((item) => {
    const subject = item.taxon?.full_name || item.taxon?.name || item.name || "—";
    return {
      id: item.id,
      subject,
      subjectId: item.taxon?.id,
      name: item.name !== subject
        ? item.name
        : null,
      identifiedBy: agentName(item.agent),
      dateIdentified: item.date_identified_free || formatDate(item.date_identified),
      type: catalogueValue(item.identification_type),
      status: identificationStatus(item.is_current),
      reference: item.reference,
      remarks: item.remarks,
    };
  });
});

const rockIdentificationRows = computed<IdentificationTableRow[]>(() => {
  const items = relatedData.value.rockIdentifications.items;
  if (!items.length && identifiedRock.value) {
    return [
      {
        id: "indexed-rock",
        subject: identifiedRock.value,
        subjectId: props.specimenAlt?.rock_id,
        name: props.specimenAlt?.rock_txt?.[0] !== identifiedRock.value
          ? props.specimenAlt?.rock_txt?.[0]
          : null,
      },
    ];
  }

  return items.map((item) => {
    const name = localized(item.name, item.name_en);
    const otherName = locale.value === "en"
      ? item.name
      : item.name_en;
    const subject = localized(item.rock?.name, item.rock?.name_en) || name || "—";
    return {
      id: item.id,
      subject,
      subjectId: item.rock?.id,
      name: name !== subject
        ? name
        : null,
      secondaryName: otherName !== name && otherName !== subject
        ? otherName
        : null,
      identifiedBy: agentName(item.agent),
      dateIdentified: item.date_identified_free || formatDate(item.date_identified),
      type: catalogueValue(item.type),
      status: identificationStatus(item.is_current),
      reference: item.reference,
      remarks: item.remarks,
    };
  });
});

function identificationColumnsFor(rows: IdentificationTableRow[], kind: "taxon" | "rock"): TableColumn<IdentificationTableRow>[] {
  const columns: TableColumn<IdentificationTableRow>[] = [
    {
      accessorKey: "subject",
      header: t(`portal.specimenDetail.${kind}`),
      cell: ({ row }) => {
        const { subject, subjectId, name, secondaryName } = row.original;
        const link = subjectId
          ? h(ULink, {
              to: `https://${kind === "taxon"
                ? "fossiilid.info"
                : "kivid.info"}/${subjectId}`,
              external: true,
              target: "_blank",
              rel: "noopener noreferrer",
              class: "font-semibold text-portal-link underline underline-offset-2",
            }, () => subject)
          : subject;
        return h("div", { class: "whitespace-normal min-w-28" }, [
          typeof link !== "string" && kind === "taxon"
            ? h(UTooltip, {
                text: t("portal.specimenDetail.opensFossiilidInfoInANewTab"),
                delayDuration: 250,
              }, {
                default: () => link,
              })
            : link,
          ...[name, secondaryName].filter((label): label is string => !!label).map(label => h("div", { class: "text-xs text-portal-muted" }, label)),
        ]);
      },
    },
  ];

  for (const [key, label] of [
    ["identifiedBy", "portal.specimenDetail.identifiedBy"],
    ["dateIdentified", "portal.specimenDetail.date"],
    ["type", "portal.specimenDetail.identificationType"],
    ["status", "portal.specimenDetail.status"],
    ["remarks", "specimen.remarks"],
  ] as const) {
    if (rows.some(row => row[key])) {
      columns.push({
        accessorKey: key,
        header: t(label),
        cell: ({ row }) => row.original[key] || "—",
      });
    }
  }

  if (rows.some(row => row.reference)) {
    columns.push({
      accessorKey: "reference",
      header: t("specimenIdentification.reference"),
      cell: ({ row }) => {
        const publication = row.original.reference;
        return publication
          ? h("button", {
              type: "button",
              class: "cursor-pointer whitespace-normal text-left text-portal-link underline",
              onClick: () => $openGeokirjandus("reference", String(publication.id)),
            }, publication.reference || publication.title || String(publication.id))
          : "—";
      },
    });
  }
  return columns;
}

const identificationColumns = computed(() => identificationColumnsFor(identificationRows.value, "taxon"));
const rockIdentificationColumns = computed(() => identificationColumnsFor(rockIdentificationRows.value, "rock"));

function referenceFields(item: SpecimenReference) {
  const publication = item.reference;
  const journal = typeof publication?.journal === "object"
    ? publication.journal?.name
    : null;
  const issue = publication?.number || publication?.issue;
  return visibleFields([
    {
      label: t("attachment.author"),
      value: publication?.author,
    },
    {
      label: t("portal.specimenDetail.originalAuthor"),
      value: publication?.author_original !== publication?.author
        ? publication?.author_original
        : null,
    },
    {
      label: t("portal.specimenDetail.originalTitle"),
      value: publication?.title_original !== publication?.title
        ? publication?.title_original
        : null,
    },
    {
      label: t("portal.specimenDetail.translatedTitle"),
      value: publication?.title_translated !== publication?.title
        ? publication?.title_translated
        : null,
    },
    {
      label: t("portal.specimenDetail.publication"),
      value: journal || publication?.journal_text,
    },
    {
      label: t("portal.specimenDetail.bookTitle"),
      value: publication?.book,
    },
    {
      label: t("portal.specimenDetail.additionalJournal"),
      value: publication?.journal_additional,
    },
    {
      label: t("portal.specimenDetail.originalBook"),
      value: publication?.book_original !== publication?.book
        ? publication?.book_original
        : null,
    },
    {
      label: t("portal.specimenDetail.translatedBook"),
      value: publication?.book_translated !== publication?.book
        ? publication?.book_translated
        : null,
    },
    {
      label: t("portal.specimenDetail.editor"),
      value: publication?.book_editor,
    },
    {
      label: t("portal.specimenDetail.publisher"),
      value: [publication?.publisher, publication?.publisher_place].filter(Boolean).join(", "),
    },
    {
      label: t("portal.specimenDetail.volumeIssue"),
      value: [publication?.volume, issue].filter(Boolean).join(" / "),
    },
    {
      label: t("portal.specimenDetail.pages"),
      value: publication?.pages,
    },
    {
      label: t("portal.specimenDetail.figures"),
      value: publication?.figures,
    },
    {
      label: t("portal.specimenDetail.citedPages"),
      value: item.pages,
    },
    {
      label: t("portal.specimenDetail.citedFigures"),
      value: item.figures,
    },
    {
      label: t("specimenReference.remarks"),
      value: item.remarks,
    },
    { label: "ISBN", value: publication?.isbn },
    { label: "ISSN", value: publication?.issn },
    {
      label: t("portal.specimenDetail.abstract"),
      value: publication?.abstract,
    },
    {
      label: t("portal.specimenDetail.tags"),
      value: publication?.author_keywords,
    },
    {
      label: t("portal.specimenDetail.referenceLocation"),
      value: publication?.location_text,
    },
  ]);
}

const mapBaseLayer = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return "Estonian map";

  return "OpenStreetMap";
});

const mapOverlays = computed(() => {
  if (locality.value?.country?.iso_3166_1_alpha_2 === "EE")
    return ["Estonian bedrock" as const];
  return undefined;
});
</script>

<template>
  <div class="mx-auto w-full max-w-360 px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-10">
    <div
      v-if="hasSupplementaryError"
      class="mb-5 flex flex-wrap items-center gap-3 rounded-portal-card border border-portal-border px-5 py-3 text-sm"
      role="status"
    >
      {{ t('portal.specimenDetail.supplementaryLoadError') }}
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        @click="retrySupplementaryData"
      >
        {{ t('portal.common.retry') }}
      </UButton>
    </div>
    <div
      class="grid grid-cols-1 items-start gap-5"
      :class="{ 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]': props.images?.length && activeImage }"
    >
      <UCard
        v-if="props.images?.length && activeImage"
        as="section"
        :ui="specimenCardUi"
        class="min-w-0"
      >
        <div class="flex items-end justify-between gap-4 border-b border-portal-border bg-portal-mint/60 px-5 py-4 sm:px-6">
          <div>
            <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
              {{ t('portal.specimenDetail.collectionMedia') }}
            </p>
            <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
              {{ t('portal.specimenDetail.photographs') }}
            </h2>
          </div>
          <div v-if="props.images.length > 1" class="flex items-center gap-1">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-chevron-left"
              class="flex! size-9! min-h-9! w-9! items-center! justify-center! rounded-portal-control! bg-transparent! p-0! text-portal-muted hover:bg-portal-subtle hover:text-portal-heading"
              :aria-label="t('portal.specimenDetail.previousImage')"
              @click="showRelativeImage(-1)"
            />
            <span class="min-w-12 text-center text-xs tabular-nums text-portal-muted">
              {{ activeImageIndex + 1 }} / {{ props.images.length }}
            </span>
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-chevron-right"
              class="flex! size-9! min-h-9! w-9! items-center! justify-center! rounded-portal-control! bg-transparent! p-0! text-portal-muted hover:bg-portal-subtle hover:text-portal-heading"
              :aria-label="t('portal.specimenDetail.nextImage')"
              @click="showRelativeImage(1)"
            />
          </div>
          <span v-else class="text-sm tabular-nums text-portal-muted">1</span>
        </div>
        <div class="grid gap-4 p-4 sm:p-5">
          <div class="relative">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              class="h-auto! min-h-55 w-full rounded-portal-card! p-0! cursor-zoom-in items-center justify-center overflow-hidden bg-portal-subtle focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus sm:min-h-80"
              :aria-label="t('portal.specimenDetail.openLargeImagePreview')"
              @click="openImagePreview(activeImage, titleAlt || specimen.number)"
            >
              <NuxtImg
                :src="activeImage.filename"
                provider="geocollections"
                :alt="titleAlt || identifiedTaxon || specimen.number || undefined"
                width="900"
                height="600"
                fit="contain"
                class="max-h-[min(55vh,480px)] w-full object-contain"
              />
            </UButton>
          </div>
          <div class="flex min-w-0 flex-wrap items-end justify-between gap-4">
            <div class="min-w-0">
              <ULink :to="localePath({ name: 'file-id', params: { id: activeImage.id } })" class="font-semibold text-portal-link underline underline-offset-2">
                {{ fileLabel(activeImage) }}
              </ULink>
              <dl class="m-0 mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
                <template v-for="field in activeImageFields" :key="field.label">
                  <dt class="text-portal-muted">
                    {{ field.label }}
                  </dt>
                  <dd class="m-0 whitespace-pre-line wrap-anywhere text-portal-text">
                    {{ field.value }}
                  </dd>
                </template>
              </dl>
            </div>
            <div v-if="props.images.length > 1" class="flex max-w-full gap-2 overflow-x-auto p-1">
              <UButton
                v-for="image in props.images"
                :key="image.id"
                type="button"
                color="neutral"
                variant="ghost"
                square
                class="size-14! shrink-0 overflow-hidden rounded-portal-control! p-0! border bg-portal-subtle transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus"
                :class="activeImage.id === image.id ? 'border-2 border-portal-primary' : 'border-portal-border hover:border-portal-border-hover'"
                :aria-label="t('portal.specimenDetail.showImage', { number: image.image_number || image.id })"
                :aria-pressed="activeImage.id === image.id"
                @click="activeImage = image"
              >
                <NuxtImg
                  :src="image.filename"
                  provider="geocollections"
                  alt=""
                  width="180"
                  height="180"
                  fit="cover"
                  loading="lazy"
                  class="size-full object-cover"
                />
              </UButton>
            </div>
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              class="min-h-11 rounded-portal-control border-portal-border px-4 text-sm font-medium text-portal-heading hover:border-portal-border-hover hover:text-portal-link"
              @click="openImagePreview(activeImage, titleAlt || specimen.number)"
            >
              {{ t('portal.specimenDetail.viewLarger') }}
            </UButton>
          </div>
        </div>
      </UCard>
      <div class="flex min-w-0 flex-col gap-5">
        <UCard
          as="section"
          :ui="specimenCardUi"
          class="min-w-0"
        >
          <div class="border-b border-portal-border bg-portal-selected px-5 py-4 sm:px-6">
            <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
              {{ t('portal.specimenDetail.recordDetails') }}
            </p>
            <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
              {{ t('portal.specimenDetail.specimenInformation') }}
            </h2>
          </div>
          <dl class="m-0 grid grid-cols-1 px-5 sm:grid-cols-2 sm:gap-x-8 sm:px-6">
            <div
              v-for="field in specimenFields"
              :key="field.label"
              class="min-w-0 border-b border-portal-border py-3 last:border-b-0"
            >
              <dt class="text-xs text-portal-muted">
                {{ field.label }}
              </dt>
              <dd class="m-0 whitespace-pre-line wrap-anywhere text-sm text-portal-text">
                <ULink
                  v-if="field.to"
                  :to="field.to"
                  :external="field.external"
                  class="text-portal-link underline underline-offset-2"
                >
                  {{ field.value }}
                </ULink>
                <template v-else>
                  {{ field.value }}
                </template>
              </dd>
            </div>
          </dl>
        </UCard>
        <UCard
          v-if="identificationRows.length"
          as="section"
          :ui="specimenCardUi"
        >
          <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
            {{ t('portal.specimenDetail.taxonIdentifications') }}
          </h2>
          <UTable
            :data="identificationRows"
            :columns="identificationColumns"
            :caption="t('portal.specimenDetail.taxonIdentifications')"
            :empty="t('portal.specimenDetail.noIdentificationsAvailable')"
            class="text-sm"
            :ui="{
              root: 'overflow-x-auto',
              base: 'min-w-full',
              thead: 'bg-portal-subtle text-left text-portal-muted',
              tbody: 'divide-y divide-portal-border',
              tr: 'transition-colors hover:bg-portal-subtle',
              th: 'px-4 py-3 text-left font-medium text-portal-muted',
              td: 'px-4 py-3 text-portal-text',
              empty: 'px-4 py-6 text-center text-sm text-portal-muted',
            }"
          />
        </UCard>
      </div>
    </div>
    <UCard
      v-if="locality || specimen.locality_is_private || geographyFields.length"
      as="section"
      :ui="specimenCardUi"
      class="mt-5"
    >
      <div class="flex items-start justify-between gap-4 border-b border-portal-border bg-portal-subtle px-5 py-4 sm:px-6">
        <div>
          <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
            {{ t('portal.specimenDetail.geographicContext') }}
          </p>
          <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
            {{ t('portal.specimenDetail.localityGeology') }}
          </h2>
        </div>
        <span v-if="locality?.country" class="mt-1 text-right text-xs text-portal-muted">
          {{ $translate({ et: locality.country.name, en: locality.country.name_en }) }}
        </span>
      </div>
      <div v-if="locality" class="flex items-center justify-between gap-4 px-5 pt-4 sm:px-6">
        <ULink :to="localePath({ name: 'locality-id', params: { id: locality.id } })" class="text-sm font-semibold text-portal-link underline underline-offset-2">
          {{ $translate({ et: locality.name, en: locality.name_en }) }}
        </ULink>
        <span v-if="locality.latitude != null && locality.longitude != null" class="shrink-0 font-mono text-[11px] tabular-nums text-portal-muted">
          {{ locality.latitude.toFixed(4) }}, {{ locality.longitude.toFixed(4) }}
        </span>
      </div>
      <div
        v-if="locality?.latitude != null && locality.longitude != null"
        class="mx-5 mt-4 sm:mx-6"
      >
        <MapDetail
          click-to-zoom
          height="clamp(16rem, 42vh, 24rem)"
          :base-layer="mapBaseLayer"
          :overlays="mapOverlays"
          :center="{ latitude: locality.latitude, longitude: locality.longitude }"
          :markers="[{
            latitude: locality.latitude,
            longitude: locality.longitude,
            radius: 10,
            text: localized(locality.name, locality.name_en) || String(locality.id),
            route: localePath({ name: 'locality-id', params: { id: locality.id } }),
          }]"
        />
      </div>
      <p v-else-if="specimen.locality_is_private || locality" class="mx-5 mt-4 border border-dashed border-portal-border px-4 py-6 text-sm text-portal-muted sm:mx-6">
        <template v-if="specimen.locality_is_private">
          {{ t('portal.specimenDetail.privateLocality') }}
        </template>
        <template v-else>
          {{ t('portal.specimenDetail.coordinatesAreNotAvailableForThisLocality') }}
        </template>
      </p>
      <dl v-if="geographyFields.length" class="m-0 grid grid-cols-1 px-5 py-3 sm:grid-cols-2 sm:gap-x-8 sm:px-6">
        <div
          v-for="field in geographyFields"
          :key="field.label"
          class="min-w-0 border-b border-portal-border py-3"
        >
          <dt class="text-xs text-portal-muted">
            {{ field.label }}
          </dt>
          <dd class="m-0 whitespace-pre-line wrap-anywhere text-sm text-portal-text">
            <ULink
              v-if="field.to"
              :to="field.to"
              class="text-portal-link underline underline-offset-2"
            >
              {{ field.value }}
            </ULink>
            <template v-else>
              {{ field.value }}
            </template>
          </dd>
        </div>
      </dl>
    </UCard>

    <UCard
      v-if="rockIdentificationRows.length"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ t('portal.specimenDetail.rockIdentifications') }}
      </h2>
      <UTable
        :data="rockIdentificationRows"
        :columns="rockIdentificationColumns"
        :caption="t('portal.specimenDetail.rockIdentifications')"
        :empty="t('portal.specimenDetail.noRockIdentificationsAvailable')"
        class="text-sm"
        :ui="{
          root: 'overflow-x-auto',
          base: 'min-w-full',
          thead: 'bg-portal-subtle text-left text-portal-muted',
          tbody: 'divide-y divide-portal-border',
          tr: 'transition-colors hover:bg-portal-subtle',
          th: 'px-4 py-3 text-left font-medium text-portal-muted',
          td: 'px-4 py-3 text-portal-text',
          empty: 'px-4 py-6 text-center text-sm text-portal-muted',
        }"
      />
    </UCard>

    <section v-if="collection || locality || stratigraphy" class="mt-10">
      <div class="mb-4 flex items-center gap-3">
        <span aria-hidden="true" class="h-1 w-10 rounded-full bg-portal-primary" />
        <h2 class="m-0 text-[20px] font-semibold tracking-[-0.015em] text-portal-heading">
          {{ t('portal.specimenDetail.exploreRelatedData') }}
        </h2>
      </div>
      <div class="grid gap-3 md:grid-cols-3">
        <UCard
          v-if="collection"
          as="article"
          :ui="relatedCardUi"
          class="group bg-portal-mint/60 transition-[border-color,background-color] hover:border-portal-primary/40 focus-within:border-portal-focus"
        >
          <div class="grid size-12 shrink-0 place-items-center rounded-portal-card bg-portal-background/80 text-portal-primary" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path :d="mdiArchive" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 mb-1 text-xs text-portal-muted">
              {{ t('portal.specimenDetail.collection') }}
            </p>
            <ULink
              :to="localePath({ name: 'collection-id-specimens', params: { id: collection.id } })"
              class="font-semibold text-portal-link underline underline-offset-2 group-hover:text-portal-primary"
            >
              {{ collection.number }}
            </ULink>
          </div>
          <span aria-hidden="true" class="text-lg text-portal-muted transition-transform group-hover:translate-x-0.5">→</span>
        </UCard>
        <UCard
          v-if="locality"
          as="article"
          :ui="relatedCardUi"
          class="group bg-portal-subtle transition-[border-color,background-color] hover:border-portal-primary/40 focus-within:border-portal-focus"
        >
          <UButton
            v-if="localityPreview"
            type="button"
            color="neutral"
            variant="ghost"
            square
            class="h-12! w-12! shrink-0 overflow-hidden rounded-portal-card! border border-portal-border bg-white p-0! focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus"
            :aria-label="t('portal.specimenDetail.openLocalityPhotoPreview')"
            @click="openImagePreview(localityPreview, $translate({ et: locality.name, en: locality.name_en }))"
          >
            <NuxtImg
              :src="localityPreview.filename"
              provider="geocollections"
              alt=""
              width="96"
              height="96"
              fit="cover"
              class="size-full object-cover"
            />
          </UButton>
          <div
            v-else
            class="grid size-12 shrink-0 place-items-center rounded-portal-card bg-portal-background/80 text-portal-primary"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path :d="mdiMapMarkerOutline" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 mb-1 text-xs text-portal-muted">
              {{ t('portal.specimenDetail.locality') }}
            </p>
            <ULink
              :to="localePath({ name: 'locality-id', params: { id: locality.id } })"
              class="font-semibold text-portal-link underline underline-offset-2 group-hover:text-portal-primary"
            >
              {{ $translate({ et: locality.name, en: locality.name_en }) }}
            </ULink>
          </div>
          <span aria-hidden="true" class="text-lg text-portal-muted transition-transform group-hover:translate-x-0.5">→</span>
        </UCard>
        <UCard
          v-if="stratigraphy"
          as="article"
          :ui="relatedCardUi"
          class="group bg-portal-selected transition-[border-color,background-color] hover:border-portal-primary/40 focus-within:border-portal-focus"
        >
          <div class="grid size-12 shrink-0 place-items-center rounded-portal-card bg-portal-background/80 text-portal-primary" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path :d="mdiLayersTriple" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 mb-1 text-xs text-portal-muted">
              {{ t('portal.specimenDetail.stratigraphy') }}
            </p>
            <ULink
              :to="localePath({ name: 'stratigraphy-id', params: { id: stratigraphy.id } })"
              class="font-semibold text-portal-link underline underline-offset-2 group-hover:text-portal-primary"
            >
              {{ $translate({ et: stratigraphy.name, en: stratigraphy.name_en }) }}
            </ULink>
          </div>
          <span aria-hidden="true" class="text-lg text-portal-muted transition-transform group-hover:translate-x-0.5">→</span>
        </UCard>
      </div>
    </section>

    <UCard
      v-if="relatedData.references.items.length"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ t('portal.specimenDetail.references') }}
      </h2>
      <ul class="m-0 grid list-none gap-3 p-4 sm:p-5">
        <li
          v-for="item in relatedData.references.items"
          :key="item.id"
          class="rounded-portal-card border border-portal-border bg-portal-background p-4 sm:p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <BaseLinkExternal
                v-if="item.reference?.id"
                class="font-semibold text-portal-link"
                @click="$openGeokirjandus('reference', String(item.reference.id))"
              >
                {{ item.reference.reference || item.reference.title || item.reference.id }}
              </BaseLinkExternal>
              <p v-else class="m-0 font-semibold text-portal-heading">
                {{ item.reference?.reference || item.reference?.title || item.reference?.id }}
              </p>
              <p v-if="item.reference?.title && item.reference.title !== item.reference.reference" class="mt-1 mb-0 text-sm text-portal-text">
                {{ item.reference.title }}
              </p>
            </div>
            <span v-if="item.reference?.year" class="shrink-0 rounded-full bg-portal-mint px-3 py-1 text-sm font-medium text-portal-text">
              {{ item.reference.year }}
            </span>
          </div>
          <dl class="mt-3 grid gap-x-6 gap-y-2 border-t border-portal-border pt-3 text-sm sm:grid-cols-2">
            <div
              v-for="field in referenceFields(item)"
              :key="field.label"
              class="min-w-0"
            >
              <dt class="text-xs text-portal-muted">
                {{ field.label }}
              </dt>
              <dd class="m-0 whitespace-pre-line wrap-anywhere text-portal-text">
                {{ field.value }}
              </dd>
            </div>
            <div v-if="webLink(item.reference?.url)">
              <dt class="text-xs text-portal-muted">
                {{ t('portal.specimenDetail.referenceWebsite') }}
              </dt>
              <dd class="m-0 wrap-anywhere">
                <ULink
                  :to="webLink(item.reference?.url)"
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-portal-link underline underline-offset-2"
                >
                  {{ item.reference?.url }}
                </ULink>
              </dd>
            </div>
            <div v-if="item.reference?.doi">
              <dt class="text-xs text-portal-muted">
                DOI
              </dt>
              <dd class="m-0">
                <BaseLinkExternal @click="$openWindow(`https://doi.org/${item.reference.doi}`)">
                  {{ item.reference.doi }}
                </BaseLinkExternal>
              </dd>
            </div>
            <div v-if="webLink(item.reference?.pdf)">
              <dt class="text-xs text-portal-muted">
                PDF
              </dt>
              <dd class="m-0">
                <a
                  :href="webLink(item.reference?.pdf)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-portal-link underline"
                >{{ t('portal.specimenDetail.openFullText') }}</a>
              </dd>
            </div>
          </dl>
        </li>
      </ul>
    </UCard>

    <UCard
      v-if="otherFiles.length"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ t('portal.specimenDetail.relatedFiles') }}
      </h2>
      <ul class="m-0 list-none divide-y divide-portal-border px-5">
        <li
          v-for="file in otherFiles"
          :key="file.id"
          class="py-4"
        >
          <ULink :to="localePath({ name: 'file-id', params: { id: file.id } })" class="font-semibold wrap-anywhere text-portal-link underline underline-offset-2">
            {{ fileLabel(file) }}
          </ULink>
          <dl class="m-0 mt-2 grid gap-3 text-sm sm:grid-cols-2">
            <div
              v-for="field in fileFields(file)"
              :key="field.label"
              class="min-w-0"
            >
              <dt class="text-xs text-portal-muted">
                {{ field.label }}
              </dt>
              <dd class="m-0 whitespace-pre-line wrap-anywhere text-portal-text">
                {{ field.value }}
              </dd>
            </div>
          </dl>
        </li>
      </ul>
    </UCard>

    <UCard
      v-for="section in linkedRecordSections"
      :key="section.heading"
      as="section"
      :ui="specimenCardUi"
      class="mt-8"
    >
      <h2 class="m-0 border-b border-portal-border px-5 py-4 text-[18px] font-semibold text-portal-heading">
        {{ section.heading }}
      </h2>
      <ul class="m-0 list-none divide-y divide-portal-border px-5">
        <li
          v-for="record in section.records"
          :key="record.id"
          class="py-3 text-sm"
        >
          <ULink :to="record.to" class="font-semibold text-portal-link underline underline-offset-2">
            {{ record.label }}
          </ULink>
          <p v-if="record.details" class="my-1 text-portal-muted">
            {{ record.details }}
          </p>
        </li>
      </ul>
    </UCard>

    <UCard
      v-if="coordinateRecords.length || coordinateStatus === 'pending' || coordinateError"
      as="section"
      class="mt-8 overflow-hidden rounded-portal-card border border-portal-border bg-white shadow-sm"
      :ui="{ body: 'p-0' }"
    >
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-portal-border bg-portal-mint/60 px-5 py-4 sm:px-6">
        <div>
          <p class="mb-1 text-[11px] font-semibold tracking-[0.12em] text-portal-muted uppercase">
            {{ t('portal.specimenDetail.sameLocalityCoordinates') }}
          </p>
          <h2 class="m-0 text-[19px] font-semibold tracking-[-0.015em] text-portal-heading">
            {{ t('portal.specimenDetail.otherSpecimenRecords') }}
          </h2>
        </div>
        <span class="inline-flex items-center rounded-full bg-portal-subtle px-3 py-1.5 text-xs font-medium tabular-nums text-portal-muted">{{ coordinateRecordCount.toLocaleString(locale) }} {{ t('portal.common.records') }}</span>
      </div>
      <p
        v-if="coordinateStatus === 'pending'"
        class="m-0 p-5 text-sm text-portal-muted"
        role="status"
      >
        {{ t('portal.specimenDetail.loadingNearbyRecords') }}
      </p>
      <p
        v-else-if="coordinateError"
        class="m-0 p-5 text-sm text-portal-error"
        role="alert"
      >
        {{ t('portal.specimenDetail.couldNotLoadRelatedSpecimenRecords') }}
      </p>
      <ul v-else class="m-0 grid max-h-110 grid-cols-1 gap-2 overflow-y-auto p-3 sm:grid-cols-2">
        <li
          v-for="record in coordinateRecords"
          :key="record.id"
          class="flex min-w-0 items-center gap-3 rounded-portal-control border border-portal-border px-3 py-2 transition-colors hover:border-portal-border-hover hover:bg-portal-selected"
        >
          <div class="min-w-0 flex-1">
            <ULink :to="localePath({ name: 'specimen-id', params: { id: record.id } })" class="text-sm font-semibold text-portal-link underline underline-offset-2 hover:text-portal-primary">
              {{ record.specimen_full_name }}
            </ULink>
          </div>
          <UButton
            v-if="record.preview"
            type="button"
            color="neutral"
            variant="ghost"
            square
            class="h-12! w-12! shrink-0 overflow-hidden rounded-portal-card! border border-portal-border bg-portal-subtle p-0! transition-colors hover:border-portal-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-portal-focus"
            :aria-label="t('portal.specimenDetail.openRecordPhoto', { recordName: record.specimen_full_name })"
            @click="openImagePreview(record.preview, record.specimen_full_name)"
          >
            <NuxtImg
              :src="record.preview.filename"
              provider="geocollections"
              alt=""
              width="96"
              height="96"
              fit="cover"
              class="size-full object-cover"
            />
          </UButton>
        </li>
      </ul>
      <div v-if="coordinatePageCount > 1" class="flex flex-wrap items-center justify-between gap-3 border-t border-portal-border px-4 py-3 sm:px-5">
        <span class="text-xs tabular-nums text-portal-muted">{{ t('portal.specimenDetail.coordinateRange', { from: coordinateFrom, to: coordinateTo, count: coordinateRecordCount.toLocaleString(locale) }) }}</span>
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="coordinatePage <= 1 || coordinateStatus === 'pending'"
            :aria-label="t('portal.specimenDetail.previousPageOfRelatedRecords')"
            @click="setCoordinatePage(coordinatePage - 1)"
          >
            {{ t('portal.common.previous') }}
          </UButton>
          <span class="min-w-14 text-center text-xs tabular-nums text-portal-muted">{{ coordinatePage }} / {{ coordinatePageCount }}</span>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="coordinatePage >= coordinatePageCount || coordinateStatus === 'pending'"
            :aria-label="t('portal.specimenDetail.nextPageOfRelatedRecords')"
            @click="setCoordinatePage(coordinatePage + 1)"
          >
            {{ t('portal.common.next') }}
          </UButton>
        </div>
      </div>
      <p v-else-if="coordinateRecordCount > 0" class="m-0 border-t border-portal-border px-5 py-3 text-xs leading-normal text-portal-muted">
        {{ t('portal.specimenDetail.coordinateRangeSummary', { from: coordinateFrom, to: coordinateTo, count: coordinateRecordCount.toLocaleString(locale) }) }}
      </p>
    </UCard>
    <PortalPhotoViewer
      v-if="imagePreviewOpen && previewImages.length"
      v-model="imagePreviewOpen"
      :images="previewImages"
      :total="1"
      :large-preview="true"
    >
      <template #info="{ item }">
        <p class="m-0 font-medium text-portal-heading">
          {{ item.info.title }}
        </p>
        <p v-if="item.info.author" class="m-0 text-sm text-portal-muted">
          {{ t('portal.specimenDetail.photographer') }}: {{ item.info.author }}
        </p>
        <p v-if="item.info.date" class="m-0 text-sm text-portal-muted">
          {{ t('portal.specimenDetail.date') }}: {{ item.info.date }}
        </p>
      </template>
    </PortalPhotoViewer>
  </div>
</template>
