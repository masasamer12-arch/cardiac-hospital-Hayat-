(function () {
  let allPatients = [];
  let currentRole = "";
  const filters = {
    query: "",
    condition: "All"
  };

  function patientHeaders(role) {
    if (role === "receptionist") {
      return ["الاسم", "العمر", "الجنس", "الهاتف", "الإجراء"];
    }

    return ["الاسم", "العمر", "الجنس", "الهاتف", "فصيلة الدم", "الحالة", "الإجراء"];
  }

  function filterPatients() {
    return allPatients.filter(function (patient) {
      const matchesSearch = patient.name.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCondition = currentRole === "receptionist" || filters.condition === "All" || patient.condition === filters.condition;

      return matchesSearch && matchesCondition;
    });
  }

  function renderControls() {
    const conditionFilter = currentRole === "receptionist"
      ? ""
      : [
        '<label class="flex min-w-[220px] flex-1 flex-col gap-2 sm:max-w-xs">',
        '<span class="text-xs font-semibold text-slate-500">فلترة حسب الحالة</span>',
        '<select id="conditionFilter" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
        '<option value="All">الكل</option>',
        '<option value="Stable">مستقر</option>',
        '<option value="Needs Follow-up">يحتاج متابعة</option>',
        '<option value="Critical">حرج</option>',
        "</select>",
        "</label>"
      ].join("");

    return [
      '<section class="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">',
      '<div class="flex flex-col gap-4 md:flex-row md:items-end">',
      '<label class="flex flex-1 flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">البحث عن مريض</span>',
      '<div class="relative">',
      '<i data-lucide="search" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"></i>',
      '<input id="patientSearch" type="search" placeholder="ابحث باسم المريض" class="h-11 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</div>",
      "</label>",
      conditionFilter,
      "</div>",
      "</section>"
    ].join("");
  }

  function renderTableRows(patients) {
    return patients.map(function (patient) {
      const cells = currentRole === "receptionist"
        ? [
          patient.name,
          patient.age,
          CardiacApp.translateGender(patient.gender),
          patient.phone,
          viewDetailsButton(patient.id)
        ]
        : [
          patient.name,
          patient.age,
          CardiacApp.translateGender(patient.gender),
          patient.phone,
          patient.bloodType,
          CardiacApp.conditionBadge(patient.condition),
          viewDetailsButton(patient.id)
        ];

      return [
        '<tr class="align-middle">',
        cells.map(function (cell, index) {
          const safeCell = index === cells.length - 1 || (currentRole !== "receptionist" && index === 5)
            ? cell
            : CardiacApp.escapeHtml(cell);
          return '<td class="whitespace-nowrap px-4 py-3 text-slate-700">' + safeCell + "</td>";
        }).join(""),
        "</tr>"
      ].join("");
    }).join("");
  }



  
  function renderMobileCards(patients) {
    return [
      '<div class="grid gap-3 md:hidden">',
      patients.map(function (patient) {
        const clinicalDetails = currentRole === "receptionist"
          ? ""
          : [
            '<div class="mt-3 flex flex-wrap gap-2">',
            CardiacApp.conditionBadge(patient.condition),
            '<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">الدم ' + CardiacApp.escapeHtml(patient.bloodType) + "</span>",
            "</div>"
          ].join("");

        return [
          '<article class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">',
          '<div class="flex items-start justify-between gap-4">',
          "<div>",
          '<h3 class="font-semibold text-slate-950">' + CardiacApp.escapeHtml(patient.name) + "</h3>",
          '<p class="mt-1 text-sm text-slate-500">' + CardiacApp.escapeHtml(patient.age) + " سنة، " + CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender)) + "</p>",
          '<p class="mt-1 text-sm text-slate-500">' + CardiacApp.escapeHtml(patient.phone) + "</p>",
          "</div>",
          '<a href="patient-details.html?id=' + encodeURIComponent(patient.id) + '" title="عرض التفاصيل" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm transition hover:bg-teal-700">',
          '<i data-lucide="arrow-left" class="h-4 w-4"></i>',
          "</a>",
          "</div>",
          clinicalDetails,
          "</article>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }




  function viewDetailsButton(id) {
    return [
      '<a href="patient-details.html?id=' + encodeURIComponent(id) + '" class="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700">',
      '<i data-lucide="eye" class="h-4 w-4"></i>',
      "عرض التفاصيل",
      "</a>"
    ].join("");
  }

  
  
  function renderResults() {
    const resultsContainer = document.getElementById("patientsResults");
    const patients = filterPatients();

  
  
    if (!patients.length) {
      resultsContainer.innerHTML = CardiacApp.emptyState("لا يوجد مرضى", "جرّب كلمة بحث أو فلترًا مختلفًا.");
      CardiacApp.renderIcons();
      return;
    }

    resultsContainer.innerHTML = [
      '<div class="hidden md:block">',
      CardiacApp.tableShell(patientHeaders(currentRole), renderTableRows(patients)),
      "</div>",
      renderMobileCards(patients)
    ].join("");
    CardiacApp.renderIcons();
  }

  function bindControls() {
    const searchInput = document.getElementById("patientSearch");
    const conditionFilter = document.getElementById("conditionFilter");

    searchInput.addEventListener("input", function (event) {
      filters.query = event.target.value.trim();
      renderResults();
    });

    if (conditionFilter) {
      conditionFilter.addEventListener("change", function (event) {
        filters.condition = event.target.value;
        renderResults();
      });
    }
  }

  
  
  CardiacApp.onReady(async function (context) {
    currentRole = context.role;
    const container = document.getElementById("page-content");

    container.innerHTML = [
      CardiacApp.pageHeader(
        "المرضى",
        currentRole === "receptionist"
          ? "عرض بيانات المرضى الأساسية المناسبة لمهام الاستقبال."
          : "ابحث وفلتر وافتح تفاصيل السجل الطبي للمريض."
      ),
      renderControls(),
      '<div id="patientsResults"></div>'
    ].join("");

    const resultsContainer = document.getElementById("patientsResults");
    CardiacApp.showLoading(resultsContainer, "جاري تحميل المرضى...");

    try {
      allPatients = await CardiacApp.getPatients();
      bindControls();
      renderResults();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(resultsContainer, "فشل تحميل بيانات المرضى");
    }

    CardiacApp.renderIcons();
  });
})();