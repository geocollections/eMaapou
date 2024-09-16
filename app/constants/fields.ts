export const FIELDS_SOLR_ANALYSIS = [
  "id",
  "id_l",
  "sample_id",
  "sample_name",
  "sample_number",
  "locality_id",
  "locality",
  "locality_en",
  "depth",
  "depth_interval",
  "analysis_method",
  "analysis_method_en",
  "method_details",
  "method_details_en",
  "agent",
  "date",
  "date_free",
];

export const FIELDS_SOLR_ANALYTICAL_DATA = [
  "id",
  "analysis_id_l",
  "analysis_id",
  "analysis_method",
  "analysis_methos_en",
  "sample_id",
  "sample_id_l",
  "sample_number",
  "locality_id",
  "locality",
  "locality_en",
  "site_id",
  "site",
  "stratigraphy_id",
  "stratigraphy",
  "stratigraphy_en",
  "stratigraphy_id_sl",
  "lithostratigraphy_id",
  "lithostratigraphy",
  "lithostratigraphy_en",
  "lithostratigraphy_id_sl",
  "depth",
  "depth_interval",
  "rock",
  "rock_en",
  "rock_txt",
  "rock_en_txt",
  "reference_id",
  "reference",
  "reference_str",
  "dataset_name",
].join(",");

export const FIELDS_SOLR_AREA = [
  "id",
  "id_l",
  "name",
  "name_en",
  "maakond",
  "maakond_en",
  "area_type",
  "area_type_en",
  "area_ha",
  "kaevandaja",
  "loa_number",
  "loa_omanik",
].join(",");

export const FIELDS_SOLR_DATASET = [
  "dataset_id",
  "id",
  "id_l",
  "name",
  "name_en",
  "title",
  "database_acronym",
  "date",
  "date_txt",
].join(",");

export const FIELDS_SOLR_DRILLCORE = [
  "id",
  "id_l",
  "drillcore",
  "drillcore_en",
  "depth",
  "boxes",
  "box_numbers",
  "year",
  "core_repository",
  "core_repository_en",
  "acronym",
].join(",");

export const FIELDS_SOLR_LOCALITY = [
  "id",
  "id_l",
  "latitude",
  "longitude",
  "locality",
  "locality_en",
  "country",
  "country_en",
  "related_references",
  "related_specimens",
  "related_samples",
  "related_analyses",
  "related_drillcores",
  "related_files",
  "related_images",
  "related_stratotypes",
  "related_taxon_occurrences",
].join(",");

export const FIELDS_SOLR_PHOTO = [
  "id",
  "id_l",
  "image_number",
  "agent",
  "author_free",
  "date_created_dt",
  "date_created_free",
  "locality_id",
  "locality",
  "locality_en",
  "image_object",
  "tags",
  "filename",
  "uuid_filename",
].join(",");

export const FIELDS_SOLR_PREPARATION = [
  "id",
  "id_l",
  "preparation_number",
  "locality_id",
  "locality",
  "locality_en",
  "depth",
  "depth_interval",
  "stratigraphy_id",
  "stratigraphy",
  "stratigraphy_en",
  "lithostratigraphy_id",
  "lithostratigraphy",
  "lithostratigraphy_en",
  "agent",
  "mass",
  "image",
  "image_count",
].join(",");

export const FIELDS_SOLR_SITE = [
  "id",
  "id_l",
  "name",
  "name_en",
  "area_name",
  "area_name_en",
  "latitude",
  "longitude",
  "z",
  "depth",
].join(",");

export const FIELDS_SOLR_SAMPLE = [
  "id",
  "id_l",
  "number",
  "locality_id",
  "locality",
  "locality_en",
  "site_id",
  "site_name",
  "site_name_en",
  "depth",
  "depth_interval",
  "stratigraphy_id",
  "stratigraphy",
  "stratigraphy_en",
  "lithostratigraphy_id",
  "lithostratigraphy",
  "lithostratigraphy_en",
  "collector",
  "date_collected",
  "image",
  "image_count",
].join(",");

export const FIELDS_SOLR_SPECIMEN = [
  "id",
  "id_l",
  "specimen_full_name",
  "specimen_number_old",
  "original_status",
  "original_status_en",
  "locality_id",
  "locality",
  "locality_en",
  "depth",
  "depth_interval",
  "stratigraphy_id",
  "stratigraphy",
  "stratigraphy_en",
  "lithostratigraphy_id",
  "lithostratigraphy",
  "lithostratigraphy_en",
  "taxon_id",
  "taxon",
  "rock_id",
  "rock",
  "rock_en",
  "collector",
  "image",
  "image_count",
  "specimen_kind",
  "specimen_kind_en",
].join(",");

export const FIELDS_SOLR_STRATIGRAPHY = [
  "id",
  "id_l",
  "stratigraphy",
  "stratigraphy_en",
  "index_main",
  "index_main_html",
  "index_additional",
  "index_additional_html",
  "stratigraphy_type",
  "stratigraphy_type_en",
  "stratigraphy_rank",
  "stratigraphy_rank_en",
  "stratigraphy_scope",
  "stratigraphy_scope_en",
  "parent_id",
  "parent_stratigraphy",
  "parent_stratigraphy_en",
  "age_base",
  "age_top",
  "age_stratigraphy",
  "age_stratigraphy_en",
].join(",");

export const FIELDS_SOLR_TAXON = [
  "id",
  "id_l",
  "taxon",
  "author_year",
  "parent_id",
  "parent_taxon",
  "fossil_group_id",
  "fossil_group",
  "locality_id",
  "locality",
  "locality_en",
  "stratigraphy_base",
  "fad_stratigraphy",
  "fad_stratigraphy_en",
  "stratigraphy_top",
  "lad_stratigraphy",
  "lad_stratigraphy_en",
  "in_estonia",
  "is_fossil",
  "is_valid",
].join(",");