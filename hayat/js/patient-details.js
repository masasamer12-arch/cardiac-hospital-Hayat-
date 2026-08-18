(function () {
  function getPatientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function detailItem(label, value) {
    return [
      '<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">',
      '<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">' + CardiacApp.escapeHtml(label) + "</p>",
      '<div class="mt-2 text-base font-semibold text-slate-950">' + value + "</div>",
      "</div>"
    ].join("");
  }

  function renderVitals(patient) {
    return [
      '<div class="grid gap-4 sm:grid-cols-3">',
      CardiacApp.statCard("نبض القلب", patient.heartRate + " نبضة/دقيقة", "heart-pulse", "rose", "آخر قراءة مسجلة"),
      CardiacApp.statCard("ضغط الدم", patient.bloodPressure, "activity", "sky", "انقباضي/انبساطي"),
      CardiacApp.statCard("مستوى الأكسجين", patient.oxygenLevel + "%", "waves", "emerald", "قراءة SpO2"),
      "</div>"
    ].join("");
  }



  function renderAppointmentRows(appointments) {
    if (!appointments.length) {
      return CardiacApp.emptyState("لا توجد مواعيد", "لا توجد مواعيد مرتبطة بهذا المريض.");
    }

    const rows = appointments.map(function (appointment) {
      return [
        "<tr>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(CardiacApp.formatDate(appointment.date)) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(appointment.time) + "</td>",
        '<td class="px-4 py-3">' + CardiacApp.appointmentBadge(appointment.status) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(CardiacApp.translateReason(appointment.reason)) + "</td>",
        "</tr>"
      ].join("");
    }).join("");

    return CardiacApp.tableShell(["التاريخ", "الوقت", "الحالة", "السبب"], rows);
  }





  function renderDoctorView(patient, patientAppointments) {
    const details = [
      detailItem("اسم المريض", CardiacApp.escapeHtml(patient.name)),
      detailItem("العمر", CardiacApp.escapeHtml(patient.age)),
      detailItem("الجنس", CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender))),
      detailItem("الهاتف", CardiacApp.escapeHtml(patient.phone)),
      detailItem("فصيلة الدم", CardiacApp.escapeHtml(patient.bloodType)),
      detailItem("الحالة", CardiacApp.conditionBadge(patient.condition)),
      detailItem("التشخيص", CardiacApp.escapeHtml(CardiacApp.translateDiagnosis(patient.diagnosis))),
      detailItem("رقم الطبيب", CardiacApp.escapeHtml(patient.doctorId))
    ].join("");

    return [
      '<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">',
      details,
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("العلامات الحيوية", renderVitals(patient), "قراءات سريرية مسجلة"),
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("المواعيد المرتبطة", renderAppointmentRows(patientAppointments), "مواعيد مرتبطة بسجل المريض"),
      "</div>"
    ].join("");
  }



  function renderNurseView(patient, patientAppointments) {
    const details = [
      detailItem("الاسم", CardiacApp.escapeHtml(patient.name)),
      detailItem("العمر", CardiacApp.escapeHtml(patient.age)),
      detailItem("الجنس", CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender))),
      detailItem("الحالة", CardiacApp.conditionBadge(patient.condition))
    ].join("");

    return [
      '<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">',
      details,
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("العلامات الحيوية المهمة", renderVitals(patient), "معلومات مهمة للمتابعة والمراقبة"),
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("مواعيد الرعاية القادمة", renderAppointmentRows(patientAppointments), "مواعيد مرتبطة بسجل المريض"),
      "</div>"
    ].join("");
  }

  function renderReceptionistView(patient) {
    const details = [
      detailItem("الاسم", CardiacApp.escapeHtml(patient.name)),
      detailItem("العمر", CardiacApp.escapeHtml(patient.age)),
      detailItem("الجنس", CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender))),
      detailItem("الهاتف", CardiacApp.escapeHtml(patient.phone))
    ].join("");

    return '<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">' + details + "</div>";
  }

  CardiacApp.onReady(async function (context) {
    const container = document.getElementById("page-content");
    const patientId = getPatientId();

    if (!patientId) {
      container.innerHTML = [
        CardiacApp.pageHeader("تفاصيل المريض", "لم يتم تمرير رقم المريض في الرابط."),
        CardiacApp.emptyState("المريض غير موجود", "افتح هذه الصفحة من زر عرض التفاصيل في صفحة المرضى.")
      ].join("");
      CardiacApp.renderIcons();
      return;
    }

   
   
   
    CardiacApp.showLoading(container, "جاري تحميل تفاصيل المريض...");

    try {
      const patients = await CardiacApp.getPatients();
      const patient = patients.find(function (item) {
        return item.id === patientId;
      });

      if (!patient) {
        container.innerHTML = [
          CardiacApp.pageHeader("تفاصيل المريض", "رقم المريض المحدد غير موجود في سجلات المستشفى."),
          CardiacApp.emptyState("المريض غير موجود", "ارجع إلى صفحة المرضى واختر سجلًا متاحًا.")
        ].join("");
        CardiacApp.renderIcons();
        return;
      }

      const appointments = context.role === "receptionist"
        ? []
        : await CardiacApp.getAppointmentsWithPatients();
      const patientAppointments = appointments.filter(function (appointment) {
        return appointment.patientId === patient.id;
      });

      const backButton = [
        '<a href="patients.html" class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">',
        '<i data-lucide="arrow-left" class="h-4 w-4"></i>',
        "العودة إلى المرضى",
        "</a>"
      ].join("");

      const body = context.role === "doctor"
        ? renderDoctorView(patient, patientAppointments)
        : context.role === "nurse"
          ? renderNurseView(patient, patientAppointments)
          : renderReceptionistView(patient);

      container.innerHTML = [
        CardiacApp.pageHeader(patient.name, "تفاصيل السجل تظهر حسب صلاحية المستخدم الحالي.", backButton),
        body
      ].join("");

      CardiacApp.renderIcons();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(container, "فشل تحميل تفاصيل المريض");
    }
  });
})();