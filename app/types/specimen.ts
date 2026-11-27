interface NamedRecord {
  id: number;
  name: Nullable<string>;
  name_en: Nullable<string>;
}

interface NumberedRecord {
  id: number;
  number: Nullable<string>;
}

export interface CatalogueValue {
  value: Nullable<string>;
  value_en: Nullable<string>;
}

export interface SpecimenAgent {
  name?: Nullable<string>;
  forename?: Nullable<string>;
  surname?: Nullable<string>;
}

export interface Specimen {
  id: number;
  number: Nullable<string>;
  old_number: Nullable<string>;
  number_field: Nullable<string>;
  collection: Nullable<NumberedRecord & NamedRecord>;
  type: Nullable<CatalogueValue>;
  subtype: Nullable<CatalogueValue>;
  fossil: Nullable<CatalogueValue>;
  kind: Nullable<CatalogueValue>;
  classification: Nullable<NamedRecord>;
  part: Nullable<string>;
  number_pieces: Nullable<number>;
  locality: Nullable<NamedRecord & {
    longitude: Nullable<number>;
    latitude: Nullable<number>;
    country: Nullable<NamedRecord & { iso_3166_1_alpha_2: string }>;
  }>;
  locality_text: Nullable<string>;
  locality_is_private: boolean;
  depth: Nullable<number>;
  depth_interval: Nullable<number>;
  sample_number: Nullable<string>;
  sample: Nullable<NumberedRecord>;
  parent: Nullable<NumberedRecord>;
  database: Nullable<NamedRecord & { acronym: string; url: Nullable<string> }>;
  remarks_collecting: Nullable<string>;
  stratigraphy: Nullable<NamedRecord>;
  lithostratigraphy: Nullable<NamedRecord>;
  stratigraphy_text: Nullable<string>;
  collector: Nullable<SpecimenAgent>;
  collector_text: Nullable<string>;
  date_collected: Nullable<string>;
  date_collected_text: Nullable<string>;
  remarks: Nullable<string>;
  tags: Nullable<string>;
  presence: Nullable<CatalogueValue>;
  status: Nullable<CatalogueValue>;
  original_status: Nullable<CatalogueValue>;
  accession: Nullable<NumberedRecord>;
  deaccession: Nullable<NumberedRecord>;
  date_added: Nullable<string>;
  date_changed: Nullable<string>;
}

export interface SpecimenIndexEntry {
  specimen_full_name?: string;
  taxon?: string;
  taxon_full?: string;
  taxon_id?: number;
  fossilgroup?: string;
  rock?: string;
  rock_en?: string;
  rock_txt?: string[];
  rock_id?: number;
}

export interface SpecimenFile {
  id: number | string;
  filename?: Nullable<string>;
  original_filename?: Nullable<string>;
  title?: Nullable<string>;
  title_en?: Nullable<string>;
  description?: Nullable<string>;
  description_en?: Nullable<string>;
  agent?: Nullable<string>;
  author_free?: Nullable<string>;
  date_created?: Nullable<string>;
  date_created_free?: Nullable<string>;
  image_number?: Nullable<string>;
  image_width?: Nullable<number>;
  image_height?: Nullable<number>;
  image_scalebar?: Nullable<number | string>;
  device_txt?: Nullable<string>;
  licence?: Nullable<string>;
  format_value?: Nullable<string>;
  size_mb?: Nullable<number>;
  remarks?: Nullable<string>;
  specimen_image_attachment?: Nullable<number>;
}

export type SpecimenPhoto = SpecimenFile & { filename: string };

export interface SpecimenAttachmentLink {
  remarks?: Nullable<string>;
  attachment: Nullable<Omit<SpecimenFile, "licence"> & {
    author?: Nullable<SpecimenAgent>;
    author_text?: Nullable<string>;
    date_created_text?: Nullable<string>;
    device_text?: Nullable<string>;
    licence?: Nullable<{ name: string; name_en?: Nullable<string> }>;
    mime_type?: Nullable<{ content_type: string }>;
  }>;
}

export interface SpecimenTaxon {
  id: number;
  taxon: Nullable<{ id: number; name: string; full_name: Nullable<string> }>;
  name: Nullable<string>;
  agent: Nullable<SpecimenAgent>;
  date_identified: Nullable<string>;
  date_identified_free?: Nullable<string>;
  reference: Nullable<SpecimenPublication>;
  identification_type: Nullable<CatalogueValue>;
  is_current: Nullable<boolean>;
  remarks?: Nullable<string>;
}

export interface SpecimenRock {
  id: number;
  rock: Nullable<NamedRecord>;
  name: Nullable<string>;
  name_en: Nullable<string>;
  agent: Nullable<SpecimenAgent>;
  date_identified: Nullable<string>;
  date_identified_free?: Nullable<string>;
  reference: Nullable<SpecimenPublication>;
  type: Nullable<CatalogueValue>;
  is_current: Nullable<boolean>;
  remarks: Nullable<string>;
}

export interface SpecimenPublication {
  id: number;
  reference: Nullable<string>;
  title: Nullable<string>;
  title_original: Nullable<string>;
  title_translated: Nullable<string>;
  author: Nullable<string>;
  author_original: Nullable<string>;
  year: Nullable<number>;
  journal: Nullable<{ name: string }> | number;
  journal_text: Nullable<string>;
  journal_additional: Nullable<string>;
  book: Nullable<string>;
  book_original: Nullable<string>;
  book_translated: Nullable<string>;
  book_editor: Nullable<string>;
  publisher: Nullable<string>;
  publisher_place: Nullable<string>;
  volume: Nullable<string>;
  number: Nullable<string>;
  issue?: Nullable<string>;
  pages: Nullable<string>;
  figures: Nullable<string>;
  doi: Nullable<string>;
  isbn: Nullable<string>;
  issn: Nullable<string>;
  abstract: Nullable<string>;
  author_keywords: Nullable<string>;
  location_text: Nullable<string>;
  url: Nullable<string>;
  pdf?: Nullable<string>;
}

export interface SpecimenReference {
  id: number;
  reference: Nullable<SpecimenPublication>;
  pages: Nullable<string>;
  figures: Nullable<string>;
  remarks: Nullable<string>;
}

export interface SpecimenChild extends NumberedRecord {
  database?: Nullable<{ acronym: string }>;
}

export interface SpecimenAnalysis {
  id: number;
  analysis_method: Nullable<NamedRecord>;
  analyst: Nullable<SpecimenAgent>;
}
