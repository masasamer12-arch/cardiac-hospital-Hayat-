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
    if (!patient.heartRate && !patient.bloodPressure && !patient.oxygenLevel) {
      return '<p class="text-sm text-slate-500">لم يتم تسجيل قراءات حيوية بعد.</p>';
    }
    return [
      '<div class="grid gap-4 sm:grid-cols-3">',
      CardiacApp.statCard("نبض القلب", (patient.heartRate || "-") + " نبضة/دقيقة", "heart-pulse", "rose", "آخر قراءة مسجلة"),
      CardiacApp.statCard("ضغط الدم", patient.bloodPressure || "-", "activity", "sky", "انقباضي/انبساطي"),
      CardiacApp.statCard("مستوى الأكسجين", (patient.oxygenLevel || "-") + "%", "waves", "emerald", "قراءة SpO2"),
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

  function renderCompletionForm(patient, context) {
    return [
      '<section class="mt-6 rounded-lg border border-orange-200 bg-orange-50/50 p-5 shadow-sm">',
      '<div class="mb-4">',
      '<div class="flex items-center gap-2">',
      '<i data-lucide="clipboard-plus" class="h-5 w-5 text-orange-600"></i>',
      '<h2 class="text-base font-semibold text-slate-950">إكمال البيانات الطبية للمريض</h2>',
      '</div>',
      '<p class="mt-1 text-sm text-slate-500">هذا المريض مسجّل من قبل الاستقبال وبانتظار إكمال البيانات الطبية.</p>',
      '</div>',
      '<form id="completePatientForm" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">فصيلة الدم <span class="text-rose-500">*</span></span>',
      '<select id="compBloodType" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="">اختر فصيلة الدم</option>',
      '<option value="A+">A+</option>',
      '<option value="A-">A-</option>',
      '<option value="B+">B+</option>',
      '<option value="B-">B-</option>',
      '<option value="AB+">AB+</option>',
      '<option value="AB-">AB-</option>',
      '<option value="O+">O+</option>',
      '<option value="O-">O-</option>',
      '</select>',
      '</label>',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">نوع المرض <span class="text-rose-500">*</span></span>',
      '<select id="compDiseaseType" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="">اختر نوع المرض</option>',
      '<option value="أمراض الشرايين التاجية">أمراض الشرايين التاجية</option>',
      '<option value="اضطراب نظم القلب">اضطراب نظم القلب</option>',
      '<option value="ارتفاع ضغط الدم">ارتفاع ضغط الدم</option>',
      '<option value="قصور القلب">قصور القلب</option>',
      '<option value="أمراض الصمامات">أمراض الصمامات</option>',
      '<option value="التهاب عضلة القلب">التهاب عضلة القلب</option>',
      '<option value="أمراض الأوعية الدموية">أمراض الأوعية الدموية</option>',
      '<option value="أخرى">أخرى</option>',
      '</select>',
      '</label>',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">تشخيص الحالة <span class="text-rose-500">*</span></span>',
      '<input id="compDiagnosis" type="text" required placeholder="وصف التشخيص التفصيلي" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '</label>',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">حالة المريض <span class="text-rose-500">*</span></span>',
      '<select id="compCondition" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="">اختر الحالة</option>',
      '<option value="Stable">مستقرة</option>',
      '<option value="Needs Follow-up">تحتاج إلى متابعة</option>',
      '<option value="Critical">حرجة</option>',
      '</select>',
      '</label>',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">ملاحظات إضافية</span>',
      '<input id="compNotes" type="text" placeholder="أي ملاحظات طبية إضافية" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '</label>',
      '</form>',
      '<div class="mt-4">',
      '<h3 class="mb-3 text-sm font-semibold text-slate-700">العلامات الحيوية الأولية (اختياري)</h3>',
      '<div class="grid gap-4 sm:grid-cols-3">',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">نبض القلب (نبضة/دقيقة)</span>',
      '<input id="compHeartRate" type="number" min="30" max="220" placeholder="مثال: 78" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '</label>',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">ضغط الدم (انقباضي/انبساطي)</span>',
      '<input id="compBloodPressure" type="text" placeholder="مثال: 120/80" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '</label>',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">مستوى الأكسجين (%)</span>',
      '<input id="compOxygen" type="number" min="50" max="100" placeholder="مثال: 97" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '</label>',
      '</div>',
      '</div>',
      '<div class="mt-4 flex items-center gap-3">',
      '<button type="button" id="submitCompleteBtn" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">',
      '<i data-lucide="check-circle" class="h-4 w-4"></i>',
      'حفظ البيانات الطبية',
      '</button>',
      '<span id="completeMsg" class="text-sm font-medium"></span>',
      '</div>',
      '</section>'
    ].join("");
  }

  function bindCompletionForm(patientId, context) {
    const submitBtn = document.getElementById("submitCompleteBtn");
    const msgEl = document.getElementById("completeMsg");

    if (!submitBtn) {
      return;
    }

    submitBtn.addEventListener("click", function () {
      const bloodType = document.getElementById("compBloodType").value;
      const diseaseType = document.getElementById("compDiseaseType").value;
      const diagnosis = document.getElementById("compDiagnosis").value.trim();
      const condition = document.getElementById("compCondition").value;
      const notes = document.getElementById("compNotes").value.trim();
      const heartRate = parseInt(document.getElementById("compHeartRate").value, 10);
      const bloodPressure = document.getElementById("compBloodPressure").value.trim();
      const oxygenLevel = parseInt(document.getElementById("compOxygen").value, 10);

      if (!bloodType || !diseaseType || !diagnosis || !condition) {
        msgEl.textContent = "يرجى ملء جميع الحقول المطلوبة.";
        msgEl.className = "text-sm font-medium text-rose-600";
        return;
      }

      const updates = {
        bloodType: bloodType,
        diseaseType: diseaseType,
        diagnosis: diagnosis,
        condition: condition,
        status: "complete",
        completedAt: new Date().toISOString(),
        completedBy: context.role
      };

      if (!isNaN(heartRate) && heartRate >= 30 && heartRate <= 220) {
        updates.heartRate = heartRate;
      }
      if (bloodPressure) {
        updates.bloodPressure = bloodPressure;
      }
      if (!isNaN(oxygenLevel) && oxygenLevel >= 50 && oxygenLevel <= 100) {
        updates.oxygenLevel = oxygenLevel;
      }
      if (notes) {
        updates.notes = notes;
      }

      const updated = CardiacApp.updateLocalPatient(patientId, updates);

      if (updated) {
        CardiacApp.addNotification({
          title: "تم إكمال بيانات مريض",
          message: context.user.name + " أكمل البيانات الطبية للمريض رقم " + patientId + ".",
          icon: "clipboard-check",
          type: "patient",
          link: "patient-details.html?id=" + encodeURIComponent(patientId),
          createdByRole: context.role,
          createdByName: context.user.name,
          recipientRoles: ["receptionist"]
        });

        msgEl.textContent = "تم حفظ البيانات الطبية بنجاح!";
        msgEl.className = "text-sm font-medium text-emerald-600";
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-50", "cursor-not-allowed");

        setTimeout(function () {
          location.reload();
        }, 1500);
      } else {
        msgEl.textContent = "حدث خطأ أثناء حفظ البيانات.";
        msgEl.className = "text-sm font-medium text-rose-600";
      }
    });
  }

  function renderDoctorView(patient, patientAppointments, context) {
    const isPending = CardiacApp.isPendingPatient(patient);
    const completionFormHtml = isPending ? renderCompletionForm(patient, context) : "";

    const details = [
      detailItem("اسم المريض", CardiacApp.escapeHtml(patient.name)),
      detailItem("العمر", CardiacApp.escapeHtml(patient.age)),
      detailItem("الجنس", CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender))),
      detailItem("الهاتف", CardiacApp.escapeHtml(patient.phone)),
      detailItem("فصيلة الدم", CardiacApp.escapeHtml(patient.bloodType || "-")),
      detailItem("نوع المرض", CardiacApp.escapeHtml(patient.diseaseType || "-")),
      detailItem("الحالة", isPending ? CardiacApp.pendingBadge() : CardiacApp.conditionBadge(patient.condition)),
      detailItem("التشخيص", CardiacApp.escapeHtml(CardiacApp.translateDiagnosis(patient.diagnosis) || "-")),
      detailItem("رقم الطبيب", CardiacApp.escapeHtml(patient.doctorId || "-"))
    ].join("");

    return [
      '<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">',
      details,
      "</div>",
      completionFormHtml,
      '<div class="mt-6">',
      CardiacApp.sectionCard("العلامات الحيوية", renderVitals(patient), "قراءات سريرية مسجلة"),
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("المواعيد المرتبطة", renderAppointmentRows(patientAppointments), "مواعيد مرتبطة بسجل المريض"),
      "</div>"
    ].join("");
  }

  function renderNurseView(patient, patientAppointments, context) {
    const isPending = CardiacApp.isPendingPatient(patient);
    const completionFormHtml = isPending ? renderCompletionForm(patient, context) : "";

    const details = [
      detailItem("الاسم", CardiacApp.escapeHtml(patient.name)),
      detailItem("العمر", CardiacApp.escapeHtml(patient.age)),
      detailItem("الجنس", CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender))),
      detailItem("نوع المرض", CardiacApp.escapeHtml(patient.diseaseType || "-")),
      detailItem("الحالة", isPending ? CardiacApp.pendingBadge() : CardiacApp.conditionBadge(patient.condition))
    ].join("");

    return [
      '<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">',
      details,
      "</div>",
      completionFormHtml,
      '<div class="mt-6">',
      CardiacApp.sectionCard("العلامات الحيوية المهمة", renderVitals(patient), "معلومات مهمة للمتابعة والمراقبة"),
      "</div>",
      '<div class="mt-6">',
      CardiacApp.sectionCard("مواعيد الرعاية القادمة", renderAppointmentRows(patientAppointments), "مواعيد مرتبطة بسجل المريض"),
      "</div>"
    ].join("");
  }

  function renderReceptionistView(patient) {
    const isPending = CardiacApp.isPendingPatient(patient);
    const statusNote = isPending
      ? '<div class="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700"><i data-lucide="info" class="mb-1 inline-block h-4 w-4 align-text-bottom"></i> بيانات هذا المريض الطبية لم تُكتمل بعد. بانتظار الطبيب أو الممرض.</div>'
      : "";

    const details = [
      detailItem("الاسم", CardiacApp.escapeHtml(patient.name)),
      detailItem("العمر", CardiacApp.escapeHtml(patient.age)),
      detailItem("الجنس", CardiacApp.escapeHtml(CardiacApp.translateGender(patient.gender))),
      detailItem("الهاتف", CardiacApp.escapeHtml(patient.phone)),
      detailItem("حالة السجل", isPending ? CardiacApp.pendingBadge() : '<span class="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">مكتمل</span>')
    ].join("");

    return '<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">' + details + "</div>" + statusNote;
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
        ? renderDoctorView(patient, patientAppointments, context)
        : context.role === "nurse"
          ? renderNurseView(patient, patientAppointments, context)
          : renderReceptionistView(patient);

      container.innerHTML = [
        CardiacApp.pageHeader(patient.name, "تفاصيل السجل تظهر حسب صلاحية المستخدم الحالي.", backButton),
        body
      ].join("");

      if ((context.role === "doctor" || context.role === "nurse") && CardiacApp.isPendingPatient(patient)) {
        bindCompletionForm(patientId, context);
      }

      CardiacApp.renderIcons();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(container, "فشل تحميل تفاصيل المريض");
    }
  });
})();