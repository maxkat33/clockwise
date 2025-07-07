import pytz
import pycountry
import json
from datetime import datetime
from collections import defaultdict

output = []
search_keys = []
by_country = defaultdict(list)

with open('cities5000.txt', encoding='utf-8') as f:
    for line in f:
        parts = line.strip().split('\t')
        if len(parts) < 18:
            continue

        name = parts[1]
        lat = float(parts[4])
        lon = float(parts[5])
        country_code = parts[8]
        population = int(parts[14])
        timezone = parts[17]

        # Only add cities with population >= 100,000
        if population < 100000:
            continue

        by_country[country_code].append({
            "city": name,
            "population": population,
            "timezone": timezone,
            "lat": lat,
            "lon": lon
        })

for country_code, cities in by_country.items():
    try:
        country_name = pycountry.countries.get(alpha_2=country_code).name
    except:
        country_name = country_code

    # Sort cities by population descending
    cities.sort(key=lambda x: x["population"], reverse=True)

    # Take up to 10 cities only (may be fewer)
    top_cities = cities[:10]

    for city in top_cities:
        try:
            tz = pytz.timezone(city["timezone"])
            offset = tz.utcoffset(datetime.utcnow())
            utc_offset = offset.total_seconds() / 3600 if offset else 0.0
        except Exception:
            utc_offset = 0.0

        search_key = f"{city['city']}, {country_name}".lower()

        output.append({
            "city": city["city"],
            "country": country_name,
            "timezone": city["timezone"],
            "utcOffset": utc_offset,
            "lat": city["lat"],
            "lon": city["lon"],
            "searchKey": search_key
        })
        search_keys.append(search_key)

with open('cities_filtered.json', 'w', encoding='utf-8') as out:
    json.dump(output, out, indent=2)

with open('search_keys.json', 'w', encoding='utf-8') as out_keys:
    json.dump(search_keys, out_keys, indent=2)
