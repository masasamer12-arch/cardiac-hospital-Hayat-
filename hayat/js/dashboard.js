(function () {
  const priorityLabels = {
    followUp: "متابعة",
    urgent: "عاجلة",
    critical: "حرجة"
  };

  function renderStatsGrid(cards) {
    return '<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">' + cards.join("") + "</div>";
  }

  function renderCaseAlertPanel(patients) {
    return [
      '<section class="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">',
      '<div class="mb-4">',
      '<h2 class="text-base font-semibold text-slate-950">تسجيل حالة رعاية</h2>',
      '<p class="mt-1 text-sm text-slate-500">عند حفظ الحالة سيصل تنبيه للفرق المعنية داخل المستشفى.</p>',
      "</div>",
      '<form id="caseAlertForm" class="grid gap-4 lg:grid-cols-[1.3fr_220px_1.5fr_auto] lg:items-end">',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">المريض</span>',
      '<select id="casePatientId" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="">اختر المريض</option>',
      patients.map(function (patient) {
        return '<option value="' + CardiacApp.escapeHtml(patient.id) + '">' + CardiacApp.escapeHtml(patient.name) + "</option>";
      }).join(""),
      "</select>",
      "</label>",
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">نوع الحالة</span>',
      '<select id="casePriority" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="followUp">متابعة</option>',
      '<option value="urgent">عاجلة</option>',
      '<option value="critical">حرجة</option>',
      "</select>",
      "</label>",
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">ملاحظة مختصرة</span>',
      '<input id="caseNote" required type="text" placeholder="مثال: يحتاج مراجعة اليوم" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</label>",
      '<button type="submit" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">',
      '<i data-lucide="send" class="h-4 w-4"></i>',
      "إرسال",
      "</button>",
      "</form>",
      '<div id="caseAlertsList" class="mt-5">',
      renderCaseAlertsList(),
      "</div>",
      "</section>"
    ].join("");
  }

  function renderCaseAlertsList() {
    const caseAlerts = CardiacApp.getLocalCaseAlerts().slice(0, 5);

    if (!caseAlerts.length) {
      return [
        '<div class="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">',
        "لا توجد حالات مضافة بعد.",
        "</div>"
      ].join("");
    }

    return [
      '<div class="divide-y divide-slate-100 rounded-lg border border-slate-100">',
      caseAlerts.map(function (caseAlert) {
        const tone = caseAlert.priority === "critical"
          ? "text-rose-700 bg-rose-50"
          : caseAlert.priority === "urgent"
            ? "text-amber-700 bg-amber-50"
            : "text-teal-700 bg-teal-50";

        return [
          '<div class="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">',
          "<div>",
          '<p class="text-sm font-semibold text-slate-950">' + CardiacApp.escapeHtml(caseAlert.patientName) + "</p>",
          '<p class="mt-1 text-xs text-slate-500">' + CardiacApp.escapeHtml(caseAlert.note) + "</p>",
          '<p class="mt-1 text-[11px] text-slate-400">' + CardiacApp.escapeHtml(caseAlert.createdByName) + " - " + CardiacApp.escapeHtml(CardiacApp.formatDateTime(caseAlert.createdAt)) + "</p>",
          "</div>",
          '<span class="w-fit rounded-md px-2.5 py-1 text-xs font-semibold ' + tone + '">' + CardiacApp.escapeHtml(priorityLabels[caseAlert.priority] || "متابعة") + "</span>",
          "</div>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function bindCaseAlertForm(context, patients) {
    const form = document.getElementById("caseAlertForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const patient = patients.find(function (item) {
        return item.id === document.getElementById("casePatientId").value;
      });
      const priority = document.getElementById("casePriority").value;
      const note = document.getElementById("caseNote").value.trim();

      if (!patient || !note) {
        return;
      }

      const caseAlert = {
        id: "case-alert-" + Date.now(),
        patientId: patient.id,
        patientName: patient.name,
        priority,
        note,
        createdByRole: context.role,
        createdByName: context.user.name,
        createdAt: new Date().toISOString()
      };

      const caseAlerts = CardiacApp.getLocalCaseAlerts();
      CardiacApp.saveLocalCaseAlerts([caseAlert].concat(caseAlerts).slice(0, 50));

      CardiacApp.addNotification({
        title: "تمت إضافة حالة جديدة",
        message: context.user.name + " أضاف حالة " + (priorityLabels[priority] || "متابعة") + " للمريض " + patient.name + ": " + note,
        icon: priority === "critical" ? "triangle-alert" : "clipboard-plus",
        type: "case",
        link: "patient-details.html?id=" + encodeURIComponent(patient.id),
        createdByRole: context.role,
        createdByName: context.user.name
      });

      form.reset();
      document.getElementById("caseAlertsList").innerHTML = renderCaseAlertsList();
      CardiacApp.renderIcons();
    });
  }

  function renderVitalOverview(records) {
    if (!records.length) {
      return CardiacApp.emptyState("لا توجد قراءات حيوية", "لا توجد قراءات حيوية متاحة حاليًا.");
    }

    const rows = records.slice(0, 6).map(function (record) {
      const status = CardiacApp.getReadingStatus(record);

      return [
        '<tr class="align-top">',
        '<td class="px-4 py-3 font-medium text-slate-900">' + CardiacApp.escapeHtml(record.patientName) + "</td>",
        '<td class="px-4 py-3 text-slate-600">' + CardiacApp.escapeHtml(record.heartRate) + " نبضة/دقيقة</td>",
        '<td class="px-4 py-3 text-slate-600">' + CardiacApp.escapeHtml(record.bloodPressure) + "</td>",
        '<td class="px-4 py-3 text-slate-600">' + CardiacApp.escapeHtml(record.oxygenLevel) + "%</td>",
        '<td class="px-4 py-3">' + CardiacApp.readingBadge(status) + "</td>",
        "</tr>"
      ].join("");
    }).join("");

    return CardiacApp.tableShell(["المريض", "نبض القلب", "ضغط الدم", "الأكسجين", "حالة القراءة"], rows);
  }

  function renderDoctorDashboard(patients, appointments, vitals) {
    const stats = CardiacApp.calculatePatientStats(patients);
    const upcoming = appointments.filter(CardiacApp.isUpcomingAppointment);
    const criticalPatients = patients.filter(function (patient) {
      return patient.condition === "Critical";
    });
    const followUpPatients = patients.filter(function (patient) {
      return patient.condition === "Needs Follow-up";
    });

    return [
      CardiacApp.pageHeader("لوحة تحكم الطبيب", "ملخص سريري يوضح أعداد المرضى حسب الحالة، الحالات الحرجة، حالات المتابعة، المواعيد، والقراءات الحيوية."),
      renderCaseAlertPanel(patients),
      renderStatsGrid([
        CardiacApp.statCard("إجمالي المرضى", stats.total, "users-round", "teal"),
        CardiacApp.statCard("مرضى مستقرون", stats.stable, "shield-check", "emerald"),
        CardiacApp.statCard("مرضى حرجون", stats.critical, "triangle-alert", "rose"),
        CardiacApp.statCard("يحتاجون متابعة", stats.followUp, "clipboard-clock", "amber"),
        CardiacApp.statCard("مواعيد قادمة", upcoming.length, "calendar-clock", "sky")
      ]),
      '<div class="mt-6 grid gap-6 xl:grid-cols-2">',
      CardiacApp.sectionCard("أحدث المرضى", CardiacApp.compactPatientList(patients.slice(-5).reverse()), "آخر السجلات المسجلة"),
      CardiacApp.sectionCard("الحالات الحرجة", CardiacApp.compactPatientList(criticalPatients), "مرضى يحتاجون اهتمامًا سريعًا"),
      CardiacApp.sectionCard("مرضى يحتاجون متابعة", CardiacApp.compactPatientList(followUpPatients), "مرضى يحتاجون مراجعة مجدولة"),
      CardiacApp.sectionCard("المواعيد القادمة", CardiacApp.compactAppointmentList(upcoming.slice(0, 6)), "أقرب المواعيد المسجلة"),
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("نظرة سريعة على العلامات الحيوية", renderVitalOverview(vitals), "أحدث المؤشرات الحيوية المسجلة"),
      "</div>"
    ].join("");
  }

  function renderNurseDashboard(patients, appointments, vitals) {
    const stats = CardiacApp.calculatePatientStats(patients);
    const upcoming = appointments.filter(CardiacApp.isUpcomingAppointment);
    const needsCheck = patients.filter(function (patient) {
      return patient.condition === "Critical" || patient.condition === "Needs Follow-up";
    });

    return [
      CardiacApp.pageHeader("لوحة تحكم الممرضة", "مساحة متابعة تركز على فحوصات العلامات الحيوية، الحالات الحرجة، ومهام الرعاية القادمة."),
      renderCaseAlertPanel(patients),
      renderStatsGrid([
        CardiacApp.statCard("إجمالي المرضى", stats.total, "users-round", "teal"),
        CardiacApp.statCard("مرضى حرجون", stats.critical, "triangle-alert", "rose"),
        CardiacApp.statCard("يحتاجون متابعة", stats.followUp, "clipboard-clock", "amber"),
        CardiacApp.statCard("آخر القراءات الحيوية", vitals.length, "activity", "emerald"),
        CardiacApp.statCard("مواعيد قادمة", upcoming.length, "calendar-clock", "sky")
      ]),
      '<div class="mt-6 grid gap-6 xl:grid-cols-2">',
      CardiacApp.sectionCard("مرضى يحتاجون فحصًا حيويًا", CardiacApp.compactPatientList(needsCheck), "الحالات الحرجة وحالات المتابعة"),
      CardiacApp.sectionCard("المواعيد القادمة", CardiacApp.compactAppointmentList(upcoming.slice(0, 6)), "مواعيد تحتاج تجهيزًا"),
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("آخر القراءات الحيوية", renderVitalOverview(vitals), "أحدث القراءات المسجلة"),
      "</div>"
    ].join("");
  }

  function renderReceptionistDashboard(patients, appointments) {
    const today = CardiacApp.todayIso();
    const todaysAppointments = appointments.filter(function (appointment) {
      return appointment.date === today;
    });
    const upcoming = appointments.filter(CardiacApp.isUpcomingAppointment);
    const scheduled = appointments.filter(function (appointment) {
      return appointment.status === "Scheduled";
    });

    return [
      CardiacApp.pageHeader("لوحة تحكم الاستقبال", "عرض مخصص لموظف الاستقبال لمتابعة بيانات المرضى الأساسية وتنسيق المواعيد."),
      renderCaseAlertPanel(patients),
      renderStatsGrid([
        CardiacApp.statCard("إجمالي المرضى", patients.length, "users-round", "teal"),
        CardiacApp.statCard("مواعيد اليوم", todaysAppointments.length, "calendar-days", "sky"),
        CardiacApp.statCard("مواعيد قادمة", upcoming.length, "calendar-clock", "emerald"),
        CardiacApp.statCard("أحدث المرضى", Math.min(patients.length, 5), "user-plus", "slate"),
        CardiacApp.statCard("مواعيد مجدولة", scheduled.length, "clipboard-list", "amber")
      ]),
      '<div class="mt-6 grid gap-6 xl:grid-cols-2">',
      CardiacApp.sectionCard("أحدث المرضى", CardiacApp.compactPatientList(patients.slice(-5).reverse(), { showCondition: false }), "معلومات التسجيل الأساسية فقط"),
      CardiacApp.sectionCard("المواعيد المجدولة", CardiacApp.compactAppointmentList(scheduled.slice(0, 8)), "مواعيد مرتبطة بسجلات المرضى"),
      "</div>"
    ].join("");
  }

  CardiacApp.onReady(async function (context) {
    const container = document.getElementById("page-content");
    CardiacApp.showLoading(container, "جاري تحميل لوحة التحكم...");

    try {
      const patients = await CardiacApp.getPatients();
      const appointments = await CardiacApp.getAppointmentsWithPatients();

      if (context.role === "doctor") {
        const vitals = await CardiacApp.getVitalRecords();
        container.innerHTML = renderDoctorDashboard(patients, appointments, vitals);
      } else if (context.role === "nurse") {
        const vitals = await CardiacApp.getVitalRecords();
        container.innerHTML = renderNurseDashboard(patients, appointments, vitals);
      } else {
        container.innerHTML = renderReceptionistDashboard(patients, appointments);
      }

      bindCaseAlertForm(context, patients);
      CardiacApp.renderIcons();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(container, "فشل تحميل بيانات لوحة التحكم");
    }
  });
})();