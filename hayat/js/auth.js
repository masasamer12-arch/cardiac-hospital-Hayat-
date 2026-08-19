(function () {
  const validRoles = ["doctor", "nurse", "receptionist"];

  const roleLabels = {
    doctor:" طبيبة",
    nurse: "ممرضة",
    receptionist: "موظف استقبال"
  };

  const roleDashboards = {
    doctor: "dashboard.html",
    nurse: "nurse-dashboard.html",
    receptionist: "reception-dashboard.html"
  };

  function getRole() {
    return localStorage.getItem("userRole");
  }

  function setRole(role) {
    if (!validRoles.includes(role)) {
      return;
    }

    localStorage.setItem("userRole", role);
  }

  function logout() {
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!getRole() && document.body.dataset.page !== "index") {
      window.location.href = "index.html";
    }
  });

  window.CardiacAuth = {
    validRoles,
    roleLabels,
    roleDashboards,
    getRole,
    setRole,
    logout
  };
})();
