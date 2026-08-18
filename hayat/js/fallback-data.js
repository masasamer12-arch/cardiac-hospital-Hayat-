window.CardiacFallbackData = {
  "./data/users.json": [
    {
      "id": "1",
      "name": " ماسة سامر ",
      "role": "doctor",
      "email": "adam@hospital.com",
      "phone": "0598001001"
    },
    {
      "id": "2",
      "name": " مريم زكارنة " ,
      "role": "nurse",
      "email": "lina@hospital.com",
      "phone": "0598001002"
    },
    {
      "id": "3",
      "name": "عبد الهادي محمود",
      "role": "receptionist",
      "email": "maya@hospital.com",
      "phone": "0598001003"
    }
  ],
  "./data/patients.json": [
    {
      "id": "1",
      "name": "أحمد خليل",
      "age": 58,
      "gender": "Male",
      "phone": "0599001001",
      "bloodType": "A+",
      "condition": "Stable",
      "diagnosis": "ارتفاع ضغط الدم",
      "heartRate": 78,
      "bloodPressure": "125/80",
      "oxygenLevel": 97,
      "doctorId": "1"
    },
    {
      "id": "2",
      "name": "رانيا منصور",
      "age": 64,
      "gender": "Female",
      "phone": "0599001002",
      "bloodType": "O-",
      "condition": "Needs Follow-up",
      "diagnosis": "رجفان أذيني",
      "heartRate": 104,
      "bloodPressure": "138/86",
      "oxygenLevel": 95,
      "doctorId": "1"
    },
    {
      "id": "3",
      "name": "محمد صالح",
      "age": 71,
      "gender": "Male",
      "phone": "0599001003",
      "bloodType": "B+",
      "condition": "Critical",
      "diagnosis": "فشل قلب احتقاني",
      "heartRate": 126,
      "bloodPressure": "168/98",
      "oxygenLevel": 89,
      "doctorId": "1"
    },
    {
      "id": "4",
      "name": "سارة قاسم",
      "age": 49,
      "gender": "Female",
      "phone": "0599001004",
      "bloodType": "AB+",
      "condition": "Stable",
      "diagnosis": "متابعة ما بعد القسطرة",
      "heartRate": 72,
      "bloodPressure": "118/76",
      "oxygenLevel": 98,
      "doctorId": "1"
    },
    {
      "id": "5",
      "name": "يوسف حمدان",
      "age": 62,
      "gender": "Male",
      "phone": "0599001005",
      "bloodType": "O+",
      "condition": "Needs Follow-up",
      "diagnosis": "مرض الشريان التاجي",
      "heartRate": 96,
      "bloodPressure": "145/92",
      "oxygenLevel": 94,
      "doctorId": "1"
    },
    {
      "id": "6",
      "name": "نور بركات",
      "age": 55,
      "gender": "Female",
      "phone": "0599001006",
      "bloodType": "A-",
      "condition": "Stable",
      "diagnosis": "مراقبة اضطراب النظم",
      "heartRate": 84,
      "bloodPressure": "122/78",
      "oxygenLevel": 97,
      "doctorId": "1"
    },
    {
      "id": "7",
      "name": "عمر نابلسي",
      "age": 68,
      "gender": "Male",
      "phone": "0599001007",
      "bloodType": "B-",
      "condition": "Critical",
      "diagnosis": "مراقبة متلازمة الشريان التاجي الحادة",
      "heartRate": 119,
      "bloodPressure": "162/96",
      "oxygenLevel": 91,
      "doctorId": "1"
    },
    {
      "id": "8",
      "name": "هدى سامي",
      "age": 45,
      "gender": "Female",
      "phone": "0599001008",
      "bloodType": "AB-",
      "condition": "Stable",
      "diagnosis": "تعافٍ بعد إصلاح الصمام",
      "heartRate": 69,
      "bloodPressure": "116/74",
      "oxygenLevel": 99,
      "doctorId": "1"
    },
    {
      "id": "9",
      "name": "كريم عودة",
      "age": 73,
      "gender": "Male",
      "phone": "0599001009",
      "bloodType": "O+",
      "condition": "Needs Follow-up",
      "diagnosis": "مراجعة إيقاع منظم ضربات القلب",
      "heartRate": 91,
      "bloodPressure": "136/84",
      "oxygenLevel": 96,
      "doctorId": "1"
    },
    {
      "id": "10",
      "name": "مريم داود",
      "age": 60,
      "gender": "Female",
      "phone": "0599001010",
      "bloodType": "A+",
      "condition": "Stable",
      "diagnosis": "متابعة ألم الصدر",
      "heartRate": 81,
      "bloodPressure": "128/82",
      "oxygenLevel": 98,
      "doctorId": "1"
    }
  ],
  "./data/appointments.json": [
    {
      "id": "1",
      "patientId": "1",
      "doctorId": "1",
      "date": "2026-08-12",
      "time": "09:00",
      "status": "Scheduled",
      "reason": "متابعة قلبية دورية"
    },
    {
      "id": "2",
      "patientId": "3",
      "doctorId": "1",
      "date": "2026-08-12",
      "time": "10:30",
      "status": "Urgent",
      "reason": "مراجعة مستوى الأكسجين"
    },
    {
      "id": "3",
      "patientId": "5",
      "doctorId": "1",
      "date": "2026-08-13",
      "time": "11:15",
      "status": "Scheduled",
      "reason": "تعديل الدواء"
    },
    {
      "id": "4",
      "patientId": "7",
      "doctorId": "1",
      "date": "2026-08-13",
      "time": "13:00",
      "status": "Urgent",
      "reason": "إعادة تقييم ضغط الدم"
    },
    {
      "id": "5",
      "patientId": "4",
      "doctorId": "1",
      "date": "2026-08-14",
      "time": "08:45",
      "status": "Completed",
      "reason": "فحص ما بعد الإجراء"
    },
    {
      "id": "6",
      "patientId": "9",
      "doctorId": "1",
      "date": "2026-08-15",
      "time": "12:00",
      "status": "Scheduled",
      "reason": "مراجعة تقرير منظم ضربات القلب"
    },
    {
      "id": "7",
      "patientId": "2",
      "doctorId": "1",
      "date": "2026-08-16",
      "time": "09:45",
      "status": "Scheduled",
      "reason": "متابعة مراقبة النبض"
    },
    {
      "id": "8",
      "patientId": "8",
      "doctorId": "1",
      "date": "2026-08-18",
      "time": "14:30",
      "status": "Completed",
      "reason": "مراجعة تقدم التعافي"
    }
  ]
};