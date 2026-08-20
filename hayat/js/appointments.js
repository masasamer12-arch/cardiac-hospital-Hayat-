(function () {
  let patients = [];
  let appointments = [];
  let editingId = "";
  let currentContext = null;
  const filters = {
    query: "",
    status: "All",
    date: ""
  };

  function renderForm() {
    return [
      '<section class="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">',
      '<div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">',
      "<div>",
      '<h2 class="text-base font-semibold text-slate-950">نموذج الموعد</h2>',
      '<p class="mt-1 text-sm text-slate-500">يتم تسجيل المواعيد وتحديثها مباشرة ضمن جدول الرعاية.</p>',
      "</div>",
      '<span id="formModeBadge" class="inline-flex w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">وضع الإضافة</span>',
      "</div>",
      '<form id="appointmentForm" class="grid gap-4 lg:grid-cols-6">',
      '<label class="flex flex-col gap-2 lg:col-span-2">',
      '<span class="text-xs font-semibold text-slate-500">المريض</span>',
      '<select id="appointmentPatient" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="">اختر المريض</option>',
      patients.map(function (patient) {
        return '<option value="' + CardiacApp.escapeHtml(patient.id) + '">' + CardiacApp.escapeHtml(patient.name) + "</option>";
      }).join(""),
      "</select>",
      "</label>",
      inputField("appointmentDate", "التاريخ", "date"),
      inputField("appointmentTime", "الوقت", "time"),
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">الحالة</span>',
      '<select id="appointmentStatus" required class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="Scheduled">مجدول</option>',
      '<option value="Urgent">عاجل</option>',
      '<option value="Completed">مكتمل</option>',
      "</select>",
      "</label>",
      '<label class="flex flex-col gap-2 lg:col-span-6">',
      '<span class="text-xs font-semibold text-slate-500">السبب</span>',
      '<input id="appointmentReason" required type="text" placeholder="سبب الموعد" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</label>",
      '<div class="flex flex-wrap gap-2 lg:col-span-6">',
      '<button id="appointmentSubmit" type="submit" class="inline-flex h-11 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">',
      '<i data-lucide="calendar-plus" class="h-4 w-4"></i>',
      "إضافة موعد",
      "</button>",
      '<button id="cancelEdit" type="button" class="hidden h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">',
      '<i data-lucide="x" class="h-4 w-4"></i>',
      "إلغاء",
      "</button>",
      "</div>",
      "</form>",
      "</section>"
    ].join("");
  }

  function inputField(id, label, type) {
    var extraAttrs = "";
    if (id === "appointmentDate") {
      extraAttrs = ' min="' + CardiacApp.todayIso() + '"';
    }
    return [
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">' + label + "</span>",
      '<input id="' + id + '" required type="' + type + '"' + extraAttrs + ' class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</label>"
    ].join("");
  }

  function renderFilters() {
    return [
      '<section class="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">',
      '<div class="grid gap-4 md:grid-cols-[1fr_220px_220px] md:items-end">',
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">البحث</span>',
      '<div class="relative">',
      '<i data-lucide="search" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"></i>',
      '<input id="appointmentSearch" type="search" placeholder="ابحث باسم المريض أو السبب" class="h-11 w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</div>",
      "</label>",
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">الحالة</span>',
      '<select id="appointmentStatusFilter" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      '<option value="All">الكل</option>',
      '<option value="Scheduled">مجدول</option>',
      '<option value="Urgent">عاجل</option>',
      '<option value="Completed">مكتمل</option>',
      "</select>",
      "</label>",
      '<label class="flex flex-col gap-2">',
      '<span class="text-xs font-semibold text-slate-500">التاريخ</span>',
      '<input id="appointmentDateFilter" type="date" class="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">',
      "</label>",
      "</div>",
      "</section>"
    ].join("");
  }

  function getFilteredAppointments() {
    return appointments.filter(function (appointment) {
      const patientName = appointment.patient ? appointment.patient.name : "مريض غير معروف";
      const haystack = (patientName + " " + appointment.reason + " " + CardiacApp.translateReason(appointment.reason)).toLowerCase();
      const matchesSearch = haystack.includes(filters.query.toLowerCase());
      const matchesStatus = filters.status === "All" || appointment.status === filters.status;
      const matchesDate = !filters.date || appointment.date === filters.date;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  function renderAppointments() {
    const list = document.getElementById("appointmentsResults");
    const filtered = getFilteredAppointments();

    if (!filtered.length) {
      list.innerHTML = CardiacApp.emptyState("لا توجد مواعيد", "جرّب حالة أو تاريخًا أو كلمة بحث مختلفة.");
      CardiacApp.renderIcons();
      return;
    }

    const rows = filtered.map(function (appointment) {
      const patientName = appointment.patient ? appointment.patient.name : "مريض غير معروف";
      const actions = appointment.isLocal
        ? [
          '<div class="flex items-center gap-2">',
          '<button type="button" data-edit-id="' + CardiacApp.escapeHtml(appointment.id) + '" title="تعديل الموعد" class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">',
          '<i data-lucide="pencil" class="h-4 w-4"></i>',
          "</button>",
          '<button type="button" data-delete-id="' + CardiacApp.escapeHtml(appointment.id) + '" title="حذف الموعد" class="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50">',
          '<i data-lucide="trash-2" class="h-4 w-4"></i>',
          "</button>",
          "</div>"
        ].join("")
        : '<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">سجل أساسي</span>';

      return [
        "<tr>",
        '<td class="px-4 py-3 font-medium text-slate-900">' + CardiacApp.escapeHtml(patientName) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(CardiacApp.formatDate(appointment.date)) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(appointment.time) + "</td>",
        '<td class="px-4 py-3">' + CardiacApp.appointmentBadge(appointment.status) + "</td>",
        '<td class="px-4 py-3 text-slate-700">' + CardiacApp.escapeHtml(CardiacApp.translateReason(appointment.reason)) + "</td>",
        '<td class="px-4 py-3">' + actions + "</td>",
        "</tr>"
      ].join("");
    }).join("");

    list.innerHTML = CardiacApp.tableShell(["اسم المريض", "التاريخ", "الوقت", "الحالة", "السبب", "الإجراءات"], rows);
    CardiacApp.renderIcons();
  }

  function fillForm(appointment) {
    editingId = appointment.id;
    document.getElementById("appointmentPatient").value = appointment.patientId;
    document.getElementById("appointmentDate").value = appointment.date;
    document.getElementById("appointmentTime").value = appointment.time;
    document.getElementById("appointmentStatus").value = appointment.status;
    document.getElementById("appointmentReason").value = appointment.reason;
    document.getElementById("appointmentSubmit").innerHTML = '<i data-lucide="save" class="h-4 w-4"></i>تحديث الموعد';
    document.getElementById("cancelEdit").classList.remove("hidden");
    document.getElementById("cancelEdit").classList.add("inline-flex");
    document.getElementById("formModeBadge").textContent = "تعديل موعد";
    CardiacApp.renderIcons();
  }

  function resetForm() {
    editingId = "";
    document.getElementById("appointmentForm").reset();
    document.getElementById("appointmentStatus").value = "Scheduled";
    document.getElementById("appointmentSubmit").innerHTML = '<i data-lucide="calendar-plus" class="h-4 w-4"></i>إضافة موعد';
    document.getElementById("cancelEdit").classList.add("hidden");
    document.getElementById("cancelEdit").classList.remove("inline-flex");
    document.getElementById("formModeBadge").textContent = "وضع الإضافة";
    CardiacApp.renderIcons();
  }

  async function refreshAppointments() {
    appointments = await CardiacApp.getAppointmentsWithPatients();
    renderAppointments();
  }

  function getFormValue(id) {
    return document.getElementById(id).value.trim();
  }

  function getPatientName(patientId) {
    const patient = patients.find(function (item) {
      return item.id === patientId;
    });

    return patient ? patient.name : "مريض غير معروف";
  }

  function notifyAppointmentChange(action, appointment) {
    if (!currentContext) {
      return;
    }

    const actionLabels = {
      added: "تمت إضافة موعد جديد",
      updated: "تم تعديل موعد",
      deleted: "تم حذف موعد"
    };
    const actionTexts = {
      added: "أضاف موعدًا",
      updated: "عدّل موعدًا",
      deleted: "حذف موعدًا"
    };

    const patientName = getPatientName(appointment.patientId);
    const message = currentContext.user.name + " " + actionTexts[action] + " للمريض " + patientName + " بتاريخ " + CardiacApp.formatDate(appointment.date) + " الساعة " + appointment.time + ".";

    CardiacApp.addNotification({
      title: actionLabels[action],
      message,
      icon: action === "deleted" ? "trash-2" : "calendar-clock",
      type: "appointment",
      link: "appointments.html",
      createdByRole: currentContext.role,
      createdByName: currentContext.user.name
    });
  }

  function bindEvents() {
    document.getElementById("appointmentForm").addEventListener("submit", async function (event) {
      event.preventDefault();

      var selectedDate = getFormValue("appointmentDate");
      var today = CardiacApp.todayIso();
      if (selectedDate < today) {
        alert("لا يمكن إضافة موعد بتاريخ سابق. يرجى اختيار تاريخ اليوم أو تاريخ لاحق.");
        document.getElementById("appointmentDate").focus();
        return;
      }

      const formAppointment = {
        patientId: getFormValue("appointmentPatient"),
        doctorId: "1",
        date: getFormValue("appointmentDate"),
        time: getFormValue("appointmentTime"),
        status: getFormValue("appointmentStatus"),
        reason: getFormValue("appointmentReason")
      };

      const localAppointments = CardiacApp.getLocalAppointments();

      if (editingId) {
        CardiacApp.saveLocalAppointments(localAppointments.map(function (appointment) {
          return appointment.id === editingId
            ? { ...appointment, ...formAppointment }
            : appointment;
        }));
        notifyAppointmentChange("updated", formAppointment);
      } else {
        const newAppointment = {
          id: "local-appointment-" + Date.now(),
          ...formAppointment
        };

        CardiacApp.saveLocalAppointments(localAppointments.concat(newAppointment));
        notifyAppointmentChange("added", newAppointment);
      }

      resetForm();
      await refreshAppointments();
    });

    document.getElementById("cancelEdit").addEventListener("click", resetForm);

    document.getElementById("appointmentsResults").addEventListener("click", async function (event) {
      const editButton = event.target.closest("[data-edit-id]");
      const deleteButton = event.target.closest("[data-delete-id]");

      if (editButton) {
        const localAppointment = CardiacApp.getLocalAppointments().find(function (appointment) {
          return appointment.id === editButton.dataset.editId;
        });

        if (localAppointment) {
          fillForm(localAppointment);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }

      if (deleteButton) {
          const confirmed = window.confirm("هل تريد حذف هذا الموعد؟");

        if (confirmed) {
          const deletedAppointment = CardiacApp.getLocalAppointments().find(function (appointment) {
            return appointment.id === deleteButton.dataset.deleteId;
          });
          const updated = CardiacApp.getLocalAppointments().filter(function (appointment) {
            return appointment.id !== deleteButton.dataset.deleteId;
          });

          CardiacApp.saveLocalAppointments(updated);
          if (deletedAppointment) {
            notifyAppointmentChange("deleted", deletedAppointment);
          }
          await refreshAppointments();
        }
      }
    });

    document.getElementById("appointmentSearch").addEventListener("input", function (event) {
      filters.query = event.target.value.trim();
      renderAppointments();
    });

    document.getElementById("appointmentStatusFilter").addEventListener("change", function (event) {
      filters.status = event.target.value;
      renderAppointments();
    });

    document.getElementById("appointmentDateFilter").addEventListener("change", function (event) {
      filters.date = event.target.value;
      renderAppointments();
    });
  }

  CardiacApp.onReady(async function (context) {
    currentContext = context;
    const container = document.getElementById("page-content");
    CardiacApp.showLoading(container, "جاري تحميل المواعيد...");

    try {
      patients = await CardiacApp.getPatients();
      appointments = await CardiacApp.getAppointmentsWithPatients();

      container.innerHTML = [
        CardiacApp.pageHeader("المواعيد", "أنشئ المواعيد، فلتر السجلات، وتابع جدول الرعاية الخاص بالمرضى."),
        renderForm(),
        renderFilters(),
        '<div id="appointmentsResults"></div>'
      ].join("");

      bindEvents();
      renderAppointments();
      CardiacApp.renderIcons();
    } catch (error) {
      console.error(error);
      CardiacApp.showError(container, "فشل تحميل المواعيد");
    }
  });
})();