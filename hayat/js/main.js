(function () {
  const routeAccess = {
    dashboard: ["doctor"],
    patients: ["doctor"],
    "patient-details": ["doctor"],
    vitals: ["doctor"],
    appointments: ["doctor"],
    reports: ["doctor"]
  };

  const navItems = [
    {
      page: "dashboard",
      label: "لوحة التحكم",
      href: "dashboard.html",
      icon: "layout-dashboard",
      roles: ["doctor"]
    },
    {
      page: "patients",
      label: "المرضى",
      href: "patients.html",
      icon: "users-round",
      roles: ["doctor"]
    },
    {
      page: "vitals",
      label: "العلامات الحيوية",
      href: "vitals.html",
      icon: "activity",
      roles: ["doctor"]
    },
    {
      page: "appointments",
      label: "المواعيد",
      href: "appointments.html",
      icon: "calendar-clock",
      roles: ["doctor"]
    },
    {
      page: "reports",
      label: "التقارير",
      href: "reports.html",
      icon: "bar-chart-3",
      roles: ["doctor"]
    }
  ];

  const pageTitles = {
    dashboard: "لوحة التحكم",
    patients: "المرضى",
    "patient-details": "تفاصيل المريض",
    vitals: "العلامات الحيوية",
    appointments: "المواعيد",
    reports: "التقارير"
  };

  const conditionLabels = {
    Stable: "مستقر",
    Critical: "حرج",
    "Needs Follow-up": "يحتاج متابعة"
  };

  const appointmentStatusLabels = {
    Scheduled: "مجدول",
    Urgent: "عاجل",
    Completed: "مكتمل"
  };

  const readingStatusLabels = {
    Normal: "طبيعي",
    Warning: "تحذير",
    Critical: "حرج"
  };

  const genderLabels = {
    Male: "ذكر",
    Female: "أنثى"
  };

  const reasonLabels = {
    "Routine cardiac follow-up": "متابعة قلبية دورية",
    "Oxygen level review": "مراجعة مستوى الأكسجين",
    "Medication adjustment": "تعديل الدواء",
    "Blood pressure reassessment": "إعادة تقييم ضغط الدم",
    "Post procedure check": "فحص ما بعد الإجراء",
    "Pacemaker report review": "مراجعة تقرير منظم ضربات القلب",
    "Rhythm monitoring follow-up": "متابعة مراقبة النبض",
    "Recovery progress review": "مراجعة تقدم التعافي"
  };

  const diagnosisLabels = {
    Hypertension: "ارتفاع ضغط الدم",
    "Atrial fibrillation": "رجفان أذيني",
    "Congestive heart failure": "فشل قلب احتقاني",
    "Post angioplasty follow-up": "متابعة ما بعد القسطرة",
    "Coronary artery disease": "مرض الشريان التاجي",
    "Arrhythmia monitoring": "مراقبة اضطراب النظم",
    "Acute coronary syndrome observation": "مراقبة متلازمة الشريان التاجي الحادة",
    "Valve repair recovery": "تعافٍ بعد إصلاح الصمام",
    "Pacemaker rhythm review": "مراجعة إيقاع منظم ضربات القلب",
    "Chest pain follow-up": "متابعة ألم الصدر"
  };

  const localKeys = {
    appointments: "localAppointments",
    vitals: "localVitals",
    notifications: "localNotifications",
    caseAlerts: "localCaseAlerts"
  };

  let readyResolver;
  const readyPromise = new Promise(function (resolve) {
    readyResolver = resolve;
  });

  function onReady(callback) {
    readyPromise.then(callback);
  }

  function getPageName() {
    return document.body.dataset.page || "";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchJson(path, message) {
    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(message || "Failed to load data");
      }

      return response.json();
    } catch (error) {
      const fallbackData = window.CardiacFallbackData && window.CardiacFallbackData[path];

      if (fallbackData) {
        console.warn("Using fallback data because Fetch could not load " + path, error);
        return JSON.parse(JSON.stringify(fallbackData));
      }

      throw error;
    }
  }

  async function getPatients() {
    return fetchJson("./data/patients.json", "فشل تحميل بيانات المرضى");
  }

  async function getAppointments() {
    return fetchJson("./data/appointments.json", "فشل تحميل بيانات المواعيد");
  }

  async function getUsers() {
    return fetchJson("./data/users.json", "فشل تحميل بيانات المستخدمين");
  }

  async function getCurrentUser(role) {
    try {
      const users = await getUsers();
      return users.find(function (user) {
        return user.role === role;
      }) || getFallbackUser(role);
    } catch (error) {
      console.error(error);
      return getFallbackUser(role);
    }
  }

  function getFallbackUser(role) {
    return {
      id: "",
      name: CardiacAuth.roleLabels[role] || "مستخدم حالي",
      role: role || "user",
      email: "",
      phone: ""
    };
  }

  function readArray(key) {
    try {
      const value = localStorage.getItem(key);
      const parsed = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function writeArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getLocalAppointments() {
    return readArray(localKeys.appointments);
  }

  function saveLocalAppointments(appointments) {
    writeArray(localKeys.appointments, appointments);
  }

  function getLocalVitals() {
    return readArray(localKeys.vitals);
  }

  function saveLocalVitals(vitals) {
    writeArray(localKeys.vitals, vitals);
  }

  function getLocalCaseAlerts() {
    return readArray(localKeys.caseAlerts);
  }

  function saveLocalCaseAlerts(caseAlerts) {
    writeArray(localKeys.caseAlerts, caseAlerts);
  }

  function getStoredNotifications() {
    return readArray(localKeys.notifications);
  }

  function saveStoredNotifications(notifications) {
    writeArray(localKeys.notifications, notifications);
    window.dispatchEvent(new CustomEvent("cardiac-notifications-updated"));
  }

  function getNotificationRecipients(senderRole, recipientRoles) {
    const requestedRoles = recipientRoles && recipientRoles.length
      ? recipientRoles
      : CardiacAuth.validRoles;

    return requestedRoles.filter(function (role) {
      return role !== senderRole;
    });
  }

  function addNotification(notification) {
    const recipientRoles = getNotificationRecipients(notification.createdByRole, notification.recipientRoles);

    if (!recipientRoles.length) {
      return null;
    }

    const nextNotification = {
      id: "notification-" + Date.now() + "-" + Math.random().toString(16).slice(2),
      title: notification.title || "إشعار جديد",
      message: notification.message || "",
      type: notification.type || "info",
      icon: notification.icon || "bell",
      link: notification.link || "",
      recipientRoles,
      createdByRole: notification.createdByRole || "",
      createdByName: notification.createdByName || "",
      createdAt: new Date().toISOString(),
      readBy: []
    };

    const notifications = getStoredNotifications();
    saveStoredNotifications([nextNotification].concat(notifications).slice(0, 80));
    return nextNotification;
  }

  function getNotificationsForRole(role) {
    return getStoredNotifications()
      .filter(function (notification) {
        return Array.isArray(notification.recipientRoles) && notification.recipientRoles.includes(role);
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
  }

  function getUnreadNotificationCount(role) {
    return getNotificationsForRole(role).filter(function (notification) {
      return !Array.isArray(notification.readBy) || !notification.readBy.includes(role);
    }).length;
  }

  function markNotificationsRead(role) {
    const notifications = getStoredNotifications().map(function (notification) {
      if (!Array.isArray(notification.recipientRoles) || !notification.recipientRoles.includes(role)) {
        return notification;
      }

      const readBy = Array.isArray(notification.readBy) ? notification.readBy : [];

      if (readBy.includes(role)) {
        return notification;
      }

      return {
        ...notification,
        readBy: readBy.concat(role)
      };
    });

    saveStoredNotifications(notifications);
  }

  async function getAppointmentsWithPatients() {
    const patients = await getPatients();
    const appointments = await getAppointments();
    const localAppointments = getLocalAppointments();
    const allAppointments = appointments
      .map(function (appointment) {
        return { ...appointment, isLocal: false };
      })
      .concat(localAppointments.map(function (appointment) {
        return { ...appointment, isLocal: true };
      }));

    return allAppointments
      .map(function (appointment) {
        return {
          ...appointment,
          patient: patients.find(function (patient) {
            return patient.id === appointment.patientId;
          })
        };
      })
      .sort(sortByAppointmentDate);
  }

  async function getVitalRecords() {
    const patients = await getPatients();
    const baseVitals = patients.map(function (patient) {
      return {
        id: "base-" + patient.id,
        patientId: patient.id,
        patientName: patient.name,
        heartRate: patient.heartRate,
        bloodPressure: patient.bloodPressure,
        oxygenLevel: patient.oxygenLevel,
        condition: patient.condition,
        recordedAt: "2026-08-12 08:00",
        isLocal: false
      };
    });

    const localVitals = getLocalVitals().map(function (record) {
      const patient = patients.find(function (item) {
        return item.id === record.patientId;
      });

      return {
        ...record,
        patientName: patient ? patient.name : "مريض غير معروف",
        condition: patient ? patient.condition : "Needs Follow-up",
        isLocal: true
      };
    });

    return baseVitals.concat(localVitals).sort(function (a, b) {
      return String(b.recordedAt || "").localeCompare(String(a.recordedAt || ""));
    });
  }

  function sortByAppointmentDate(a, b) {
    return String(a.date + " " + a.time).localeCompare(String(b.date + " " + b.time));
  }

  function todayIso() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function isUpcomingAppointment(appointment) {
    return appointment.date >= todayIso() && appointment.status !== "Completed";
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function formatDateTime(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function conditionBadge(condition) {
    const classes = {
      Stable: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Critical: "bg-rose-50 text-rose-700 ring-rose-200",
      "Needs Follow-up": "bg-amber-50 text-amber-700 ring-amber-200"
    };

    return badge(translateCondition(condition), classes[condition] || "bg-slate-50 text-slate-700 ring-slate-200");
  }

  function appointmentBadge(status) {
    const classes = {
      Scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
      Urgent: "bg-rose-50 text-rose-700 ring-rose-200",
      Completed: "bg-slate-100 text-slate-700 ring-slate-200"
    };

    return badge(translateAppointmentStatus(status), classes[status] || "bg-slate-50 text-slate-700 ring-slate-200");
  }

  function readingBadge(status) {
    const classes = {
      Normal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Warning: "bg-amber-50 text-amber-700 ring-amber-200",
      Critical: "bg-rose-50 text-rose-700 ring-rose-200"
    };

    return badge(translateReadingStatus(status), classes[status] || "bg-slate-50 text-slate-700 ring-slate-200");
  }

  function translateCondition(condition) {
    return conditionLabels[condition] || condition || "";
  }

  function translateAppointmentStatus(status) {
    return appointmentStatusLabels[status] || status || "";
  }

  function translateReadingStatus(status) {
    return readingStatusLabels[status] || status || "";
  }

  function translateGender(gender) {
    return genderLabels[gender] || gender || "";
  }

  function translateReason(reason) {
    return reasonLabels[reason] || reason || "";
  }

  function translateDiagnosis(diagnosis) {
    return diagnosisLabels[diagnosis] || diagnosis || "";
  }

  function badge(text, className) {
    return '<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ' + className + '">' + escapeHtml(text) + "</span>";
  }

  function getReadingStatus(record) {
    const heartRate = Number(record.heartRate);
    const oxygenLevel = Number(record.oxygenLevel);
    const systolic = Number(String(record.bloodPressure || "").split("/")[0]);

    if (heartRate >= 120 || heartRate < 50 || oxygenLevel < 92 || systolic >= 160) {
      return "Critical";
    }

    if (heartRate > 100 || heartRate < 60 || oxygenLevel < 95 || systolic >= 140) {
      return "Warning";
    }

    return "Normal";
  }

  function calculatePatientStats(patients) {
    return {
      total: patients.length,
      stable: patients.filter(function (patient) {
        return patient.condition === "Stable";
      }).length,
      critical: patients.filter(function (patient) {
        return patient.condition === "Critical";
      }).length,
      followUp: patients.filter(function (patient) {
        return patient.condition === "Needs Follow-up";
      }).length,
      averageHeartRate: average(patients.map(function (patient) {
        return Number(patient.heartRate);
      })),
      averageOxygenLevel: average(patients.map(function (patient) {
        return Number(patient.oxygenLevel);
      }))
    };
  }

  function average(numbers) {
    const validNumbers = numbers.filter(function (number) {
      return Number.isFinite(number);
    });

    if (!validNumbers.length) {
      return 0;
    }

    return Math.round(validNumbers.reduce(function (sum, number) {
      return sum + number;
    }, 0) / validNumbers.length);
  }

  function showLoading(container, message) {
    container.innerHTML = [
      '<div class="flex min-h-[280px] items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">',
      '<div class="flex items-center gap-3">',
      '<span class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-rose-600"></span>',
      '<span class="font-medium">' + escapeHtml(message || "جاري تحميل البيانات...") + "</span>",
      "</div>",
      "</div>"
    ].join("");
  }

  function showError(container, message) {
    container.innerHTML = [
      '<div class="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-700">',
      '<div class="flex items-center gap-3">',
      '<i data-lucide="circle-alert" class="h-5 w-5"></i>',
      '<p class="font-semibold">' + escapeHtml(message || "فشل تحميل البيانات") + "</p>",
      "</div>",
      "</div>"
    ].join("");
    renderIcons();
  }

  function emptyState(title, text) {
    return [
      '<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">',
      '<div class="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-500">',
      '<i data-lucide="inbox" class="h-5 w-5"></i>',
      "</div>",
      '<h3 class="mt-3 text-sm font-semibold text-slate-900">' + escapeHtml(title) + "</h3>",
      '<p class="mt-1 text-sm text-slate-500">' + escapeHtml(text || "") + "</p>",
      "</div>"
    ].join("");
  }

  function pageHeader(title, description, actionsHtml) {
    return [
      '<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">',
      "<div>",
      '<p class="text-sm font-semibold text-rose-700">حياة</p>',
      '<h1 class="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">' + escapeHtml(title) + "</h1>",
      description ? '<p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">' + escapeHtml(description) + "</p>" : "",
      "</div>",
      actionsHtml ? '<div class="flex shrink-0 flex-wrap gap-2">' + actionsHtml + "</div>" : "",
      "</div>"
    ].join("");
  }

  function statCard(label, value, iconName, tone, note) {
    const tones = {
      teal: "bg-teal-50 text-teal-700",
      emerald: "bg-emerald-50 text-emerald-700",
      rose: "bg-rose-50 text-rose-700",
      amber: "bg-amber-50 text-amber-700",
      sky: "bg-sky-50 text-sky-700",
      slate: "bg-slate-100 text-slate-700"
    };

    return [
      '<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">',
      '<div class="flex items-start justify-between gap-4">',
      "<div>",
      '<p class="text-sm font-medium text-slate-500">' + escapeHtml(label) + "</p>",
      '<p class="mt-3 text-3xl font-bold text-slate-950">' + escapeHtml(value) + "</p>",
      note ? '<p class="mt-2 text-xs font-medium text-slate-500">' + escapeHtml(note) + "</p>" : "",
      "</div>",
      '<div class="flex h-11 w-11 items-center justify-center rounded-lg ' + (tones[tone] || tones.slate) + '">',
      '<i data-lucide="' + iconName + '" class="h-5 w-5"></i>',
      "</div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function tableShell(headers, bodyHtml) {
    return [
      '<div class="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">',
      '<table class="min-w-full divide-y divide-slate-200 text-right text-sm">',
      '<thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">',
      "<tr>",
      headers.map(function (header) {
        return '<th class="whitespace-nowrap px-4 py-3">' + escapeHtml(header) + "</th>";
      }).join(""),
      "</tr>",
      "</thead>",
      '<tbody class="divide-y divide-slate-100 bg-white">',
      bodyHtml,
      "</tbody>",
      "</table>",
      "</div>"
    ].join("");
  }

  function sectionCard(title, contentHtml, subtitle) {
    return [
      '<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">',
      '<div class="mb-4 flex items-start justify-between gap-4">',
      "<div>",
      '<h2 class="text-base font-semibold text-slate-950">' + escapeHtml(title) + "</h2>",
      subtitle ? '<p class="mt-1 text-sm text-slate-500">' + escapeHtml(subtitle) + "</p>" : "",
      "</div>",
      "</div>",
      contentHtml,
      "</section>"
    ].join("");
  }

  function compactPatientList(patients, options) {
    if (!patients.length) {
      return emptyState("لا يوجد مرضى", "لا توجد سجلات مرضى مطابقة.");
    }

    const showCondition = !options || options.showCondition !== false;

    return [
      '<div class="divide-y divide-slate-100">',
      patients.map(function (patient) {
        return [
          '<a href="patient-details.html?id=' + encodeURIComponent(patient.id) + '" class="flex items-center justify-between gap-4 py-3 transition hover:bg-slate-50">',
          '<span class="min-w-0">',
          '<span class="block truncate text-sm font-semibold text-slate-900">' + escapeHtml(patient.name) + "</span>",
          '<span class="block text-xs text-slate-500">' + escapeHtml(patient.age) + " سنة، " + escapeHtml(translateGender(patient.gender)) + "</span>",
          "</span>",
          showCondition ? conditionBadge(patient.condition) : '<span class="text-xs font-medium text-slate-500">' + escapeHtml(patient.phone) + "</span>",
          "</a>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function compactAppointmentList(appointments) {
    if (!appointments.length) {
      return emptyState("لا توجد مواعيد", "لا توجد مواعيد مطابقة لهذا العرض.");
    }

    return [
      '<div class="divide-y divide-slate-100">',
      appointments.map(function (appointment) {
        const patientName = appointment.patient ? appointment.patient.name : "مريض غير معروف";
        return [
          '<div class="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">',
          "<div>",
          '<p class="text-sm font-semibold text-slate-900">' + escapeHtml(patientName) + "</p>",
          '<p class="text-xs text-slate-500">' + escapeHtml(formatDate(appointment.date)) + " - " + escapeHtml(appointment.time) + "</p>",
          '<p class="mt-1 text-xs text-slate-500">' + escapeHtml(translateReason(appointment.reason)) + "</p>",
          "</div>",
          appointmentBadge(appointment.status),
          "</div>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function getInitials(name) {
    return String(name || "مستخدم")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  function renderNotifications(role) {
    const items = getNotificationsForRole(role).slice(0, 8);
    const unreadCount = getUnreadNotificationCount(role);
    const listHtml = items.length
      ? items.map(function (item) {
        const isUnread = !Array.isArray(item.readBy) || !item.readBy.includes(role);
        const linkStart = item.link ? '<a href="' + item.link + '" class="block">' : '<div>';
        const linkEnd = item.link ? "</a>" : "</div>";

        return [
          linkStart,
          '<div class="flex gap-3 rounded-lg p-2 transition hover:bg-slate-50 ' + (isUnread ? "bg-rose-50/60" : "") + '">',
          '<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700">',
          '<i data-lucide="' + item.icon + '" class="h-4 w-4"></i>',
          "</div>",
          '<div class="min-w-0 flex-1">',
          '<div class="flex items-start justify-between gap-2">',
          '<p class="text-sm font-semibold text-slate-950">' + escapeHtml(item.title) + "</p>",
          isUnread ? '<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500"></span>' : "",
          "</div>",
          '<p class="mt-1 text-xs leading-5 text-slate-500">' + escapeHtml(item.message) + "</p>",
          '<p class="mt-1 text-[11px] font-medium text-slate-400">' + escapeHtml(formatDateTime(item.createdAt)) + "</p>",
          "</div>",
          "</div>",
          linkEnd
        ].join("");
      }).join("")
      : [
        '<div class="rounded-lg border border-dashed border-slate-200 p-4 text-center">',
        '<p class="text-sm font-semibold text-slate-700">لا توجد إشعارات</p>',
        '<p class="mt-1 text-xs text-slate-500">ستظهر هنا تنبيهات الحالات والمواعيد والقراءات الحيوية.</p>',
        "</div>"
      ].join("");

    return [
      '<div id="notificationsMenu" class="absolute left-0 top-12 z-50 hidden w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-3 text-right shadow-xl shadow-slate-200/80">',
      '<div class="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">',
      '<p class="text-sm font-bold text-slate-950">الإشعارات</p>',
      '<button id="markNotificationsRead" type="button" class="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">تعليم الكل كمقروء</button>',
      "</div>",
      '<p class="mb-2 text-xs text-slate-500">غير مقروء: ' + unreadCount + "</p>",
      '<div id="notificationsList" class="max-h-80 space-y-2 overflow-y-auto">',
      listHtml,
      "</div>",
      "</div>"
    ].join("");
  }

  function refreshNotificationsUi(role) {
    const wrapper = document.getElementById("notificationsWrapper");

    if (!wrapper) {
      return;
    }

    const unreadCount = getUnreadNotificationCount(role);
    wrapper.innerHTML = [
      '<button id="notificationsButton" type="button" title="الإشعارات" aria-expanded="false" class="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">',
      '<i data-lucide="bell" class="h-5 w-5"></i>',
      unreadCount ? '<span class="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">' + unreadCount + "</span>" : "",
      "</button>",
      renderNotifications(role)
    ].join("");

    bindNotificationsEvents(role);
    renderIcons();
  }

  function renderLayout(role, user, page) {
    const shell = document.getElementById("app-shell");
    const availableNav = navItems.filter(function (item) {
      return item.roles.includes(role);
    });

    shell.innerHTML = [
      '<div class="min-h-screen">',
      '<div id="sidebarBackdrop" class="fixed inset-0 z-30 hidden bg-slate-900/30 lg:hidden"></div>',
      '<aside id="sidebar" class="fixed inset-y-0 right-0 z-40 flex w-72 translate-x-full flex-col border-l border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition-transform duration-200 lg:translate-x-0 lg:shadow-none">',
      '<div class="flex h-16 items-center gap-3 border-b border-slate-200 px-5">',
      '<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow shadow-rose-200">',
      '<i data-lucide="heart-pulse" class="h-5 w-5"></i>',
      "</div>",
      "<div>",
      '<p class="text-sm font-bold text-slate-950">حياة</p>',
      '<p class="text-xs text-slate-500">نظام متابعة القلب</p>',
      "</div>",
      "</div>",
      '<nav class="flex-1 space-y-1 px-3 py-4">',
      availableNav.map(function (item) {
        const active = item.page === page;
        return [
          '<a href="' + item.href + '" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ' + (active ? 'bg-rose-50 text-rose-700' : "text-slate-600 hover:bg-slate-50 hover:text-slate-950") + '">',
          '<i data-lucide="' + item.icon + '" class="h-4 w-4"></i>',
          escapeHtml(item.label),
          "</a>"
        ].join("");
      }).join(""),
      "</nav>",
      '<div class="border-t border-slate-200 p-3">',
      '<button data-logout class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">',
      '<i data-lucide="log-out" class="h-4 w-4"></i>',
      "تسجيل الخروج",
      "</button>",
      "</div>",
      "</aside>",
      '<div class="lg:pr-72">',
      '<header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">',
      '<div class="flex items-center gap-3">',
      '<button id="menuButton" type="button" title="فتح القائمة" class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden">',
      '<i data-lucide="menu" class="h-5 w-5"></i>',
      "</button>",
      "<div>",
      '<p class="text-xs font-semibold text-slate-500">' + escapeHtml(pageTitles[page] || "مساحة العمل") + "</p>",
      '<p class="text-sm font-bold text-slate-950 sm:text-base">نظام حياة لمتابعة القلب</p>',
      "</div>",
      "</div>",
      '<div class="flex items-center gap-3">',
      '<div id="notificationsWrapper" class="relative">',
      "</div>",
      '<div class="hidden items-center gap-3 sm:flex">',
      '<div class="text-right">',
      '<p class="text-sm font-semibold text-slate-950">' + escapeHtml(user.name) + "</p>",
      '<p class="text-xs text-slate-500">' + escapeHtml(CardiacAuth.roleLabels[role]) + "</p>",
      "</div>",
      '<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">' + escapeHtml(getInitials(user.name)) + "</div>",
      "</div>",
      '<button data-logout type="button" title="تسجيل الخروج" class="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-700 sm:flex">',
      '<i data-lucide="log-out" class="h-5 w-5"></i>',
      "</button>",
      "</div>",
      "</header>",
      '<main id="page-content" class="p-4 sm:p-6 lg:p-8"></main>',
      "</div>",
      "</div>"
    ].join("");

    setupLayoutEvents();
    refreshNotificationsUi(role);
    renderIcons();
  }

  function setupLayoutEvents() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const menuButton = document.getElementById("menuButton");

    function openSidebar() {
      sidebar.classList.remove("translate-x-full");
      backdrop.classList.remove("hidden");
    }

    function closeSidebar() {
      sidebar.classList.add("translate-x-full");
      backdrop.classList.add("hidden");
    }

    if (menuButton) {
      menuButton.addEventListener("click", openSidebar);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeSidebar);
    }

    document.querySelectorAll("[data-logout]").forEach(function (button) {
      button.addEventListener("click", CardiacAuth.logout);
    });
  }

  function bindNotificationsEvents(role) {
    const notificationsButton = document.getElementById("notificationsButton");
    const notificationsMenu = document.getElementById("notificationsMenu");
    const markReadButton = document.getElementById("markNotificationsRead");

    if (notificationsButton && notificationsMenu) {
      notificationsButton.addEventListener("click", function (event) {
        event.stopPropagation();
        const isHidden = notificationsMenu.classList.toggle("hidden");
        notificationsButton.setAttribute("aria-expanded", String(!isHidden));
      });

      notificationsMenu.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      document.addEventListener("click", function () {
        notificationsMenu.classList.add("hidden");
        notificationsButton.setAttribute("aria-expanded", "false");
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          notificationsMenu.classList.add("hidden");
          notificationsButton.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (markReadButton) {
      markReadButton.addEventListener("click", function (event) {
        event.stopPropagation();
        markNotificationsRead(role);
        refreshNotificationsUi(role);
      });
    }
  }

  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async function initProtectedPage() {
    const page = getPageName();
    const role = CardiacAuth.getRole();

    if (!role) {
      window.location.href = "index.html";
      return;
    }

    const allowedRoles = routeAccess[page] || [];

    if (!allowedRoles.includes(role)) {
      window.location.href = "dashboard.html";
      return;
    }

    const user = await getCurrentUser(role);
    renderLayout(role, user, page);
    window.addEventListener("cardiac-notifications-updated", function () {
      refreshNotificationsUi(role);
    });
    window.addEventListener("storage", function (event) {
      if (event.key === localKeys.notifications) {
        refreshNotificationsUi(role);
      }
    });
    readyResolver({ role, user, page });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (getPageName() !== "index") {
      initProtectedPage();
    }
  });

  window.CardiacApp = {
    onReady,
    escapeHtml,
    fetchJson,
    getPatients,
    getAppointments,
    getUsers,
    getCurrentUser,
    getAppointmentsWithPatients,
    getVitalRecords,
    getLocalAppointments,
    saveLocalAppointments,
    getLocalVitals,
    saveLocalVitals,
    getLocalCaseAlerts,
    saveLocalCaseAlerts,
    addNotification,
    getNotificationsForRole,
    getUnreadNotificationCount,
    markNotificationsRead,
    refreshNotificationsUi,
    todayIso,
    formatDate,
    formatDateTime,
    isUpcomingAppointment,
    conditionBadge,
    appointmentBadge,
    readingBadge,
    getReadingStatus,
    translateCondition,
    translateAppointmentStatus,
    translateReadingStatus,
    translateGender,
    translateReason,
    translateDiagnosis,
    calculatePatientStats,
    showLoading,
    showError,
    emptyState,
    pageHeader,
    statCard,
    tableShell,
    sectionCard,
    compactPatientList,
    compactAppointmentList,
    renderIcons
  };
})();
