# Belarus Yandex Panorama Coordinates Dataset

## Abstract
This repository presents a comprehensive dataset comprising geographical coordinates of Yandex Street View panoramas across the administrative centers of the Republic of Belarus. Furthermore, it provides the requisite data extraction and transformation utilities employed to compile this dataset. The collection aims to facilitate geospatial analysis, the development of location-based gamified applications, and geographic information system (GIS) modeling.

## Directory Structure
```text
.
├── converter.py
├── geojson
│   ├── brest.geojson
│   ├── gomel.geojson
│   ├── grodno.geojson
│   ├── minsk.geojson
│   ├── mogilev.geojson
│   └── vitebsk.geojson
├── json
│   ├── brest.json
│   ├── gomel.json
│   ├── grodno.json
│   ├── minsk.json
│   ├── mogilev.json
│   └── vitebsk.json
├── LICENSE
├── README.md
└── scraper.js
```

## Dataset Overview and Spatial Distribution
The dataset presented herein was systematically acquired on **June 18, 2026**. It aggregates a total of 258,443 precise geospatial coordinate points across six major administrative subdivisions. The proportional distribution of panoramic points is illustrated below:

<img width="500" alt="image" src="https://github.com/user-attachments/assets/d4bd56d3-8765-4af9-aaff-2eeea9d8a9ee" />


| Administrative Division | Coordinate Points | Proportion |
|-------------------------|-------------------|------------|
| Minsk                   | 145,040           | 56.12%     |
| Gomel                   | 36,256            | 14.03%     |
| Brest                   | 21,593            | 8.35%      |
| Grodno                  | 19,923            | 7.71%      |
| Mogilev                 | 19,279            | 7.46%      |
| Vitebsk                 | 16,352            | 6.33%      |

## Methodology


### 1. Data Acquisition
The data acquisition protocol leverages a concurrent, queue-based traversal algorithm implemented in JavaScript (`scraper.js`). The Yandex Maps panoramas are structured as an interconnected spatial graph. The scraping utility initializes with a seed Object ID (`oid`), retrieves the corresponding panoramic metadata via the internal Yandex API, and recursively enqueues contiguous panoramic nodes extrapolated from the topological properties.

To optimize extraction velocity and mitigate latency, the script executes asynchronous HTTP requests employing batched concurrency. The extracted multidimensional coordinates are subsequently serialized into a `Blob` and exported to local storage as a JSON array.

**Execution Duration:** The temporal overhead required to execute a complete urban graph traversal scales non-linearly, ranging from approximately **20 minutes to 2 hours**. This variance is strictly governed by network throughput, API responsiveness, rate-limiting constraints, and the absolute spatial density of the targeted municipality's panoramic nodes.

### 2. Coordinate Transformation
The extracted raw spatial data represents point locations in dynamic array configurations. The Python utility (`converter.py`) is designed specifically to convert these raw data arrays into the standardized GeoJSON format (`RFC 7946`). This algorithmic conversion yields a `FeatureCollection` composed of `Point` geometries, ensuring native compatibility with standard GIS rendering engines and spatial databases.


## Usage Guidelines

### Executing the Data Scraper

1. Navigate to the Yandex Maps web interface.
2. Enable the Panorama mode and select a targeted spatial location.
3. Initialize the browser's Developer Tools and navigate to the Network inspector.
4. Isolate the network request directed to `api-maps.yandex.ru` (ensure the response format is JSON).
5. Extract the seed `oid` parameter from the request URL.
6. Open the browser Console.
7. Copy the entire source code from `scraper.js` and paste it into the console.
8. Insert the extracted `oid` into the function call at the end of the script:

```javascript
scanEntireCityToBlobFast('YOUR_EXTRACTED_OID', 150000);
```

9. Press Enter to execute the script and initiate the automated graph traversal.

### Executing the GeoJSON Conversion

The conversion tool is strictly used to convert the raw JSON data extracted by the scraper into valid GeoJSON.

```bash
python converter.py input.json output.geojson
```
