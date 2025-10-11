from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["lifeskill"]   # change to your DB name

# Drop existing collection (optional - for a clean seed)
db.schools.drop()

# School data with zones
schools_data = [
    {
        "school_name": "Jaffna Central College",
        "zone": "Jaffna",
        "district": "Jaffna"
    },
    {
        "school_name": "St. John's College",
        "zone": "Jaffna",
        "district": "Jaffna"
    },
    {
        "school_name": "Vembadi Girls' High School",
        "zone": "Jaffna",
        "district": "Jaffna"
    },
    {
        "school_name": "Hindu Ladies' College",
        "zone": "Jaffna",
        "district": "Jaffna"
    },
    {
        "school_name": "Hartley College",
        "zone": "Point Pedro",
        "district": "Jaffna"
    },
    {
        "school_name": "Methodist Girls' High School",
        "zone": "Point Pedro",
        "district": "Jaffna"
    },
    {
        "school_name": "Chavakachcheri Hindu College",
        "zone": "Thenmaradchi",
        "district": "Jaffna"
    },
    {
        "school_name": "Karaveddy Hindu College",
        "zone": "Vadamaradchi",
        "district": "Jaffna"
    },
    {
        "school_name": "Kopay Christian College",
        "zone": "Nallur",
        "district": "Jaffna"
    },
    {
        "school_name": "Union College Tellippalai",
        "zone": "Valikamam",
        "district": "Jaffna"
    }
]

# Insert into MongoDB
db.schools.insert_many(schools_data)

print("✅ Schools collection seeded successfully!")
