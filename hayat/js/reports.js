(function () {
  let patients = [];
  let appointments = [];
  const filters = {
    query: "",
    condition: "All"
  };

  function renderStats(stats, appointmentStats) {
    const cards = [
      CardiacApp.statCard("إجمالي المرضى", stats.total, "users-round", "teal"),
      CardiacApp.statCard("مرضى مستقرون", stats.stable, "shield-check", "emerald"),
      CardiacApp.statCard("مرضى حرجون", stats.critical, "triangle-alert", "rose"),
      CardiacApp.statCard("يحتاجون متابعة", stats.followUp, "clipboard-clock", "amber"),
      CardiacApp.statCard("متوسط نبض القلب", stats.averageHeartRate + " نبضة/دقيقة", "heart-pulse", "rose"),
      CardiacApp.statCard("متوسط الأكسجين", stats.averageOxygenLevel + "%", "waves", "sky"),
      CardiacApp.statCard("إجمالي المواعيد", appointmentStats.total, "calendar-clock", "teal"),
      CardiacApp.statCard("مواعيد عاجلة", appointmentStats.urgent, "siren", "rose"),
      CardiacApp.statCard("مواعيد مكتملة", appointmentStats.completed, "circle-check", "slate")
    ];

    return '<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">' + cards.join("") + "</div>";
  }

 
 
 
  function renderFilters() {
    return [
      '<div class="mb-5 flex flex-col gap-4 md:flex-row md:items-end">',
      '<label class="flex flex-1 flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">البحث عن مريض</span>',
      '<div class="relative">',
      '<i data-lucide="search" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"></i>',
      '<input id="reportSearch" type="search" placeholder="ابحث باسم المريض" class="h-11 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</div>",
      "</label>",
      '<label class="flex min-w-[220px] flex-1 flex-col gap-2 sm:max-w-xs">',
      '<span class="text-xs font-semibold text-slate-500">الحالة</span>',
      '<select id="reportConditionFilter" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="All">كل المرضى</option>',
      '<option value="Stable">مستقر</option>',
      '<option value="Needs Follow-up">يحتاج متابعة</option>',
      '<option value="Critical">حرج</option>',
      "</select>",
      "</label>",
      "</div>"
    ].join("");
  }





  function getFilteredPatients() {
    return patients.filter(function (patient) {
      const matchesSearch = patient.name.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCondition = filters.condition === "All" || patient.condition === filters.condition;

      return matchesSearch && matchesCondition;
    });
  }

  function renderPatientSummary() {
    const container = document.getElementById("reportPatientSummary");
    const filtered = getFilteredPatients();

    if (!filtered.length) {
      container.innerHTML = CardiacApp.emptyState("لا يوجد مرضى", "جرّب كلمة بحث أو فلتر حالة مختلفًا.");
      CardiacApp.renderIcons();
      return;
    }

   
   
   
    const rows = filtered.map(function (patient) {
      return [
        "<tr>",
        '<td class="px-4 py-3 font-medium text-slate-900">' + CardiacApp.escapeHtml(patient.name) + "</td>",
        '<td class="px-4 py-3">' + CardiacApp.conditionBadge(patient.condition) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(patient.heartRate) + " نبضة/دقيقة</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(patient.bloodPressure) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(patient.oxygenLevel) + "%</td>",
        "</tr>"
      ].join("");
    }).join("");

    container.innerHTML = CardiacApp.tableShell(["الاسم", "الحالة", "نبض القلب", "ضغط الدم", "مستوى الأكسجين"], rows);
    CardiacApp.renderIcons();
  }

 
 
 
  function getAppointmentStats() {
    return {
      total: appointments.length,
      urgent: appointments.filter(function (appointment) {
        return appointment.status === "Urgent";
      }).length,
      completed: appointments.filter(function (appointment) {
        return appointment.status === "Completed";
      }).length
    };
  }

  function bindEvents() {
    document.getElementById("reportSearch").addEventListener("input", function (event) {
      filters.query = event.target.value.trim();
      renderPatientSummary();
    });

    document.getElementById("reportConditionFilter").addEventListener("change", function (event) {
      filters.condition = event.target.value;
      renderPatientSummary();
    });
  }

  
  
  CardiacApp.onReady(async function () {
    const container = document.getElementById("page-content");
    CardiacApp.showLoading(container, "جاري تحميل التقارير...");

    try {
      patients = await CardiacApp.getPatients();
      appointments = await CardiacApp.getAppointmentsWithPatients();

      const patientStats = CardiacApp.calculatePatientStats(patients);
      const appointmentStats = getAppointmentStats();

      container.innerHTML = [
        CardiacApp.pageHeader("التقارير", "إحصائيات وملخصات سريرية مخصصة للطبيب لمتابعة حالة المرضى."),
        renderStats(patientStats, appointmentStats),
        '<div class="mt-6">',
        CardiacApp.sectionCard("ملخص المرضى", renderFilters() + '<div id="reportPatientSummary"></div>', "ابحث وفلتر الملخص السريري للمرضى"),
        "</div>"
      ].join("");

      bindEvents();
      renderPatientSummary();
      CardiacApp.renderIcons();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(container, "فشل تحميل التقارير");
    }
  });
})();