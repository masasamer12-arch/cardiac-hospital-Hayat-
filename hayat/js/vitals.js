(function () {
  let patients = [];
  let records = [];
  let currentContext = null;
  const filters = {
    query: "",
    readingStatus: "All"
  };

  function renderForm() {
    return [
      '<section class="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">',
      '<div class="mb-4">',
      '<h2 class="text-base font-semibold text-slate-950">إضافة قراءة حيوية</h2>',
      '<p class="mt-1 text-sm text-slate-500">يتم تسجيل القراءة وإظهارها مباشرة ضمن سجل المتابعة.</p>',
      "</div>",
      '<form id="vitalForm" class="grid gap-4 md:grid-cols-5">',
      '<label class="flex flex-col gap-2 md:col-span-2">',
      '<span class="text-xs font-semibold text-slate-500">المريض</span>',
      '<select id="patientId" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="">اختر المريض</option>',
      patients.map(function (patient) {
        return '<option value="' + CardiacApp.escapeHtml(patient.id) + '">' + CardiacApp.escapeHtml(patient.name) + "</option>";
      }).join(""),
      "</select>",
      "</label>",
      inputField("heartRate", "نبض القلب", "number", "72", "40", "180"),
      inputField("bloodPressure", "ضغط الدم", "text", "120/80"),
      inputField("oxygenLevel", "مستوى الأكسجين", "number", "97", "70", "100"),
      '<div class="md:col-span-5">',
      '<button type="submit" class="inline-flex h-11 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">',
      '<i data-lucide="save" class="h-4 w-4"></i>',
      "حفظ القراءة",
      "</button>",
      "</div>",
      "</form>",
      "</section>"
    ].join("");
  }

 
 
 
  function inputField(id, label, type, placeholder, min, max) {
    const attrs = [
      'id="' + id + '"',
      'type="' + type + '"',
      "required",
      'placeholder="' + placeholder + '"',
      'class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"'
    ];

    if (min) {
      attrs.push('min="' + min + '"');
    }

    if (max) {
      attrs.push('max="' + max + '"');
    }

    return [
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">' + label + "</span>",
      "<input " + attrs.join(" ") + ">",
      "</label>"
    ].join("");
  }

 
 
  function renderFilters() {
    return [
      '<section class="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">',
      '<div class="flex flex-col gap-4 md:flex-row md:items-end">',
      '<label class="flex flex-1 flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">البحث عن مريض</span>',
      '<div class="relative">',
      '<i data-lucide="search" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"></i>',
      '<input id="vitalSearch" type="search" placeholder="ابحث باسم المريض" class="h-11 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</div>",
      "</label>",
      '<label class="flex min-w-[220px] flex-1 flex-col gap-2 sm:max-w-xs">',
      '<span class="text-xs font-semibold text-slate-500">حالة القراءة</span>',
      '<select id="readingStatusFilter" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="All">الكل</option>',
      '<option value="Normal">طبيعي</option>',
      '<option value="Warning">تحذير</option>',
      '<option value="Critical">حرج</option>',
      "</select>",
      "</label>",
      "</div>",
      "</section>"
    ].join("");
  }




  function getFilteredRecords() {
    return records.filter(function (record) {
      const status = CardiacApp.getReadingStatus(record);
      const matchesSearch = record.patientName.toLowerCase().includes(filters.query.toLowerCase());
      const matchesStatus = filters.readingStatus === "All" || status === filters.readingStatus;

      return matchesSearch && matchesStatus;
    });
  }

  
  
  
  function renderRecords() {
    const list = document.getElementById("vitalsResults");
    const filtered = getFilteredRecords();

    if (!filtered.length) {
      list.innerHTML = CardiacApp.emptyState("لا توجد قراءات حيوية", "جرّب بحثًا أو حالة قراءة مختلفة.");
      CardiacApp.renderIcons();
      return;
    }





    const rows = filtered.map(function (record) {
      const status = CardiacApp.getReadingStatus(record);

      return [
        "<tr>",
        '<td class="px-4 py-3 font-medium text-slate-900">' + CardiacApp.escapeHtml(record.patientName) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(record.heartRate) + " نبضة/دقيقة</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(record.bloodPressure) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(record.oxygenLevel) + "%</td>",
        '<td class="px-4 py-3">' + CardiacApp.conditionBadge(record.condition) + "</td>",
        '<td class="px-4 py-3">' + CardiacApp.readingBadge(status) + "</td>",
        '<td class="px-4 py-3 text-xs font-medium text-slate-500">' + (record.isLocal ? "مدخل حديثًا" : "سجل أساسي") + "</td>",
        '<td class="px-4 py-3 text-xs text-slate-500">' + CardiacApp.escapeHtml(CardiacApp.formatDateTime(record.recordedAt)) + "</td>",
        "</tr>"
      ].join("");
    }).join("");

    list.innerHTML = CardiacApp.tableShell(["المريض", "نبض القلب", "ضغط الدم", "الأكسجين", "حالة المريض", "حالة القراءة", "نوع السجل", "وقت التسجيل"], rows);
    CardiacApp.renderIcons();
  }




  function notifyVitalAdded(record, patient) {
    if (!currentContext || !patient) {
      return;
    }

    const readingStatus = CardiacApp.getReadingStatus(record);

    CardiacApp.addNotification({
      title: "تمت إضافة قراءة حيوية",
      message: currentContext.user.name + " أضاف قراءة متابعة للمريض " + patient.name + ". حالة القراءة: " + CardiacApp.translateReadingStatus(readingStatus) + ".",
      icon: readingStatus === "Critical" ? "triangle-alert" : "activity",
      type: "vital",
      link: "patient-details.html?id=" + encodeURIComponent(patient.id),
      createdByRole: currentContext.role,
      createdByName: currentContext.user.name
    });
  }




  function bindEvents() {
    document.getElementById("vitalForm").addEventListener("submit", function (event) {
      event.preventDefault();

      const newRecord = {
        id: "local-vital-" + Date.now(),
        patientId: document.getElementById("patientId").value,
        heartRate: Number(document.getElementById("heartRate").value),
        bloodPressure: document.getElementById("bloodPressure").value.trim(),
        oxygenLevel: Number(document.getElementById("oxygenLevel").value),
        recordedAt: new Date().toISOString()
      };



      const localVitals = CardiacApp.getLocalVitals();
      CardiacApp.saveLocalVitals(localVitals.concat(newRecord));
      const selectedPatient = patients.find(function (patient) {
        return patient.id === newRecord.patientId;
      });

      records = records.concat({
        ...newRecord,
        patientName: selectedPatient ? selectedPatient.name : "مريض غير معروف",
        condition: selectedPatient ? selectedPatient.condition : "Needs Follow-up",
        isLocal: true
      });

      notifyVitalAdded(newRecord, selectedPatient);
      document.getElementById("vitalForm").reset();
      renderRecords();
    });

    document.getElementById("vitalSearch").addEventListener("input", function (event) {
      filters.query = event.target.value.trim();
      renderRecords();
    });

    document.getElementById("readingStatusFilter").addEventListener("change", function (event) {
      filters.readingStatus = event.target.value;
      renderRecords();
    });
  }


  
  CardiacApp.onReady(async function (context) {
    currentContext = context;
    const container = document.getElementById("page-content");
    CardiacApp.showLoading(container, "جاري تحميل العلامات الحيوية...");

    try {
      patients = await CardiacApp.getPatients();
      records = await CardiacApp.getVitalRecords();

      container.innerHTML = [
        CardiacApp.pageHeader("العلامات الحيوية", "مساحة للطبيب والتمريض لمراجعة وإضافة القراءات الحيوية للمرضى."),
        renderForm(),
        renderFilters(),
        '<div id="vitalsResults"></div>'
      ].join("");

      bindEvents();
      renderRecords();
      CardiacApp.renderIcons();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(container, "فشل تحميل العلامات الحيوية");
    }
  });
})();