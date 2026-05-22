import type { SeedSourceRecord } from "../overture/places-starter-records.js";

export const OPENSTREETMAP_LICENSE = "ODbL-1.0";
export const OPENSTREETMAP_ATTRIBUTION_TEXT =
  "OpenStreetMap contributors, queried through Overpass API on 2026-05-22 (ODbL-1.0)";

export const WINSSTRASSE_EARLYBIRD_ANCHOR = {
  "sourceName": "osm",
  "sourceRecordKey": "node/5886792723",
  "name": "Early Bird",
  "latitude": 52.5320168,
  "longitude": 13.4233618,
  "addressLine1": "Winsstraße 68",
  "locality": "Berlin",
  "region": "Berlin",
  "postalCode": "10405",
  "countryCode": "DE"
} as const;

export const WINSSTRASSE_STARTER_MANIFEST = {
  "source": "OpenStreetMap via Overpass API",
  "license": "ODbL-1.0",
  "attributionText": "OpenStreetMap contributors, queried through Overpass API on 2026-05-22 (ODbL-1.0)",
  "anchor": {
    "sourceName": "osm",
    "sourceRecordKey": "node/5886792723",
    "name": "Early Bird",
    "latitude": 52.5320168,
    "longitude": 13.4233618,
    "addressLine1": "Winsstraße 68",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE"
  },
  "selection": {
    "totalRecords": 100,
    "radiusMeters": 1000,
    "maxDistanceMeters": 589.6,
    "categoryCounts": {
      "bakery": 7,
      "bar": 7,
      "beauty": 3,
      "bookstore": 5,
      "cafe": 14,
      "clothing_store": 5,
      "convenience": 6,
      "hairdresser": 3,
      "ice_cream": 3,
      "pharmacy": 5,
      "pub": 5,
      "restaurant": 13,
      "retail": 5,
      "service": 5,
      "specialty_food": 8,
      "supermarket": 6
    },
    "query": "Overpass nwr named amenity/shop/craft/office POIs around node/5886792723 within 1000 m; deterministic nearest-by-category quotas."
  },
  "shareAlike": "OpenStreetMap data is available under the Open Database License; derived database fixtures should preserve ODbL attribution and share-alike obligations."
} as const;

export const WINSSTRASSE_STARTER_FIXTURE = [
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1928857792",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Kaffe",
    "displayName": "Kaffe",
    "addressLine1": "Immanuelkirchstraße 6",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.532701,
    "longitude": 13.4232129,
    "geohash": "u33dc7q3pt0",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1928857792",
        "elementType": "node",
        "elementId": 1928857792,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 76.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "6",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "check_date:opening_hours": "2025-01-25",
          "contact:phone": "+49 30 68321390",
          "contact:website": "http://www.kaffe-kaffe.de/",
          "indoor_seating": "yes",
          "internet_access": "wlan",
          "name": "Kaffe",
          "opening_hours": "Mo-Fr 07:30-19:00; Sa-Su 09:00-19:00",
          "outdoor_seating": "yes",
          "smoking": "no",
          "smoking:outside": "yes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964250492",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Café Blaumond",
    "displayName": "Café Blaumond",
    "addressLine1": "Immanuelkirchstraße 3",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5329206,
    "longitude": 13.4225919,
    "geohash": "u33dc7q43n1",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964250492",
        "elementType": "node",
        "elementId": 1964250492,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 113.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "3",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "check_date": "2026-04-12",
          "check_date:diet:vegan": "2025-09-26",
          "check_date:diet:vegetarian": "2025-09-26",
          "check_date:opening_hours": "2025-09-26",
          "contact:email": "bonjour@cafe-blaumond.de",
          "contact:website": "http://www.cafe-blaumond.de/",
          "diet:vegan": "no",
          "diet:vegetarian": "yes",
          "indoor_seating": "yes",
          "level": "0",
          "name": "Café Blaumond",
          "opening_hours": "Mo-Fr 08:30-18:00; Sa 12:00-18:00",
          "outdoor_seating": "yes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964235517",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Godshot",
    "displayName": "Godshot",
    "addressLine1": "Immanuelkirchstraße 32",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5330809,
    "longitude": 13.4228978,
    "geohash": "u33dc7q72hn",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964235517",
        "elementType": "node",
        "elementId": 1964235517,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 122.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "32",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "amenity": "cafe",
          "cuisine": "coffee_shop",
          "drink:espresso": "served",
          "drink:filter_coffee": "served",
          "indoor_seating": "yes",
          "name": "Godshot",
          "opening_hours": "Mo-Fr 09:00-17:00; Sa 09:30-17:00; Su 09:30-17:00; PH off",
          "outdoor_seating": "yes",
          "toilets:wheelchair": "no",
          "website": "https://www.godshot.de/",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10103287168",
    "sourceCategory": "cafe",
    "canonicalNameHint": "La Bohème",
    "displayName": "La Bohème",
    "addressLine1": "Winsstraße 12",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328944,
    "longitude": 13.4246738,
    "geohash": "u33dc7rd396",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10103287168",
        "elementType": "node",
        "elementId": 10103287168,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 131.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "12",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "amenity": "cafe",
          "check_date": "2025-01-20",
          "check_date:opening_hours": "2025-01-20",
          "description": "Der Treffpunkt aller Generationen",
          "email": "leitung@pib-berlin.de",
          "indoor_seating": "yes",
          "name": "La Bohème",
          "opening_hours": "Mo-We 14:00-18:30; Th 14:00-17:00,18:00-23:59",
          "outdoor_seating": "no",
          "phone": "+49 30 48 62 30 10",
          "toilets": "yes",
          "website": "http://pib-berlin.de/",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964235485",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Ralf's Torten Atelier",
    "displayName": "Ralf's Torten Atelier",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5331615,
    "longitude": 13.422673,
    "geohash": "u33dc7q5fgn",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964235485",
        "elementType": "node",
        "elementId": 1964235485,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 135.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "amenity": "cafe",
          "internet_access": "wlan",
          "name": "Ralf's Torten Atelier",
          "opening_hours": "Tu-Sa 10:00-18:00; Su,PH 12:00-18:00; Mo off",
          "shop": "confectionery",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10100699116",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Café Gentil",
    "displayName": "Café Gentil",
    "addressLine1": "Heinrich-Roller-Straße 27",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5316265,
    "longitude": 13.4207073,
    "geohash": "u33dc7hdvhu",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10100699116",
        "elementType": "node",
        "elementId": 10100699116,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 184.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "27",
          "addr:postcode": "10405",
          "addr:street": "Heinrich-Roller-Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "changing_table": "yes",
          "indoor_seating": "yes",
          "level": "0",
          "name": "Café Gentil",
          "opening_hours": "Tu-Su 10:00-18:00",
          "outdoor_seating": "yes",
          "smoking": "no",
          "toilets": "yes",
          "toilets:access": "customers",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/4932293921",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Luftschlößchen",
    "displayName": "Luftschlößchen",
    "addressLine1": "Winsstraße 17",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5336025,
    "longitude": 13.4252749,
    "geohash": "u33dc7ryrt6",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/4932293921",
        "elementType": "node",
        "elementId": 4932293921,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 218.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "17",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "diet:vegetarian": "yes",
          "name": "Luftschlößchen",
          "opening_hours": "Tu-Sa 10:00-18:00",
          "phone": "+49 176 56 92 46 54",
          "website": "https://www.luftschloesschen-berlin.de/",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10092355835",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Café Melon",
    "displayName": "Café Melon",
    "addressLine1": "Greifswalder Straße 228",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5295388,
    "longitude": 13.4248375,
    "geohash": "u33dc6xwtru",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10092355835",
        "elementType": "node",
        "elementId": 10092355835,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 293.1,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "228",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "check_date:opening_hours": "2024-07-10",
          "internet_access": "wlan",
          "name": "Café Melon",
          "name:ja": "カフェ・メロン",
          "opening_hours": "Mo-Fr 08:00-16:00; Sa 08:00-14:00",
          "opening_hours:signed": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/790502622",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Gardine",
    "displayName": "Gardine",
    "addressLine1": "Knaackstraße 8",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5341014,
    "longitude": 13.4201663,
    "geohash": "u33dc7s32d3",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/790502622",
        "elementType": "node",
        "elementId": 790502622,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 316.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "8",
          "addr:postcode": "10405",
          "addr:street": "Knaackstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "instagram": "https://www.instagram.com/gardineberlin/",
          "name": "Gardine",
          "opening_hours": "We-Th 09:00-17:00; Fr-Sa 09:00-22:00; Su 10:00-20:00"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/6291140254",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Town Mouse",
    "displayName": "Town Mouse",
    "addressLine1": "Marienburger Straße 5",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.534948,
    "longitude": 13.4235264,
    "geohash": "u33dc7wwqb4",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/6291140254",
        "elementType": "node",
        "elementId": 6291140254,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 326.1,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "5",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "check_date": "2025-09-24",
          "check_date:opening_hours": "2025-09-24",
          "contact:website": "https://www.townmouse.de",
          "cuisine": "coffee_shop",
          "indoor_seating": "yes",
          "name": "Town Mouse",
          "opening_hours": "Mo-Fr 08:00-18:00; Sa-Su 09:00-18:00",
          "opening_hours:signed": "no",
          "outdoor_seating": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3070901377",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Cafeteria KSES",
    "displayName": "Cafeteria KSES",
    "addressLine1": "Greifswalder Straße 16",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5302359,
    "longitude": 13.4273788,
    "geohash": "u33dcdcdb9e",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3070901377",
        "elementType": "node",
        "elementId": 3070901377,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 336.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "16",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "cafe",
          "name": "Cafeteria KSES"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/9633744539",
    "sourceCategory": "cafe",
    "canonicalNameHint": "someday in HaNoi",
    "displayName": "someday in HaNoi",
    "addressLine1": "Prenzlauer Allee 37",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5349522,
    "longitude": 13.4221493,
    "geohash": "u33dc7twq8z",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/9633744539",
        "elementType": "node",
        "elementId": 9633744539,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 336.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "37",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "amenity": "cafe",
          "description": "Bánh Mì & Café",
          "level": "0",
          "name": "someday in HaNoi",
          "old_name": "Paskal",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/5222154376",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Nonna",
    "displayName": "Nonna",
    "addressLine1": "Greifswalder Straße 229",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5290266,
    "longitude": 13.4242482,
    "geohash": "u33dc6x5z8k",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/5222154376",
        "elementType": "node",
        "elementId": 5222154376,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 337.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:floor": "0",
          "addr:housenumber": "229",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "air_conditioning": "no",
          "amenity": "cafe",
          "check_date": "2026-05-14",
          "contact:instagram": "https://www.instagram.com/nonna_cafe_berlin/",
          "cuisine": "coffee_shop;cake;czech",
          "indoor_seating": "yes",
          "internet_access": "no",
          "level": "0",
          "name": "Nonna",
          "opening_hours": "Mo,We-Su 10:00-17:00",
          "opening_hours:drive_through": "Mo,We-Su 10:00-17:00",
          "outdoor_seating": "yes",
          "payment:cash": "yes",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "source": "survey",
          "takeaway": "yes",
          "toilets": "yes",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/13831198674",
    "sourceCategory": "cafe",
    "canonicalNameHint": "Lisa Kern",
    "displayName": "Lisa Kern",
    "addressLine1": "Metzer Straße 24",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5310792,
    "longitude": 13.4183074,
    "geohash": "u33dc6fztnz",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/13831198674",
        "elementType": "node",
        "elementId": 13831198674,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "cafe",
        "distanceMetersFromAnchor": 357.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:floor": "-1",
          "addr:housenumber": "24",
          "addr:street": "Metzer Straße",
          "amenity": "cafe",
          "check_date": "2026-05-15",
          "name": "Lisa Kern",
          "opening_hours": "Mo-Fr 09:30-15:30",
          "outdoor_seating": "yes",
          "payment:cash": "yes",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/11211803376",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "IV",
    "displayName": "IV",
    "addressLine1": "Immanuelkirchstraße 7",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5324972,
    "longitude": 13.4238441,
    "geohash": "u33dc7nzypr",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/11211803376",
        "elementType": "node",
        "elementId": 11211803376,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 62.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "7",
          "addr:street": "Immanuelkirchstraße",
          "amenity": "restaurant",
          "check_date": "2025-09-25",
          "check_date:diet:vegetarian": "2025-09-25",
          "check_date:opening_hours": "2025-01-20",
          "contact:phone": "+49 30 55285900",
          "diet:vegan": "yes",
          "diet:vegetarian": "yes",
          "indoor_seating": "yes",
          "name": "IV",
          "opening_hours": "Mo-Sa 12:00-23:00; Su 12:00-23:00",
          "outdoor_seating": "yes",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1976439629",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Trattoria Foccacia Mia",
    "displayName": "Trattoria Foccacia Mia",
    "addressLine1": "Immanuelkirchstraße 29",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5327921,
    "longitude": 13.4237316,
    "geohash": "u33dc7qcew5",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1976439629",
        "elementType": "node",
        "elementId": 1976439629,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 89.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "29",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "restaurant",
          "check_date:opening_hours": "2025-01-23",
          "contact:phone": "+49 30 41471100",
          "cuisine": "italian;italian_pizza",
          "diet:vegan": "yes",
          "diet:vegetarian": "yes",
          "indoor_seating": "yes",
          "internet_access": "no",
          "name": "Trattoria Foccacia Mia",
          "opening_hours:signed": "no",
          "outdoor_seating": "sidewalk",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "website": "https://focacciamiaberlin.de/",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/6772800796",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Lovely",
    "displayName": "Lovely",
    "addressLine1": "Immanuelkirchstraße 20a",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328443,
    "longitude": 13.4235918,
    "geohash": "u33dc7qcbrg",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/6772800796",
        "elementType": "node",
        "elementId": 6772800796,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 93.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "20a",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "amenity": "restaurant",
          "check_date:opening_hours": "2025-01-25",
          "cuisine": "indian",
          "diet:vegetarian": "yes",
          "name": "Lovely",
          "opening_hours:signed": "no",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964235575",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Froindlichst",
    "displayName": "Froindlichst",
    "addressLine1": "Immanuelkirchstraße 31",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5330021,
    "longitude": 13.4231682,
    "geohash": "u33dc7q6ymr",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964235575",
        "elementType": "node",
        "elementId": 1964235575,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 110.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "31",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "restaurant",
          "breakfast": "Sa-Su 09:30-13:00",
          "check_date": "2023-09-01",
          "contact:phone": "+49 30 40056289",
          "contact:website": "https://www.froindlichst.com/berlin/",
          "diet:vegan": "only",
          "indoor_seating": "yes",
          "name": "Froindlichst",
          "opening_hours": "Mo-We 17:00-22:00; Th-Su 12:00-22:00",
          "outdoor_seating": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "reusable_packaging:offer": "yes",
          "reusable_packaging:offer:brand": "vytal",
          "toilets:wheelchair": "no",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964235524",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Chandni",
    "displayName": "Chandni",
    "addressLine1": "Immanuelkirchstraße 32",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5330328,
    "longitude": 13.4230503,
    "geohash": "u33dc7q75ep",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964235524",
        "elementType": "node",
        "elementId": 1964235524,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 114.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "32",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "amenity": "restaurant",
          "check_date:opening_hours": "2025-01-25",
          "cuisine": "indian",
          "delivery": "no",
          "diet:vegan": "yes",
          "diet:vegetarian": "yes",
          "indoor_seating": "yes",
          "name": "Chandni",
          "opening_hours": "Mo-Su 12:00-24:00",
          "opening_hours:signed": "no",
          "outdoor_seating": "yes",
          "phone": "+49 30 4406238",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/442985383",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Herr Rossi",
    "displayName": "Herr Rossi",
    "addressLine1": "Winsstraße 11",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328024,
    "longitude": 13.424598,
    "geohash": "u33dc7r3zb1",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/442985383",
        "elementType": "node",
        "elementId": 442985383,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 120.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "11",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "amenity": "restaurant",
          "check_date": "2025-06-16",
          "check_date:opening_hours": "2025-06-16",
          "cuisine": "italian",
          "email": "herrrossi@berlin.de",
          "indoor_seating": "yes",
          "level": "0",
          "name": "Herr Rossi",
          "opening_hours": "Tu-Sa 18:00-23:00",
          "opening_hours:signed": "no",
          "outdoor_seating": "yes",
          "payment:cash": "no",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "phone": "+49 30 53 06 10 77",
          "toilets:wheelchair": "no",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/12296335863",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Productos de Mi Mami",
    "displayName": "Productos de Mi Mami",
    "addressLine1": "Winsstraße 14",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.533103,
    "longitude": 13.4248529,
    "geohash": "u33dc7ret8p",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/12296335863",
        "elementType": "node",
        "elementId": 12296335863,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 157.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:floor": "0",
          "addr:housenumber": "14",
          "addr:street": "Winsstraße",
          "amenity": "restaurant",
          "check_date": "2024-11-13",
          "check_date:diet:halal": "2024-10-29",
          "check_date:diet:kosher": "2024-10-29",
          "check_date:diet:vegan": "2024-10-29",
          "contact:instagram": "https://www.instagram.com/ptosdemimami",
          "contact:whatsapp": "+4915906823432",
          "cuisine": "chicken;cafe;beef;empanada;columbian;latin_american",
          "description": "Cafe Bar Productos de Mi Mami",
          "diet:beef": "yes",
          "diet:chicken": "yes",
          "diet:dairy": "yes",
          "diet:halal": "no",
          "diet:kosher": "no",
          "diet:meat": "yes",
          "diet:non-vegetarian": "yes",
          "diet:omnivore": "yes",
          "diet:vegan": "no",
          "diet:vegetarian": "yes",
          "level": "0",
          "name": "Productos de Mi Mami",
          "opening_hours": "Mo off; Tu-Th 12:00-17:45; Fr 12:00-19:00; Sa 12:00-19:30; Su 13:30-17:30",
          "payment:cards": "no",
          "payment:cash": "yes",
          "payment:credit_cards": "no",
          "payment:debit_cards": "no",
          "website": "https://www.productosdemimami.com/",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/790502656",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "DDR Speisegaststätte Pionierlager",
    "displayName": "DDR Speisegaststätte Pionierlager",
    "addressLine1": "Prenzlauer Allee 26",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5327225,
    "longitude": 13.4208253,
    "geohash": "u33dc7k9rch",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/790502656",
        "elementType": "node",
        "elementId": 790502656,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 188.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "26",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "restaurant",
          "name": "DDR Speisegaststätte Pionierlager",
          "opening_hours": "Tu-Sa 15:00-22:00",
          "website": "https://restaurant-pila.de/",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3514719977",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Cháomin",
    "displayName": "Cháomin",
    "addressLine1": "Prenzlauer Allee 27A",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328399,
    "longitude": 13.4208968,
    "geohash": "u33dc7kccx1",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3514719977",
        "elementType": "node",
        "elementId": 3514719977,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 190.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "27A",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "restaurant",
          "contact:website": "https://chaomin.berlin/",
          "name": "Cháomin",
          "opening_hours": "Mo-Su 12:00-22:00",
          "reusable_packaging:offer": "yes",
          "reusable_packaging:offer:brand": "vytal",
          "toilets:wheelchair": "yes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/790502640",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Kong II Bao-House",
    "displayName": "Kong II Bao-House",
    "addressLine1": "Prenzlauer Allee 27A",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5329463,
    "longitude": 13.420964,
    "geohash": "u33dc7kfe4u",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/790502640",
        "elementType": "node",
        "elementId": 790502640,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 192.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "27A",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "restaurant",
          "check_date": "2025-01-25",
          "check_date:opening_hours": "2025-01-25",
          "name": "Kong II Bao-House",
          "opening_hours": "Mo-Fr 12:00-15:00,17:30-22:00; Sa,Su,PH 13:00-22:00",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10015764555",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Il Salotto",
    "displayName": "Il Salotto",
    "addressLine1": "Winsstraße 16",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5334492,
    "longitude": 13.4251508,
    "geohash": "u33dc7rvs8t",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10015764555",
        "elementType": "node",
        "elementId": 10015764555,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 200.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "16",
          "addr:street": "Winsstraße",
          "amenity": "restaurant",
          "cuisine": "italian",
          "level": "0",
          "name": "Il Salotto",
          "opening_hours": "Tu-Su 17:00-23:00+"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3160919200",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Orient Grill Haus",
    "displayName": "Orient Grill Haus",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5303277,
    "longitude": 13.4257868,
    "geohash": "u33dcdb77db",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3160919200",
        "elementType": "node",
        "elementId": 3160919200,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 249.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "amenity": "restaurant",
          "cuisine": "kebab",
          "diet:vegetarian": "no",
          "indoor_seating": "yes",
          "name": "Orient Grill Haus",
          "opening_hours:signed": "no",
          "outdoor_seating": "yes",
          "toilets:wheelchair": "no",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1328524168",
    "sourceCategory": "restaurant",
    "canonicalNameHint": "Golden Choice",
    "displayName": "Golden Choice",
    "addressLine1": "Greifswalder Straße 216",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5314169,
    "longitude": 13.4269899,
    "geohash": "u33dce11xtc",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1328524168",
        "elementType": "node",
        "elementId": 1328524168,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "restaurant",
        "distanceMetersFromAnchor": 254.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "216",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "air_conditioning": "no",
          "amenity": "restaurant",
          "check_date": "2025-12-07",
          "check_date:diet:vegan": "2025-09-01",
          "check_date:diet:vegetarian": "2025-09-01",
          "check_date:opening_hours": "2025-09-01",
          "check_date:smoking": "2025-12-07",
          "contact:phone": "+49 30 44352062",
          "cuisine": "thai",
          "diet:vegan": "yes",
          "diet:vegetarian": "yes",
          "indoor_seating": "yes",
          "name": "Golden Choice",
          "opening_hours": "Mo-Fr 12:00-22:00; Sa,Su 13:00-22:00",
          "outdoor_seating": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "smoking": "outside",
          "toilets:wheelchair": "no",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/12485213693",
    "sourceCategory": "bar",
    "canonicalNameHint": "KROM",
    "displayName": "KROM",
    "addressLine1": "Winsstraße 9",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5321283,
    "longitude": 13.4239587,
    "geohash": "u33dc7pjbfm",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/12485213693",
        "elementType": "node",
        "elementId": 12485213693,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 42.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "9",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "amenity": "bar",
          "name": "KROM",
          "opening_hours": "Tu-Su 18:00+"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/9523889809",
    "sourceCategory": "bar",
    "canonicalNameHint": "KROM",
    "displayName": "KROM",
    "addressLine1": "Winsstraße 9",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5322134,
    "longitude": 13.424032,
    "geohash": "u33dc7pn6d7",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/9523889809",
        "elementType": "node",
        "elementId": 9523889809,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 50.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "9",
          "addr:street": "Winsstraße",
          "air_conditioning": "no",
          "amenity": "bar",
          "contact:instagram": "krom.bar",
          "level": "0",
          "microbrewery": "no",
          "name": "KROM",
          "opening_hours": "Mo off; Tu-Su 18:00-24:00",
          "payment:cash": "yes",
          "payment:coins": "yes",
          "smoking": "yes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1976742386",
    "sourceCategory": "bar",
    "canonicalNameHint": "Weinberg",
    "displayName": "Weinberg",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5327033,
    "longitude": 13.4240153,
    "geohash": "u33dc7r14jx",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1976742386",
        "elementType": "node",
        "elementId": 1976742386,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 88.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "amenity": "bar",
          "check_date": "2024-06-10",
          "indoor_seating": "yes",
          "level": "0",
          "name": "Weinberg",
          "opening_hours": "Mo-Sa 12:00-24:00",
          "outdoor_seating": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "toilets": "no",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/5332786082",
    "sourceCategory": "bar",
    "canonicalNameHint": "Mima",
    "displayName": "Mima",
    "addressLine1": "Winsstraße 1",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5309987,
    "longitude": 13.4228741,
    "geohash": "u33dc6yppxu",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/5332786082",
        "elementType": "node",
        "elementId": 5332786082,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 117.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "1",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "bar",
          "name": "Mima",
          "opening_hours": "We-Su 17:00-22:00",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1244487091",
    "sourceCategory": "bar",
    "canonicalNameHint": "Enoteca Sorsi e Morsi",
    "displayName": "Enoteca Sorsi e Morsi",
    "addressLine1": "Marienburger Straße 10",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5345014,
    "longitude": 13.4248197,
    "geohash": "u33dc7xesuz",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1244487091",
        "elementType": "node",
        "elementId": 1244487091,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 293.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "10",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "bar",
          "check_date": "2025-04-06",
          "contact:phone": "+49 30 44038216",
          "contact:website": "http://www.sorsiemorsi.de",
          "indoor_seating": "yes",
          "level": "0",
          "name": "Enoteca Sorsi e Morsi",
          "opening_hours": "Tu-Sa 17:00-dawn",
          "operator": "Johnny Petrongolo",
          "outdoor_seating": "yes",
          "smoking": "yes",
          "toilets": "yes",
          "toilets:access": "customers",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3727835831",
    "sourceCategory": "bar",
    "canonicalNameHint": "Marienhof",
    "displayName": "Marienhof",
    "addressLine1": "Marienburger Straße 7",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5348162,
    "longitude": 13.4239667,
    "geohash": "u33dc7xj3pe",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3727835831",
        "elementType": "node",
        "elementId": 3727835831,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 314.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "7",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "bar",
          "check_date": "2026-03-03",
          "check_date:opening_hours": "2025-01-21",
          "contact:website": "http://marienhof-berlin.de/",
          "indoor_seating": "yes",
          "lgbtq": "primary",
          "name": "Marienhof",
          "opening_hours": "Tu-Sa 19:00-24:00+",
          "outdoor_seating": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/13722584530",
    "sourceCategory": "bar",
    "canonicalNameHint": "Myer's Bar",
    "displayName": "Myer's Bar",
    "addressLine1": "Metzer Straße 26",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5312633,
    "longitude": 13.417864,
    "geohash": "u33dc748fch",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/13722584530",
        "elementType": "node",
        "elementId": 13722584530,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bar",
        "distanceMetersFromAnchor": 381.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "26",
          "addr:postcode": "10405",
          "addr:street": "Metzer Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "bar",
          "name": "Myer's Bar"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/2524502813",
    "sourceCategory": "pub",
    "canonicalNameHint": "Tomsky",
    "displayName": "Tomsky",
    "addressLine1": "Winsstraße 61",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5332865,
    "longitude": 13.4245632,
    "geohash": "u33dc7rkwfr",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/2524502813",
        "elementType": "node",
        "elementId": 2524502813,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pub",
        "distanceMetersFromAnchor": 162.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "61",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pub",
          "atm": "no",
          "check_date": "2024-06-10",
          "contact:website": "http://www.tomsky-bar.de/",
          "cuisine": "american",
          "food": "yes",
          "level": "0",
          "name": "Tomsky",
          "opening_hours": "Mo-Su 18:00+",
          "operator": "we",
          "smoking": "yes",
          "toilets": "yes",
          "toilets:access": "customers",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3727439535",
    "sourceCategory": "pub",
    "canonicalNameHint": "Dream Baby Dream",
    "displayName": "Dream Baby Dream",
    "addressLine1": "Greifswalder Straße 218",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5310506,
    "longitude": 13.4266317,
    "geohash": "u33dcdbzx1w",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3727439535",
        "elementType": "node",
        "elementId": 3727439535,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pub",
        "distanceMetersFromAnchor": 245.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "218",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pub",
          "brewery": "yes",
          "check_date": "2024-06-13",
          "contact:facebook": "https://www.facebook.com/dreambabydreambar",
          "indoor_seating": "yes",
          "level": "0;1",
          "name": "Dream Baby Dream",
          "opening_hours": "Tu-Sa 18:00-02:00,Su-Mo off",
          "outdoor_seating": "yes",
          "smoking": "yes",
          "source": "survey",
          "toilets:wheelchair": "no",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/2844871469",
    "sourceCategory": "pub",
    "canonicalNameHint": "Unsre Kneipe",
    "displayName": "Unsre Kneipe",
    "addressLine1": "Belforter Straße 22",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5322957,
    "longitude": 13.4190074,
    "geohash": "u33dc75qv99",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/2844871469",
        "elementType": "node",
        "elementId": 2844871469,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pub",
        "distanceMetersFromAnchor": 296.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "22",
          "addr:postcode": "10405",
          "addr:street": "Belforter Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pub",
          "contact:phone": "+49 30 44352184",
          "contact:website": "http://unsrekneipe.de/",
          "name": "Unsre Kneipe",
          "operator": "Christian Keiser",
          "outdoor_seating": "yes",
          "phone": "+49 30 940 58 335",
          "smoking": "isolated",
          "toilets:wheelchair": "no",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/638214318",
    "sourceCategory": "pub",
    "canonicalNameHint": "etc.",
    "displayName": "etc.",
    "addressLine1": "Knaackstraße 12",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5342441,
    "longitude": 13.419811,
    "geohash": "u33dc7s40kb",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/638214318",
        "elementType": "node",
        "elementId": 638214318,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pub",
        "distanceMetersFromAnchor": 345.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "12",
          "addr:postcode": "10405",
          "addr:street": "Knaackstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pub",
          "contact:email": "peter@etc-bar.de",
          "contact:website": "http://www.etc-bar.de",
          "name": "etc.",
          "opening_hours": "Tu-Su 19:00-02:00",
          "operator": "Peter Kjeldsen",
          "phone": "+4917657470611",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/4152849690",
    "sourceCategory": "pub",
    "canonicalNameHint": "Café Babel",
    "displayName": "Café Babel",
    "addressLine1": "Käthe-Niederkirchner-Straße 2",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5315419,
    "longitude": 13.4288757,
    "geohash": "u33dce4d7mp",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/4152849690",
        "elementType": "node",
        "elementId": 4152849690,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pub",
        "distanceMetersFromAnchor": 376.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "2",
          "addr:street": "Käthe-Niederkirchner-Straße",
          "amenity": "pub",
          "check_date:opening_hours": "2025-01-20",
          "name": "Café Babel",
          "opening_hours": "Mo-Sa 17:00-03:00, Su 17:00-01:00",
          "phone": "+49 30 4247552",
          "website": "http://cafebabel.de/",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3202792867",
    "sourceCategory": "bakery",
    "canonicalNameHint": "Der Bäcker",
    "displayName": "Der Bäcker",
    "addressLine1": "Prenzlauer Allee 222",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5342286,
    "longitude": 13.4208732,
    "geohash": "u33dc7sf140",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3202792867",
        "elementType": "node",
        "elementId": 3202792867,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 298.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:floor": "0",
          "addr:housenumber": "222",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2026-04-06",
          "check_date:opening_hours": "2024-11-26",
          "currency:EUR": "yes",
          "level": "0",
          "name": "Der Bäcker",
          "opening_hours": "Mo-Fr 07:00-18:00; Sa 07:00-13:00",
          "operator": "Krautzig",
          "payment:cash": "yes",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "shop": "bakery",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10103313144",
    "sourceCategory": "bakery",
    "canonicalNameHint": "Greifswalder Backshop",
    "displayName": "Greifswalder Backshop",
    "addressLine1": "Greifswalder Straße 209",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5324165,
    "longitude": 13.4281959,
    "geohash": "u33dce4pe8h",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10103313144",
        "elementType": "node",
        "elementId": 10103313144,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 330.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "209",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date:opening_hours": "2025-01-25",
          "indoor_seating": "yes",
          "level": "0",
          "name": "Greifswalder Backshop",
          "opening_hours:signed": "no",
          "outdoor_seating": "yes",
          "shop": "bakery",
          "smoking": "outside",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/5001628774",
    "sourceCategory": "bakery",
    "canonicalNameHint": "100 Brote",
    "displayName": "100 Brote",
    "addressLine1": "Hufelandstraße 2",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10407",
    "countryCode": "DE",
    "latitude": 52.5327223,
    "longitude": 13.4297306,
    "geohash": "u33dce71r3h",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/5001628774",
        "elementType": "node",
        "elementId": 5001628774,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 437.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "2",
          "addr:postcode": "10407",
          "addr:street": "Hufelandstraße",
          "bakehouse": "yes",
          "cafe": "yes",
          "check_date": "2025-10-08",
          "check_date:smoking": "2025-10-08",
          "contact:website": "http://www.100brote.de/",
          "indoor_seating": "yes",
          "name": "100 Brote",
          "opening_hours": "Mo-Sa 08:00-18:00; Su 09:00-18:00",
          "outdoor_seating": "yes",
          "shop": "bakery",
          "smoking": "outside",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/5559499132",
    "sourceCategory": "bakery",
    "canonicalNameHint": "Bäckerei & Café Wins",
    "displayName": "Bäckerei & Café Wins",
    "addressLine1": "Winsstraße 29",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5355903,
    "longitude": 13.4271652,
    "geohash": "u33dcec3gxu",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/5559499132",
        "elementType": "node",
        "elementId": 5559499132,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 473.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "29",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2025-01-19",
          "indoor_seating": "yes",
          "name": "Bäckerei & Café Wins",
          "opening_hours": "Mo-Fr 06:00-16:30; Sa-Su 07:00-14:00",
          "outdoor_seating": "sidewalk",
          "payment:cards": "no",
          "payment:credit_cards": "no",
          "payment:debit_cards": "no",
          "shop": "bakery",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1492336684",
    "sourceCategory": "bakery",
    "canonicalNameHint": "Beumer & Lutum",
    "displayName": "Beumer & Lutum",
    "addressLine1": "Hufelandstraße 9",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10407",
    "countryCode": "DE",
    "latitude": 52.5325268,
    "longitude": 13.4309034,
    "geohash": "u33dcek04sz",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1492336684",
        "elementType": "node",
        "elementId": 1492336684,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 513.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "9",
          "addr:postcode": "10407",
          "addr:street": "Hufelandstraße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date:opening_hours": "2026-05-15",
          "contact:phone": "+49 30 4254525",
          "contact:website": "http://www.beumer-lutum.de/baeckerei/laden_hufeland/",
          "indoor_seating": "yes",
          "name": "Beumer & Lutum",
          "opening_hours": "Mo-Fr 07:00-18:00; Sa 07:00-16:00; Su 07:30-16:00",
          "outdoor_seating": "yes",
          "shop": "bakery",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/11964856359",
    "sourceCategory": "bakery",
    "canonicalNameHint": "Cena",
    "displayName": "Cena",
    "addressLine1": "Rykestraße 12",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5363616,
    "longitude": 13.4206919,
    "geohash": "u33dc7uwkz9",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/11964856359",
        "elementType": "node",
        "elementId": 11964856359,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 515.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "12",
          "addr:street": "Rykestraße",
          "check_date": "2024-06-08",
          "name": "Cena",
          "shop": "bakery",
          "source": "survey",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1737166738",
    "sourceCategory": "bakery",
    "canonicalNameHint": "Café Hennig",
    "displayName": "Café Hennig",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.536407,
    "longitude": 13.4184737,
    "geohash": "u33dc7gnc05",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1737166738",
        "elementType": "node",
        "elementId": 1737166738,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bakery",
        "distanceMetersFromAnchor": 589.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "indoor_seating": "yes",
          "name": "Café Hennig",
          "opening_hours": "Mo-Sa 07:00-14:00",
          "outdoor_seating": "sidewalk",
          "shop": "bakery",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/2398339919",
    "sourceCategory": "supermarket",
    "canonicalNameHint": "Netto",
    "displayName": "Netto",
    "addressLine1": "Belforter Straße 20",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5321413,
    "longitude": 13.4195614,
    "geohash": "u33dc75vfky",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/2398339919",
        "elementType": "node",
        "elementId": 2398339919,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "supermarket",
        "distanceMetersFromAnchor": 257.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "20",
          "addr:postcode": "10405",
          "addr:street": "Belforter Straße",
          "addr:suburb": "Prenzlauer Berg",
          "brand": "Netto",
          "brand:wikidata": "Q552652",
          "brand:wikipedia": "da:Netto (supermarkedskæde)",
          "check_date": "2024-01-28",
          "contact:phone": "+49 180 2551212",
          "contact:website": "http://www.netto.de",
          "name": "Netto",
          "name:ja": "ネットー",
          "opening_hours": "Mo-Sa 07:00-21:00",
          "ref:vatin": "DE291493807",
          "self_checkout": "no",
          "shop": "supermarket",
          "supermarket:type": "discounter",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10035991556",
    "sourceCategory": "supermarket",
    "canonicalNameHint": "Edeka Marienburger Straße",
    "displayName": "Edeka Marienburger Straße",
    "addressLine1": "Winsstraße 14a",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5339932,
    "longitude": 13.4261824,
    "geohash": "u33dce88swp",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10035991556",
        "elementType": "node",
        "elementId": 10035991556,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "supermarket",
        "distanceMetersFromAnchor": 291.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "14a",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "brand": "Edeka",
          "brand:website": "https://www.edeka.de/",
          "brand:wikidata": "Q701755",
          "contact:website": "https://www.edeka.de/eh/minden-hannover/edeka-marienburger-stra%C3%9Fe-winsstr.-18-20/index.jsp",
          "level": "0",
          "name": "Edeka Marienburger Straße",
          "opening_hours": "Mo-Fr 07:00-24:00, Sa 07:00-23:30; PH off",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "self_checkout": "yes",
          "self_service": "yes",
          "shop": "supermarket",
          "survey:date": "2025-01-25",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3898818522",
    "sourceCategory": "supermarket",
    "canonicalNameHint": "Bio Company",
    "displayName": "Bio Company",
    "addressLine1": "Greifswalder Straße 212",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5320465,
    "longitude": 13.4277612,
    "geohash": "u33dce1v3e0",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3898818522",
        "elementType": "node",
        "elementId": 3898818522,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "supermarket",
        "distanceMetersFromAnchor": 297.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "212",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "brand": "Bio Company",
          "brand:wikidata": "Q864179",
          "brand:wikipedia": "de:Bio Company",
          "check_date": "2025-09-01",
          "check_date:opening_hours": "2025-09-01",
          "name": "Bio Company",
          "opening_hours": "Mo-Sa 08:00-21:00",
          "organic": "only",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "phone": "+49 30 25 20 93 29-0",
          "shop": "supermarket",
          "source": "Collected via KeypadMapper",
          "toilets:wheelchair": "no",
          "website": "https://www.biocompany.de/bio-company-markt-finden/l/berlin/greifswalder-strasse-212/358408",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/6088939377",
    "sourceCategory": "supermarket",
    "canonicalNameHint": "AES Shop",
    "displayName": "AES Shop",
    "addressLine1": "Marienburger Straße 36",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5345065,
    "longitude": 13.4256884,
    "geohash": "u33dce879jy",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/6088939377",
        "elementType": "node",
        "elementId": 6088939377,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "supermarket",
        "distanceMetersFromAnchor": 318.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "36",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2025-01-25",
          "check_date:opening_hours": "2025-01-25",
          "name": "AES Shop",
          "opening_hours": "Mo-Fr 09:30-19:30; Sa 09:30-18:00",
          "origin": "asian",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "shop": "supermarket",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/521227908",
    "sourceCategory": "supermarket",
    "canonicalNameHint": "Denns BioMarkt",
    "displayName": "Denns BioMarkt",
    "addressLine1": "Greifswalder Straße 31",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5325693,
    "longitude": 13.429371,
    "geohash": "u33dce6brh8",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/521227908",
        "elementType": "node",
        "elementId": 521227908,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "supermarket",
        "distanceMetersFromAnchor": 411.1,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "31",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "brand": "Denns BioMarkt",
          "brand:wikidata": "Q48883773",
          "brand:wikipedia": "de:Denn’s Biomarkt",
          "check_date": "2026-05-14",
          "check_date:diet:halal": "2024-11-12",
          "check_date:diet:kosher": "2024-11-12",
          "check_date:opening_hours": "2024-11-12",
          "diet:halal": "no",
          "diet:kosher": "no",
          "name": "Denns BioMarkt",
          "opening_hours": "Mo-Sa 08:00-21:00",
          "operator": "Dennree GmbH",
          "operator:wikidata": "Q1189641",
          "organic": "only",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "shop": "supermarket",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/4787095825",
    "sourceCategory": "supermarket",
    "canonicalNameHint": "Lidl",
    "displayName": "Lidl",
    "addressLine1": "Prenzlauer Allee 44",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5362946,
    "longitude": 13.4229304,
    "geohash": "u33dc7yq0gn",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/4787095825",
        "elementType": "node",
        "elementId": 4787095825,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "supermarket",
        "distanceMetersFromAnchor": 476.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "44",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "brand": "Lidl",
          "brand:wikidata": "Q151954",
          "brand:wikipedia": "en:Lidl",
          "cash_withdrawal": "yes",
          "check_date:opening_hours": "2025-01-21",
          "contact:website": "https://www.lidl.de",
          "internet_access": "wlan",
          "name": "Lidl",
          "opening_hours": "Mo-Sa 07:00-22:00",
          "self_checkout": "yes",
          "shop": "supermarket",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/13725685870",
    "sourceCategory": "convenience",
    "canonicalNameHint": "Winsmarkt",
    "displayName": "Winsmarkt",
    "addressLine1": "Immanuelkirchstraße 3",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5329591,
    "longitude": 13.4224699,
    "geohash": "u33dc7mfwjq",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/13725685870",
        "elementType": "node",
        "elementId": 13725685870,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "convenience",
        "distanceMetersFromAnchor": 120.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "3",
          "addr:street": "Immanuelkirchstraße",
          "check_date": "2026-04-12",
          "name": "Winsmarkt",
          "shop": "convenience"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10015764560",
    "sourceCategory": "convenience",
    "canonicalNameHint": "The Winsy Späti",
    "displayName": "The Winsy Späti",
    "addressLine1": "Winsstraße 14",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5332463,
    "longitude": 13.424969,
    "geohash": "u33dc7ru26y",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10015764560",
        "elementType": "node",
        "elementId": 10015764560,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "convenience",
        "distanceMetersFromAnchor": 174.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "14",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "post_office",
          "check_date:opening_hours": "2023-08-05",
          "name": "The Winsy Späti",
          "opening_hours:signed": "no",
          "operator": "Hermes",
          "operator:wikidata": "Q1613532",
          "shop": "convenience",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/790502632",
    "sourceCategory": "convenience",
    "canonicalNameHint": "Dilek",
    "displayName": "Dilek",
    "addressLine1": "Prenzlauer Allee 26",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.532597,
    "longitude": 13.4207405,
    "geohash": "u33dc7k8tcv",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/790502632",
        "elementType": "node",
        "elementId": 790502632,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "convenience",
        "distanceMetersFromAnchor": 188.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "26",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "name": "Dilek",
          "shop": "convenience",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3987051080",
    "sourceCategory": "convenience",
    "canonicalNameHint": "Spätkauf",
    "displayName": "Spätkauf",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5313867,
    "longitude": 13.420016,
    "geohash": "u33dc7h1t01",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3987051080",
        "elementType": "node",
        "elementId": 3987051080,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "convenience",
        "distanceMetersFromAnchor": 236.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "check_date:opening_hours": "2025-01-23",
          "name": "Spätkauf",
          "opening_hours": "Mo-Fr 09:00-02:00, Sa,Su 10:00-02:00",
          "shop": "convenience",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1389043771",
    "sourceCategory": "convenience",
    "canonicalNameHint": "City Spätkauf",
    "displayName": "City Spätkauf",
    "addressLine1": "Greifswalder Straße 9",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5295875,
    "longitude": 13.4258675,
    "geohash": "u33dcd8rj2u",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1389043771",
        "elementType": "node",
        "elementId": 1389043771,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "convenience",
        "distanceMetersFromAnchor": 318.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "9",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "check_date": "2026-05-14",
          "name": "City Spätkauf",
          "opening_hours": "Mo-Su 10:00-01:00",
          "shop": "convenience",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/9982099019",
    "sourceCategory": "convenience",
    "canonicalNameHint": "Schätzchen",
    "displayName": "Schätzchen",
    "addressLine1": "Marienburger Straße 5a",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5349049,
    "longitude": 13.4236558,
    "geohash": "u33dc7wy1b5",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/9982099019",
        "elementType": "node",
        "elementId": 9982099019,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "convenience",
        "distanceMetersFromAnchor": 321.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "5a",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "check_date": "2025-01-21",
          "check_date:opening_hours": "2025-01-21",
          "name": "Schätzchen",
          "opening_hours": "Tu-Sa 10:00-18:00",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "shop": "convenience",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1976708788",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "Herr Nilsson Godis",
    "displayName": "Herr Nilsson Godis",
    "addressLine1": "Immanuelkirchstraße 22",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.53197,
    "longitude": 13.4260769,
    "geohash": "u33dce0sfkb",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1976708788",
        "elementType": "node",
        "elementId": 1976708788,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 183.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "22",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "check_date:opening_hours": "2025-01-25",
          "name": "Herr Nilsson Godis",
          "opening_hours": "Mo-We 13:00-18:00; Th,Fr 13:00-18:30; Sa 12:00-18:00",
          "phone": "+49 30 545 945 85",
          "shop": "confectionery",
          "website": "http://herrnilsson.youmeokay.com/",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964235366",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "deutscheundfranzosen",
    "displayName": "deutscheundfranzosen",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5335395,
    "longitude": 13.4216383,
    "geohash": "u33dc7mq4cd",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964235366",
        "elementType": "node",
        "elementId": 1964235366,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 205.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "comment": "Wein",
          "description": "Wein und Olivenöl",
          "name": "deutscheundfranzosen",
          "opening_hours": "Tu-Fr 15:00-20:00; Sa 12:00-17:00",
          "shop": "wine",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10100799055",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "Teeraum Sanvian",
    "displayName": "Teeraum Sanvian",
    "addressLine1": "Winsstraße 58",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5337151,
    "longitude": 13.4249443,
    "geohash": "u33dc7rxpfk",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10100799055",
        "elementType": "node",
        "elementId": 10100799055,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 217.1,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "58",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "name": "Teeraum Sanvian",
          "opening_hours": "Tu-Th 09:00-09:55; Fr 19:30-19:55; Sa,Su 09:00-09:55",
          "shop": "tea",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/6301005050",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "Enten und Katzen",
    "displayName": "Enten und Katzen",
    "addressLine1": "Winsstraße 58",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.533806,
    "longitude": 13.4250515,
    "geohash": "u33dc7rzd75",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/6301005050",
        "elementType": "node",
        "elementId": 6301005050,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 229.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "58",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2024-06-10",
          "contact:website": "http://www.entenundkatzen.com/",
          "drink:coffee": "served",
          "level": "0",
          "name": "Enten und Katzen",
          "opening_hours": "Mo-Sa 08:00-22:00; PH,Su 09:00-21:00",
          "organic": "only",
          "outdoor_seating": "yes",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "phone": "+49 30 44041552",
          "shop": "deli",
          "toilets:wheelchair": "no",
          "wheelchair": "yes",
          "wheelchair:description": "Rampe am Eingang.Teilweise enge Gänge - aber hilfsbereites Personal"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10100729882",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "The Mindful Drinking Club - Alkoholfrei",
    "displayName": "The Mindful Drinking Club - Alkoholfrei",
    "addressLine1": "Prenzlauer Allee 31",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.533931,
    "longitude": 13.4215298,
    "geohash": "u33dc7t2269",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10100729882",
        "elementType": "node",
        "elementId": 10100729882,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 246.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "31",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "level": "0",
          "name": "The Mindful Drinking Club - Alkoholfrei",
          "opening_hours": "Fr,Sa 12:00-19:00",
          "shop": "wine",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/2420046862",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "Vineria Carvalho",
    "displayName": "Vineria Carvalho",
    "addressLine1": "Heinrich-Roller-Straße 9",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5298995,
    "longitude": 13.4246124,
    "geohash": "u33dc6z8b5h",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/2420046862",
        "elementType": "node",
        "elementId": 2420046862,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 250.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "9",
          "addr:postcode": "10405",
          "addr:street": "Heinrich-Roller-Straße",
          "addr:suburb": "Prenzlauer Berg",
          "contact:website": "http://vineriacarvalho.de/",
          "cuisine": "spanish;tapas",
          "description": "Vinothèque with wine bar and delis",
          "designation": "Weinladen, spanische Spezialitäten",
          "drink:wine": "retail",
          "email": "info@vineriacarvalho.de",
          "name": "Vineria Carvalho",
          "opening_hours": "Mo-Sa 16:00-22:00+",
          "phone": "+4930 4413765",
          "shop": "wine",
          "source": "Owner",
          "website": "https://vineriacarvalho.de/",
          "wheelchair": "limited",
          "wheelchair:description": "2 Stufen aber Klingel"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10103235063",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "Le Flâneur",
    "displayName": "Le Flâneur",
    "addressLine1": "Greifswalder Straße 214",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5317494,
    "longitude": 13.4274118,
    "geohash": "u33dce1e97g",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10103235063",
        "elementType": "node",
        "elementId": 10103235063,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 275.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "214",
          "addr:postcode": "10405",
          "addr:street": "Greifswalder Straße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2025-09-01",
          "check_date:opening_hours": "2025-09-01",
          "level": "0",
          "name": "Le Flâneur",
          "opening_hours": "Tu-Fr 12:00-20:00; Sa 10:00-18:00",
          "payment:cash": "yes",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "shop": "deli",
          "source": "survey",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/4421573988",
    "sourceCategory": "specialty_food",
    "canonicalNameHint": "Tee & Ton",
    "displayName": "Tee & Ton",
    "addressLine1": "Marienburger Straße 11",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5344388,
    "longitude": 13.4250089,
    "geohash": "u33dc7xg33h",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/4421573988",
        "elementType": "node",
        "elementId": 4421573988,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "specialty_food",
        "distanceMetersFromAnchor": 291.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "11",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "check_date": "2025-01-21",
          "contact:website": "http://www.tee-und-ton.de/",
          "name": "Tee & Ton",
          "opening_hours": "Mo, Tu, Th, Fr 15:00-19:00; Sa 11:00-16:00",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "phone": "+49 30 40 30 14 50",
          "shop": "tea",
          "website": "tee-und-ton.de",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1374215630",
    "sourceCategory": "pharmacy",
    "canonicalNameHint": "Immanuel Apotheke",
    "displayName": "Immanuel Apotheke",
    "addressLine1": "Immanuelkirchstraße 2",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.533075,
    "longitude": 13.4221508,
    "geohash": "u33dc7meqfc",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1374215630",
        "elementType": "node",
        "elementId": 1374215630,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pharmacy",
        "distanceMetersFromAnchor": 143.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "2",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pharmacy",
          "check_date": "2025-01-25",
          "check_date:opening_hours": "2025-01-25",
          "contact:phone": "+493040056757",
          "contact:website": "http://www.immanuel-apotheke-berlin.de",
          "dispensing": "yes",
          "entrance": "yes",
          "healthcare": "pharmacy",
          "level": "0",
          "name": "Immanuel Apotheke",
          "opening_hours": "Mo-Fr 08:30-19:00; Sa 09:00-14:00",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3727826475",
    "sourceCategory": "pharmacy",
    "canonicalNameHint": "Greifswalder Apotheke",
    "displayName": "Greifswalder Apotheke",
    "addressLine1": "Greifswalder Straße 207A",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328339,
    "longitude": 13.4286374,
    "geohash": "u33dce63vyj",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3727826475",
        "elementType": "node",
        "elementId": 3727826475,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pharmacy",
        "distanceMetersFromAnchor": 368.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "207A",
          "addr:street": "Greifswalder Straße",
          "amenity": "pharmacy",
          "check_date": "2025-01-25",
          "check_date:opening_hours": "2025-01-25",
          "dispensing": "yes",
          "healthcare": "pharmacy",
          "level": "0",
          "mapillary": "303115644653743",
          "name": "Greifswalder Apotheke",
          "opening_hours": "Mo-Fr 08:00-19:30; Sa 09:00-14:00",
          "payment:credit_cards": "yes",
          "payment:debit_cards": "yes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/775578347",
    "sourceCategory": "pharmacy",
    "canonicalNameHint": "Prenzlauer Apotheke",
    "displayName": "Prenzlauer Apotheke",
    "addressLine1": "Prenzlauer Allee 214",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5359441,
    "longitude": 13.4218153,
    "geohash": "u33dc7vkncy",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/775578347",
        "elementType": "node",
        "elementId": 775578347,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pharmacy",
        "distanceMetersFromAnchor": 449.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "214",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pharmacy",
          "dispensing": "yes",
          "healthcare": "pharmacy",
          "name": "Prenzlauer Apotheke",
          "opening_hours": "Mo-Fr 09:00-19:30; Sa 09:00-18:00",
          "website": "https://www.prenzlauer-apotheke.de/",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/267366952",
    "sourceCategory": "pharmacy",
    "canonicalNameHint": "Wins-Apotheke",
    "displayName": "Wins-Apotheke",
    "addressLine1": "Winsstraße 45",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5360082,
    "longitude": 13.4270624,
    "geohash": "u33dceck3jx",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/267366952",
        "elementType": "node",
        "elementId": 267366952,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pharmacy",
        "distanceMetersFromAnchor": 509.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "45",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pharmacy",
          "check_date": "2025-01-18",
          "check_date:opening_hours": "2025-01-18",
          "dispensing": "yes",
          "healthcare": "pharmacy",
          "name": "Wins-Apotheke",
          "opening_hours": "Mo-Fr 08:00-19:00; Sa 09:00-14:00; Su off",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "phone": "+49 30 4439390",
          "website": "https://www.wins-apotheke.de/",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1492336686",
    "sourceCategory": "pharmacy",
    "canonicalNameHint": "Esmarch Apotheke",
    "displayName": "Esmarch Apotheke",
    "addressLine1": "Hufelandstraße 15",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10407",
    "countryCode": "DE",
    "latitude": 52.532136,
    "longitude": 13.431803,
    "geohash": "u33dcehtzey",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1492336686",
        "elementType": "node",
        "elementId": 1492336686,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "pharmacy",
        "distanceMetersFromAnchor": 571.1,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "15",
          "addr:postcode": "10407",
          "addr:street": "Hufelandstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "pharmacy",
          "check_date:opening_hours": "2024-09-08",
          "contact:phone": "+49304250425",
          "contact:website": "http://www.esmarch-apotheke-berlin.de/",
          "dispensing": "yes",
          "healthcare": "pharmacy",
          "name": "Esmarch Apotheke",
          "opening_hours": "Mo-Fr 09:00-13:30,14:30-18:30; Sa 09:00-13:00",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1976439646",
    "sourceCategory": "bookstore",
    "canonicalNameHint": "Antiquariat Sawo & Stöppler",
    "displayName": "Antiquariat Sawo & Stöppler",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5326632,
    "longitude": 13.4233429,
    "geohash": "u33dc7q8fw1",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1976439646",
        "elementType": "node",
        "elementId": 1976439646,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bookstore",
        "distanceMetersFromAnchor": 71.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "books": "antiquarian",
          "check_date:opening_hours": "2025-01-25",
          "name": "Antiquariat Sawo & Stöppler",
          "opening_hours": "Tu, Th, Fr 14:00-19:00; Sa 11:00-16:00",
          "opening_hours:signed": "no",
          "shop": "books",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3879876669",
    "sourceCategory": "bookstore",
    "canonicalNameHint": "Einar&Bert",
    "displayName": "Einar&Bert",
    "addressLine1": "Winsstraße 72",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5310335,
    "longitude": 13.4224435,
    "geohash": "u33dc6vzmw7",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3879876669",
        "elementType": "node",
        "elementId": 3879876669,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bookstore",
        "distanceMetersFromAnchor": 125.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "72",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date:opening_hours": "2025-09-24",
          "contact:website": "http://www.einar-und-bert.de/",
          "description": "Theaterbuchhandlung",
          "name": "Einar&Bert",
          "opening_hours": "Tu-Sa 12:00-18:00",
          "shop": "books",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1964235506",
    "sourceCategory": "bookstore",
    "canonicalNameHint": "The bargain book shop",
    "displayName": "The bargain book shop",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5331132,
    "longitude": 13.4228071,
    "geohash": "u33dc7q5w44",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1964235506",
        "elementType": "node",
        "elementId": 1964235506,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bookstore",
        "distanceMetersFromAnchor": 127.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "check_date:opening_hours": "2025-01-25",
          "name": "The bargain book shop",
          "opening_hours": "Mo-Fr 12:00-20:00; Sa 11:00-18:00",
          "opening_hours:signed": "no",
          "shop": "books",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/9974961126",
    "sourceCategory": "bookstore",
    "canonicalNameHint": "Fräulein Schneefeld & Herr Hund",
    "displayName": "Fräulein Schneefeld & Herr Hund",
    "addressLine1": "Prenzlauer Allee 23",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5319918,
    "longitude": 13.4203719,
    "geohash": "u33dc7hmj34",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/9974961126",
        "elementType": "node",
        "elementId": 9974961126,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bookstore",
        "distanceMetersFromAnchor": 202.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "23",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "contact:phone": "+49 30 77325205",
          "contact:website": "http://schneefeld-und-hund.de/",
          "name": "Fräulein Schneefeld & Herr Hund",
          "opening_hours": "We-Fr 11:00-18:00; Sa 10:00-15:00",
          "shop": "books"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1359167889",
    "sourceCategory": "bookstore",
    "canonicalNameHint": "Sozialer Bücherladen",
    "displayName": "Sozialer Bücherladen",
    "addressLine1": "Immanuelkirchstraße 20",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5318235,
    "longitude": 13.4265682,
    "geohash": "u33dce0uj9w",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1359167889",
        "elementType": "node",
        "elementId": 1359167889,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "bookstore",
        "distanceMetersFromAnchor": 217.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "20",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "check_date:opening_hours": "2025-01-25",
          "name": "Sozialer Bücherladen",
          "opening_hours": "Th 10:00-19:00; Mo-Fr 10:00-17:00",
          "opening_hours:signed": "no",
          "operator": "https://einlichtstrahlev.de/",
          "shop": "books",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/4499037740",
    "sourceCategory": "clothing_store",
    "canonicalNameHint": "voycontigo",
    "displayName": "voycontigo",
    "addressLine1": "Immanuelkirchstraße 28",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5324971,
    "longitude": 13.4245857,
    "geohash": "u33dc7przx0",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/4499037740",
        "elementType": "node",
        "elementId": 4499037740,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "clothing_store",
        "distanceMetersFromAnchor": 98.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "28",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "check_date:opening_hours": "2025-01-25",
          "email": "info@voycontigo.de",
          "name": "voycontigo",
          "opening_hours": "Tu-Sa 10:00-18:00; Nov-Mar: Tu-Sa 11:00-19:00; PH off",
          "opening_hours:signed": "no",
          "phone": "+49 761 76 99 84 70",
          "shop": "shoes",
          "website": "https://voycontigo.de/",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10015764558",
    "sourceCategory": "clothing_store",
    "canonicalNameHint": "Sommernest",
    "displayName": "Sommernest",
    "addressLine1": "Winsstraße 16",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5335231,
    "longitude": 13.4252193,
    "geohash": "u33dc7rvyq3",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10015764558",
        "elementType": "node",
        "elementId": 10015764558,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "clothing_store",
        "distanceMetersFromAnchor": 209.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "16",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2022-10-15",
          "contact:website": "https://www.sommernest.de",
          "name": "Sommernest",
          "opening_hours": "Tu-Fr 11:00-19:00; Sa 10:00-17:00",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "shop": "clothes",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/13171207708",
    "sourceCategory": "clothing_store",
    "canonicalNameHint": "Minx",
    "displayName": "Minx",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5301049,
    "longitude": 13.4240272,
    "geohash": "u33dc6z4492",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/13171207708",
        "elementType": "node",
        "elementId": 13171207708,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "clothing_store",
        "distanceMetersFromAnchor": 217.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "check_date:opening_hours": "2025-09-25",
          "contact:website": "http://minx-mode.de/",
          "name": "Minx",
          "opening_hours:signed": "no",
          "shop": "clothes",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/13830667056",
    "sourceCategory": "clothing_store",
    "canonicalNameHint": "Maniac Latex",
    "displayName": "Maniac Latex",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5295286,
    "longitude": 13.4257992,
    "geohash": "u33dcd8qevc",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/13830667056",
        "elementType": "node",
        "elementId": 13830667056,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "clothing_store",
        "distanceMetersFromAnchor": 322.1,
        "sourceLocality": "Berlin",
        "osmTags": {
          "check_date": "2026-05-14",
          "name": "Maniac Latex",
          "opening_hours": "Mo-Th,Sa 12:00-16:00; Fr 12:00-18:00; Su off",
          "operator": "Theresa Ziege",
          "phone": "+49 173 4955397",
          "shop": "clothes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/6960111285",
    "sourceCategory": "clothing_store",
    "canonicalNameHint": "Wertvoll",
    "displayName": "Wertvoll",
    "addressLine1": "Marienburger Straße 39",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5347466,
    "longitude": 13.425005,
    "geohash": "u33dc7xv169",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/6960111285",
        "elementType": "node",
        "elementId": 6960111285,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "clothing_store",
        "distanceMetersFromAnchor": 323.2,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "39",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2025-01-25",
          "check_date:opening_hours": "2025-01-25",
          "contact:website": "https://www.wertvoll-berlin.com/",
          "fair_trade": "yes",
          "level": "0",
          "name": "Wertvoll",
          "opening_hours": "Mo-Fr 11:00-18:00; Sa 11:00-18:00",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "shop": "clothes",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/2003325860",
    "sourceCategory": "retail",
    "canonicalNameHint": "Ein Laden",
    "displayName": "Ein Laden",
    "addressLine1": "Winsstraße 69",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5316744,
    "longitude": 13.4230768,
    "geohash": "u33dc7n7hmg",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/2003325860",
        "elementType": "node",
        "elementId": 2003325860,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "retail",
        "distanceMetersFromAnchor": 42.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housename": "Digital AudionetworX",
          "addr:housenumber": "69",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "description": "Manufaktur für Geschenke, Piñatas, Papeterie",
          "name": "Ein Laden",
          "opening_hours": "Tu-Fr 14:00-18:00",
          "shop": "gift",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10931228422",
    "sourceCategory": "retail",
    "canonicalNameHint": "Wilhelm die 3.",
    "displayName": "Wilhelm die 3.",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328077,
    "longitude": 13.4229378,
    "geohash": "u33dc7q3c15",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10931228422",
        "elementType": "node",
        "elementId": 10931228422,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "retail",
        "distanceMetersFromAnchor": 92.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "check_date:opening_hours": "2025-01-25",
          "name": "Wilhelm die 3.",
          "opening_hours": "Tu-Fr 12:00-19:00; Sa 12:00-17:00",
          "shop": "jewelry",
          "toilets:wheelchair": "no",
          "wheelchair": "yes"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1976439633",
    "sourceCategory": "retail",
    "canonicalNameHint": "Weinberg",
    "displayName": "Weinberg",
    "addressLine1": "Winsstraße 64A",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5327411,
    "longitude": 13.4240591,
    "geohash": "u33dc7r17hx",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1976439633",
        "elementType": "node",
        "elementId": 1976439633,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "retail",
        "distanceMetersFromAnchor": 93.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "64A",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2024-06-16",
          "contact:website": "http://www.weinberg-berlin.de/",
          "drink:wine": "retail",
          "level": "0",
          "name": "Weinberg",
          "opening_hours": "Mo-Sa 12:00-24:00",
          "payment:mastercard": "yes",
          "payment:visa": "yes",
          "shop": "alcohol",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10931274033",
    "sourceCategory": "retail",
    "canonicalNameHint": "Patina Designklassiker",
    "displayName": "Patina Designklassiker",
    "addressLine1": "Immanuelkirchstraße 4",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328428,
    "longitude": 13.4228232,
    "geohash": "u33dc7q1yrw",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10931274033",
        "elementType": "node",
        "elementId": 10931274033,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "retail",
        "distanceMetersFromAnchor": 98.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "4",
          "addr:street": "Immanuelkirchstraße",
          "check_date": "2026-04-12",
          "name": "Patina Designklassiker",
          "opening_hours": "Mo-Fr 09:00-16:00",
          "shop": "furniture"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/13725685868",
    "sourceCategory": "retail",
    "canonicalNameHint": "Dr. Kochan Schnapskultur",
    "displayName": "Dr. Kochan Schnapskultur",
    "addressLine1": "Immanuelkirchstraße 4",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328675,
    "longitude": 13.4227383,
    "geohash": "u33dc7q4hkr",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/13725685868",
        "elementType": "node",
        "elementId": 13725685868,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "retail",
        "distanceMetersFromAnchor": 103.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "4",
          "addr:street": "Immanuelkirchstraße",
          "check_date": "2026-04-12",
          "name": "Dr. Kochan Schnapskultur",
          "shop": "alcohol"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10100690569",
    "sourceCategory": "beauty",
    "canonicalNameHint": "Nadine Andres",
    "displayName": "Nadine Andres",
    "addressLine1": "Heinrich-Roller-Straße 23",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5313,
    "longitude": 13.4218012,
    "geohash": "u33dc7j3n8h",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10100690569",
        "elementType": "node",
        "elementId": 10100690569,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "beauty",
        "distanceMetersFromAnchor": 132.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "23",
          "addr:postcode": "10405",
          "addr:street": "Heinrich-Roller-Straße",
          "addr:suburb": "Prenzlauer Berg",
          "check_date:opening_hours": "2025-01-23",
          "name": "Nadine Andres",
          "opening_hours:signed": "no",
          "shop": "massage",
          "website": "http://www.nadineandres.de"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10100682315",
    "sourceCategory": "beauty",
    "canonicalNameHint": "Kathrin Livland Raum für Körperarbeit",
    "displayName": "Kathrin Livland Raum für Körperarbeit",
    "addressLine1": "Heinrich-Roller-Straße 25",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5315833,
    "longitude": 13.4213006,
    "geohash": "u33dc7j4duz",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10100682315",
        "elementType": "node",
        "elementId": 10100682315,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "beauty",
        "distanceMetersFromAnchor": 147.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "25",
          "addr:postcode": "10405",
          "addr:street": "Heinrich-Roller-Straße",
          "addr:suburb": "Prenzlauer Berg",
          "level": "1",
          "massage": "shiatsu",
          "name": "Kathrin Livland Raum für Körperarbeit",
          "shop": "massage",
          "website": "https://www.raum-für-körperarbeit.de"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10296776056",
    "sourceCategory": "beauty",
    "canonicalNameHint": "medusa Berlin",
    "displayName": "medusa Berlin",
    "addressLine1": "Immanuelkirchstraße 35",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.533273,
    "longitude": 13.4223567,
    "geohash": "u33dc7mu7xf",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10296776056",
        "elementType": "node",
        "elementId": 10296776056,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "beauty",
        "distanceMetersFromAnchor": 155.3,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "35",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "beauty": "nails",
          "check_date:opening_hours": "2025-01-25",
          "name": "medusa Berlin",
          "opening_hours:signed": "no",
          "shop": "beauty",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/1976439635",
    "sourceCategory": "hairdresser",
    "canonicalNameHint": "Komm heim",
    "displayName": "Komm heim",
    "addressLine1": "Prenzlauer Berg neighborhood",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5325997,
    "longitude": 13.4235296,
    "geohash": "u33dc7q8wfm",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/1976439635",
        "elementType": "node",
        "elementId": 1976439635,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "hairdresser",
        "distanceMetersFromAnchor": 65.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "contact:phone": "+49 30 40525396",
          "contact:website": "http://kommheim.com",
          "female": "yes",
          "male": "yes",
          "name": "Komm heim",
          "opening_hours": "Mo 12:00-22:00; Tu-Fr 10:00-20:00",
          "operator": "Nico Ickert",
          "shop": "hairdresser",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/2978842477",
    "sourceCategory": "hairdresser",
    "canonicalNameHint": "Kiras Style",
    "displayName": "Kiras Style",
    "addressLine1": "Prenzlauer Allee 27a",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5328867,
    "longitude": 13.4209191,
    "geohash": "u33dc7kf4pf",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/2978842477",
        "elementType": "node",
        "elementId": 2978842477,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "hairdresser",
        "distanceMetersFromAnchor": 191.5,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "27a",
          "addr:postcode": "10405",
          "addr:street": "Prenzlauer Allee",
          "addr:suburb": "Prenzlauer Berg",
          "check_date": "2025-01-25",
          "contact:website": "https://www.kira-friseur.de/",
          "female": "yes",
          "male": "yes",
          "name": "Kiras Style",
          "opening_hours": "Mo-Fr 9:00-20:00;Sa 9:00-14:00",
          "phone": "+49 30 44 23 791",
          "shop": "hairdresser",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10015764559",
    "sourceCategory": "hairdresser",
    "canonicalNameHint": "Swag Hair Studio",
    "displayName": "Swag Hair Studio",
    "addressLine1": "Winsstraße 17",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5336915,
    "longitude": 13.4253726,
    "geohash": "u33dce2ncvg",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10015764559",
        "elementType": "node",
        "elementId": 10015764559,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "hairdresser",
        "distanceMetersFromAnchor": 230.6,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "17",
          "addr:street": "Winsstraße",
          "check_date": "2023-10-08",
          "currency:EUR": "yes",
          "female:signed": "no",
          "internet_access": "wlan",
          "internet_access:fee": "customers",
          "level": "0",
          "male:signed": "no",
          "name": "Swag Hair Studio",
          "opening_hours": "Mo-Fr 10:00-20:00; Sa 10:00-17:00",
          "payment:cards": "no",
          "payment:credit_cards": "no",
          "payment:debit_cards": "no",
          "phone": "+49 30 33900280",
          "shop": "hairdresser",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/6300989303",
    "sourceCategory": "service",
    "canonicalNameHint": "Marec Stürtz",
    "displayName": "Marec Stürtz",
    "addressLine1": "Winsstraße 10",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5325806,
    "longitude": 13.424351,
    "geohash": "u33dc7r26nc",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/6300989303",
        "elementType": "node",
        "elementId": 6300989303,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "service",
        "distanceMetersFromAnchor": 91.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "10",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "amenity": "dentist",
          "healthcare": "dentist",
          "name": "Marec Stürtz",
          "opening_hours": "Mo,We,Fr 08:00-13:00, Tu,Th 14:00-19:00, We,Fr 14:00-17:00, Tu,Th 09:00-13:00, Mo 14:00-20:00",
          "phone": "+49 30 473779510",
          "website": "https://www.doctolib.de/zahnmedizin/berlin/marec-stuertz",
          "wheelchair": "limited",
          "wheelchair:description": "Stufenloser Zugang gegeben. Räumlichkeiten teilweise klein."
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/3669814346",
    "sourceCategory": "service",
    "canonicalNameHint": "dka Anwaltskanzlei",
    "displayName": "dka Anwaltskanzlei",
    "addressLine1": "Immanuelkirchstraße 3-4",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5326051,
    "longitude": 13.4222246,
    "geohash": "u33dc7mb8e2",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/3669814346",
        "elementType": "node",
        "elementId": 3669814346,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "service",
        "distanceMetersFromAnchor": 101.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "3-4",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "contact:phone": "+49 30 4467920",
          "contact:website": "http://www.dka-kanzlei.de",
          "email": "kaleck@dka-kanzlei.de",
          "name": "dka Anwaltskanzlei",
          "office": "lawyer",
          "opening_hours": "Mo-Tu,Th 09:00-18:00; We,Fr 09:00-13:00"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10103295228",
    "sourceCategory": "service",
    "canonicalNameHint": "Jia-Li Chen",
    "displayName": "Jia-Li Chen",
    "addressLine1": "Immanuelkirchstraße 27",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5324113,
    "longitude": 13.4248843,
    "geohash": "u33dc7pxqrp",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10103295228",
        "elementType": "node",
        "elementId": 10103295228,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "service",
        "distanceMetersFromAnchor": 111.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "27",
          "addr:postcode": "10405",
          "addr:street": "Immanuelkirchstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "dentist",
          "healthcare": "dentist",
          "healthcare:speciality": "orthodontics",
          "level": "0",
          "name": "Jia-Li Chen",
          "opening_hours": "Mo 13:30-20:00; Tu 09:00-13:00,14:00-16:00; We,Th 09:00-13:00,14:00-18:30; Fr 09:00-12:00",
          "wheelchair": "limited"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/5222154373",
    "sourceCategory": "service",
    "canonicalNameHint": "Pizza Max",
    "displayName": "Pizza Max",
    "addressLine1": "Winsstraße 1",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5309326,
    "longitude": 13.4228282,
    "geohash": "u33dc6ynyed",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/5222154373",
        "elementType": "node",
        "elementId": 5222154373,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "service",
        "distanceMetersFromAnchor": 125.8,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:country": "DE",
          "addr:housenumber": "1",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "fast_food",
          "brand": "Pizza Max",
          "brand:wikidata": "Q114189329",
          "check_date:opening_hours": "2025-01-20",
          "contact:website": "https://www.pizzamax.de/berlin-mitte-prenzlauer-berg/",
          "cuisine": "pizza",
          "delivery": "yes",
          "diet:vegan": "no",
          "diet:vegetarian": "yes",
          "drive_through": "no",
          "name": "Pizza Max",
          "opening_hours": "Mo-Su 11:30-23:30",
          "opening_hours:signed": "no",
          "outdoor_seating": "no",
          "takeaway": "only",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/10100690570",
    "sourceCategory": "service",
    "canonicalNameHint": "Martin Jürgens",
    "displayName": "Martin Jürgens",
    "addressLine1": "Heinrich-Roller-Straße 23",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5313097,
    "longitude": 13.421709,
    "geohash": "u33dc7j3h3z",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/10100690570",
        "elementType": "node",
        "elementId": 10100690570,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "service",
        "distanceMetersFromAnchor": 136.7,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "23",
          "addr:postcode": "10405",
          "addr:street": "Heinrich-Roller-Straße",
          "addr:suburb": "Prenzlauer Berg",
          "amenity": "doctors",
          "check_date:opening_hours": "2025-01-23",
          "healthcare": "doctor",
          "healthcare:speciality": "general",
          "name": "Martin Jürgens",
          "opening_hours": "Mo-Tu 08:30-12:30,14:00-19:00; We 08:00-13:00; Th 08:00-15:00",
          "phone": "+49 30 4424783",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/5886792723",
    "sourceCategory": "ice_cream",
    "canonicalNameHint": "Early Bird",
    "displayName": "Early Bird",
    "addressLine1": "Winsstraße 68",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5320168,
    "longitude": 13.4233618,
    "geohash": "u33dc7nt5j8",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/5886792723",
        "elementType": "node",
        "elementId": 5886792723,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "ice_cream",
        "distanceMetersFromAnchor": 0.0,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "68",
          "addr:postcode": "10405",
          "addr:street": "Winsstraße",
          "amenity": "ice_cream",
          "check_date": "2025-01-25",
          "contact:instagram": "https://www.instagram.com/earlybirdgelato/",
          "name": "Early Bird",
          "opening_hours": "Mo-Fr 07:00-18:00; Sa,Su 08:00-19:00",
          "website": "https://earlybirdgelato.com",
          "wheelchair": "no"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/11809832579",
    "sourceCategory": "ice_cream",
    "canonicalNameHint": "vanille & marille Eismanufaktur",
    "displayName": "vanille & marille Eismanufaktur",
    "addressLine1": "Marienburger Straße 14",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5340308,
    "longitude": 13.4261178,
    "geohash": "u33dce88gjp",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/11809832579",
        "elementType": "node",
        "elementId": 11809832579,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "ice_cream",
        "distanceMetersFromAnchor": 291.4,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:city": "Berlin",
          "addr:housenumber": "14",
          "addr:postcode": "10405",
          "addr:street": "Marienburger Straße",
          "amenity": "ice_cream",
          "email": "hallo@vanille-marille.de",
          "name": "vanille & marille Eismanufaktur",
          "opening_hours": "Mar-Oct: Mo-Su 14:00-20:00",
          "phone": "+49 30 78954731",
          "website": "https://www.vanille-marille.de/"
        }
      }
    }
  },
  {
    "sourceName": "osm",
    "sourceRecordKey": "node/11637943714",
    "sourceCategory": "ice_cream",
    "canonicalNameHint": "Süßfein",
    "displayName": "Süßfein",
    "addressLine1": "Rykestraße 50",
    "locality": "Berlin",
    "region": "Berlin",
    "postalCode": "10405",
    "countryCode": "DE",
    "latitude": 52.5354775,
    "longitude": 13.4194527,
    "geohash": "u33dc7g9rfv",
    "capturedAt": "2026-05-22T00:00:00Z",
    "payload": {
      "source": {
        "dataset": "OpenStreetMap",
        "release": "Overpass snapshot 2026-05-22T14:40Z",
        "license": "ODbL-1.0",
        "attribution": "OpenStreetMap contributors",
        "recordId": "node/11637943714",
        "elementType": "node",
        "elementId": 11637943714,
        "sourceDatasets": [
          "OpenStreetMap"
        ],
        "sourceLicenses": [
          "ODbL-1.0"
        ]
      },
      "place": {
        "basicCategory": "ice_cream",
        "distanceMetersFromAnchor": 466.9,
        "sourceLocality": "Berlin",
        "osmTags": {
          "addr:housenumber": "50",
          "addr:street": "Rykestraße",
          "amenity": "ice_cream",
          "check_date": "2024-02-18",
          "level": "0",
          "name": "Süßfein",
          "wheelchair": "no"
        }
      }
    }
  }
] satisfies SeedSourceRecord[];

export function buildSeedDataset(): SeedSourceRecord[] {
  return WINSSTRASSE_STARTER_FIXTURE;
}
