import csv
from pymongo import MongoClient
import os
import sys
import datetime

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["lifeskill"]
collection = db["participants"]

# Get CSV file path from command line argument or use default
if len(sys.argv) > 1:
    csv_path = sys.argv[1]
else:
    csv_path = os.path.join(os.path.dirname(__file__), "app", "routes", "data", "participants.csv")

def clean_row(row):
    # Basic cleaning: strip whitespace from keys and values
    cleaned = {}
    for k, v in row.items():
        key = k.strip() if isinstance(k, str) else k
        value = v.strip() if isinstance(v, str) else v
        cleaned[key] = value
    return cleaned

def validate_row(row):
    # Normalize field names if needed (optional)
    if 'submitted_date' in row:
        row['submitted date'] = row.pop('submitted_date')

    # Define required fields
    required_fields = ['event_id', 'id', 'Name', 'UserID', 'Email', 'submitted date', 'feedback', 'suggestions', 'rating', 'status']
    for field in required_fields:
        if field not in row or row[field] == '':
            raise ValueError(f"Missing required field: {field}")

    # 🔽 🔽 🔽 TYPE CONVERSIONS START HERE
    try:
        row['event_id'] = int(row['event_id'])
        row['id'] = int(row['id'])
        row['rating'] = int(row['rating'])
    except ValueError:
        raise ValueError(f"Invalid numeric value in row: event_id={row['event_id']}, id={row['id']}, rating={row['rating']}")
    # 🔼 🔼 🔼 TYPE CONVERSIONS END HERE

    # Date validation
    try:
        datetime.datetime.strptime(row['submitted date'], '%d-%b-%y')
    except ValueError:
        raise ValueError(f"Invalid date format: {row['submitted date']} (Expected: dd-Mon-yy)")


    # Validate rating as integer
    try:
        row['rating'] = int(row['rating'])
    except ValueError:
        raise ValueError(f"Invalid rating value: {row['rating']}")
    return row

# Read and insert data with error handling and cleaning
documents = []
with open(csv_path, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for i, row in enumerate(reader, start=1):
        try:
            cleaned_row = clean_row(row)
            validate_row(cleaned_row)
            # Debug print to check row content
            print(f"Row {i} after cleaning and validation: {cleaned_row}")
            documents.append(cleaned_row)
        except Exception as e:
            print(f"Error processing row {i}: {e}")

# Clear existing data (optional)
collection.delete_many({})
if documents:
    collection.insert_many(documents)

print("CSV data loaded into MongoDB successfully.")
