import json
import sys


def convert_to_geojson(input_path, output_path):
    try:
        with open(input_path, "r", encoding="utf-8") as f:
            coords_list = json.load(f)

        features = []

        for item in coords_list:
            if isinstance(item, dict):
                lat = item.get("lat")
                lon = item.get("lon")
                alt = item.get("alt", 0)
            elif isinstance(item, (list, tuple)) and len(item) >= 2:
                lon = item[0]
                lat = item[1]
                alt = item[2] if len(item) > 2 else 0
            else:
                continue

            feature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(lon), float(lat), float(alt)],
                },
            }
            features.append(feature)

        geojson_data = {"type": "FeatureCollection", "features": features}

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=2)

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)

    convert_to_geojson(sys.argv[1], sys.argv[2])