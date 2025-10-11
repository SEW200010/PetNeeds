from flask import Flask
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Update if needed
db = client["lifeskill"]  
collection = db["faculties"]

@app.route("/seed/faculties", methods=["GET"])
def seed_faculties():
    faculties = [
        {
            "university_name": "University of Colombo",
            "faculty_name": "Faculty of Engineering",
            "dean": "Prof. S. Fernando",
            "contact": {
                "email": "engineering@cmb.ac.lk",
                "phone": "0112123456"
            },
            "created_at": datetime.utcnow()
        },
        {
            "university_name": "University of Colombo",
            "faculty_name": "Faculty of Science",
            "dean": "Prof. K. Perera",
            "contact": {
                "email": "science@cmb.ac.lk",
                "phone": "0112234567"
            },
            "created_at": datetime.utcnow()
        },
        {
            "university_name": "University of Peradeniya",
            "faculty_name": "Faculty of Arts",
            "dean": "Prof. R. Silva",
            "contact": {
                "email": "arts@pdn.ac.lk",
                "phone": "0812345678"
            },
            "created_at": datetime.utcnow()
        },
        {
            "university_name": "University of Peradeniya",
            "faculty_name": "Faculty of Medicine",
            "dean": "Prof. M. Jayasinghe",
            "contact": {
                "email": "medicine@pdn.ac.lk",
                "phone": "0812233445"
            },
            "created_at": datetime.utcnow()
        },
        {
            "university_name": "University of Jaffna",
            "faculty_name": "Faculty of Management Studies",
            "dean": "Prof. N. Kumar",
            "contact": {
                "email": "management@jfn.ac.lk",
                "phone": "0212223344"
            },
            "created_at": datetime.utcnow()
        },
        {
            "university_name": "University of Jaffna",
            "faculty_name": "Faculty of Science",
            "dean": "Prof. V. Suresh",
            "contact": {
                "email": "science@jfn.ac.lk",
                "phone": "0212233445"
            },
            "created_at": datetime.utcnow()
        }
    ]

    result = collection.insert_many(faculties)
    return {"message": f"Inserted {len(result.inserted_ids)} faculties into the database."}, 201


