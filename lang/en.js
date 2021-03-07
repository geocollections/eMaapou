export default {
  title: 'e·Maapõu',
  subtitle: 'Opening up geological data in Estonia',
  landing: {
    searchTitle: 'Quick search',
    drillcores: 'Drillcores ({number})',
    localities: 'Localities ({number})',
    sites: 'Sites ({number})',
    samples: 'Samples ({number})',
    analyses: 'Analyses ({number})',
    preparations: 'Preparations ({number})',
    visit_site: 'View',
    title: 'Geological data and e-services',
  },
  common: {
    general: 'General info',
    pictures: 'Pictures',
    noValue: '',
    home: 'e·Maapõu',
    previous: 'Previous',
    next: 'Next',
    links: 'Links',
    search: 'Search',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    original: 'Original',
    linkToEdit: 'Edit record',
    drillcore: 'Drillcore',
    drillcores: 'Drillcores',
    locality: 'Locality',
    localities: 'Localities',
    sample: 'Sample',
    samples: 'Samples',
    analysis: 'Analysis',
    analyses: 'Analyses',
    about: 'About',
  },
  link: {
    sarvAPI: 'Public API',
    github: 'GitHub',
    fossils: 'Fossils',
    sarvDOI: 'Research data (DOI)',
    eurocore: 'EUROCORE data portal',
    chitinozoa: 'Baltic chitinozoans',
    turvas: 'Peat studies database',
    geokirjandus: 'Geological Literature',
    geokogud: 'Geocollections portal',
  },
  locality: {
    pageTitle: 'Localities search',
    id: 'ID',
    locality: 'Locality',
    country: 'Country',
    countryFormat: '{name} ({iso})',
    latitude: 'Latitude',
    longitude: 'Longitude',
    depth: 'Depth',
    elevation: 'Elevation',
    coordx: 'X (m)',
    coordy: 'Y (m)',
    epsg: 'EPSG',
    name: 'Name',
    type: 'Type',
    parish: 'Parish',
    settlement: 'Settlement',
    coordinateMethod: 'Coord. method',
    coordinateAgent: 'Coord. agent',
    locationRemarks: 'Location remarks',
    stratigraphyTop: 'Strat. top',
    stratigraphyBase: 'Strat. base',
    remarks: 'Remarks',
    map: 'Map',
    synonyms: 'Synonyms ({number})',
    specimens: 'Specimens ({number})',
    references: 'References ({number})',
    attachments: 'Attachments ({number})',
    samples: 'Samples ({number})',
    stratotypes: 'Stratotypes ({number})',
    coordinateSystem: 'Coordinate system',
    coordinateX: 'X',
    coordinateY: 'Y',
    coordinatePrecision: 'Coordinate precision',
    descriptions: 'Descriptions ({number})',
    drillcore: 'Drillcore',
    drillcoreBoxes: 'Boxes ({number})',
  },
  localitySynonym: {
    synonym: 'Synonym',
    pages: 'Pages',
    reference: 'Reference',
    remarks: 'Remarks',
  },
  drillcore: {
    pageTitle: 'Drillcores search',
    id: 'ID',
    name: 'Name',
    boxes: 'Boxes',
    depository: 'Depository',
    remarks: 'Remarks',
    storage: 'Storage',
    driller: 'Driller',
    year: 'Drilling year',
    metersInBox: 'Meters in box',
    boxNumbers: 'Box numbers',
    drillcoreBoxesTitle: 'Boxes ({number})',
    localityDescriptions: 'Descriptions ({number})',
    localityReferences: 'References ({number})',
    attachments: 'Attachments ({number})',
    samples: 'Samples ({number})',
    analyses: 'Analyses ({number})',
    specimens: 'Specimens ({number})',
    depth: 'Depth',
    acronym: 'Owner',
  },
  drillcoreBox: {
    id: 'ID',
    drillcore: 'Drillcore',
    nr: 'Box nr. {number}',
    depthStart: 'Start (m)',
    depthEnd: 'End (m)',
    depthOther: 'Depth info',
    stratigraphyBaseFree: 'Strat. base text',
    stratigraphyTopFree: 'Strat. top text',
    stratigraphyTop: 'Strat. top',
    stratigraphyBase: 'Strat. base',
    remarks: 'Remarks',
    diameter: 'Diameter',
    author: 'Image author',
    date: 'Image date',
  },
  localityDescription: {
    stratigraphy: 'Stratigraphy',
    depthBase: 'To (m)',
    depthTop: 'From (m)',
    thickness: 'Thickness (m)',
    rock: 'Rock',
    description: 'Description',
    author: 'Author',
  },
  localityReference: {
    reference: 'Reference',
    remarks: 'Remarks',
    pages: 'Pages',
    referenceTitle: 'Pealkiri',
  },
  sampleReference: {
    reference: 'Reference',
    remarks: 'Remarks',
    pages: 'Pages',
    referenceTitle: 'Pealkiri',
  },
  attachment: {
    author: 'Author',
    description: 'Description',
    file: 'File',
  },
  analysis: {
    pageTitle: 'Analysis search',
    id: 'ID',
    sampleNumber: 'Sample number',
    depth: 'Depth',
    depthInterval: 'Depth to',
    method: 'Method',
    methodDetails: 'Method details',
    analysedBy: 'Person/Institution',
    date: 'Date',
    thickness: 'Thickness',
    title: 'Analysis ID: {id}',
    remarks: 'Remarks',
    reference: 'Reference',
    dataset: 'Dataset',
    locality: 'Locality',
    stratigraphy: 'Stratigraphy',
    stratigraphyAndLithostratigraphy: 'Stratigraphy | Lithostratigraphy',
    lab: 'Lab',
    lithostratigraphy: 'Lithostratigraphy',
    results: 'Results ({number})',
    attachments: 'Attachments ({number})',
  },
  analysisResult: {
    parameter: 'Parameter',
    value: 'Value',
    valueText: 'Text',
    valueError: 'Error',
  },
  specimen: {
    id: 'ID',
    number: 'Number',
    depth: 'Depth',
    depthInterval: 'Depth to',
    fossilGroup: 'Fossil group',
    kind: 'Type',
    stratigraphy: 'Stratigraphy',
    taxon: 'Taxon',
    thickness: 'Thickness',
    image: 'Image',
  },
  stratotype: {
    stratigraphy: 'Stratigraphy',
    type: 'Type',
    depthTop: 'From (m)',
    depthBase: 'To (m)',
    reference: 'Reference',
    remarks: 'Remarks',
  },
  area: {
    id: 'ID',
    name: 'Name',
    areaType: 'Area type',
    maakond: 'Country',
    areaHa: 'Area (ha)',
    depositAreaHa: 'Deposit (ha)',
    description: 'Description',
    egf: 'EGF',
    maardla: 'Deposit (reference to the register)',
    eelis: 'Nature protection (reference to the register)',
    text1: 'Peat area plaan',
    maardlaLink: 'Deposit information in the Estonian Land Board',
    sites: 'Sites ({number})',
    localityReferences: 'References ({number})',
  },
  site: {
    id: 'ID',
    name: 'Name',
    area: 'Area',
    areaText1: 'Peat area plan',
    coordx: 'X (L-EST, m)',
    coordy: 'Y (L-EST, m)',
    elevation: 'Z (m)',
    depth: 'Depth / thickness (m)',
    description: 'Description',
    elevationAccuracy: 'Elevation accuracy',
    locality: 'Location',
    attachments: 'Attachments ({number})',
    samples: 'Samples ({number})',
    localityDescriptions: 'Descriptions ({number})',
    localityReferences: 'References ({number})',
    project: 'Project',
    latitude: 'Latitude',
    longitude: 'Longitude',
  },
  sample: {
    pageTitle: 'Samples search',
    id: 'ID',
    name: 'Name',
    area: 'Area',
    areaText1: 'Peat area plan',
    coordx: 'X (L-EST, m)',
    coordy: 'Y (L-EST, m)',
    elevation: 'Z (m)',
    depth: 'Depth / thickness (m)',
    description: 'Description',
    elevationAccuracy: 'Elevation accuracy',
    locality: 'Locality',
    number: 'Sample No.',
    depthInterval: 'Depth to',
    stratigraphy: 'Stratigraphy',
    collector: 'Collector',
    dateCollected: 'Date collected',
    thickness: 'Thickness',
    palaeontology: 'Palaeontology',
    owner: 'Owner',
    database: 'Institution',
    numberAdditional: 'Old number',
    numberField: 'Field number',
    lithostratigraphy: 'Lithostratigraphy',
    stratigraphyFree: 'Stratigraphy free',
    stratigraphyBed: 'Bed',
    agentCollected: 'Collector',
    mass: 'Weight',
    samplePurpose: 'Sample purpose',
    rock: 'Rock',
    classificationRock: 'Material',
    fossils: 'Fauna',
    remarks: 'Remarks',
    localityFree: 'Locality free',
    attachments: 'Attachments ({number})',
    analyses: 'Analyses ({number})',
    preparations: 'Preparations ({number})',
    taxa: 'Taxa ({number})',
    sampleReferences: 'References ({number})',
  },
  preparation: {
    id: 'ID',
    preparation_number: 'Prep. number',
    locality: 'Locality',
    depth: 'Depth',
    stratigraphy: 'Stratigraphy | Lithostratigraphy',
    agent: 'Coll.',
    mass: 'Weight',
    taxon: 'Fossil group',
    storage: 'Storage',
    remarks: 'Remarks',
  },
  taxon: {
    id: 'ID',
    taxon: 'Taxon',
    name: 'Taxon, txt',
    frequency: 'Abundande',
    agent_identified: 'Det.',
    date_identified: 'Det. date',
    extra: 'Extra',
    remarks: 'Remarks',
  },
  infinite: {
    noMore: '',
    error: '',
    retry: 'Retry',
  },
  gestureHandling: {
    touch: 'Use two fingers to move the map',
    scroll: 'Use ctrl + scroll to zoom the map',
    scrollMac: 'Use \u2318 + scroll to zoom the map',
  },
  table: {
    itemsPerPage: 'Rows per page:',
    noData: 'No data found',
  },
  footerPreliminary: '2021 | e·Maapõu',
  footer:
    'All materials in the portal are mostly for free usage according to {0} licence, unless indicated otherwise. Portal is part of {1} national research infrastructure and geoscience data platform {2}, hosted by {3} cloud. Built using {4}, source code available on {5}.',
  footerLinks: {
    sarv: 'Geoscience Database SARV',
    natarc: 'Natural history archives and information network“ (NATARC)',
    ttu: 'Tallinn University of Technology',
    tu: 'University of Tartu',
    elm: 'Estonian Museum of Natural History',
    el: 'European Union',
  },
  geocollections: {
    title: ' Geocollections',
    description: 'Geoscience Collections Portal',
  },
  kirjandus: {
    title: 'Geoscience Literature',
    description: 'Estonian Geoscience Literature Database',
  },
  gmre: {
    title: 'Geology of Estonia',
    description: 'Book',
  },
  fond: {
    title: 'Geoloogiafond',
    description: 'Geological Reports',
  },
  fossiilid: {
    title: 'Baltoscandian Fossils',
    description: 'Baltoscandian Fossils',
  },
  kivid: {
    title: 'Minerals and Rocks',
    description: 'Minerals and Rocks',
  },
  stratigraphy: {
    title: 'Stratigraphy and time scale',
    description: 'Estonian Commission on Stratigraphy',
  },
  maardlad: {
    title: 'Mineral Deposits',
    description: 'Environmental Register',
  },
  turba: {
    title: 'TURBA',
    description: 'Estonian Peat Database',
  },
  doi: {
    title: 'SARV-DOI',
    description: 'Geoscience Data Repository',
  },
  geocase: {
    title: 'GeoCASe',
    description: 'The Earth Science Collections Network',
  },
  eurocore: {
    title: 'EUROCORE',
    description: 'European Drillcore Database for MSc Training',
  },
  sarv: {
    title: 'SARV-WB',
    description: 'SARV Workbench',
  },
  ema: {
    title: 'e·Maapõu',
    description: 'Quick search from the Geoscience Data Platform SARV',
  },
  search: {
    pageTitle: 'Search',
  },
  about: {
    pageTitle: 'About',
    title: 'What is e·Maapõu?',
  },
}
