(function () {
  const validRoles = ["doctor"];

  const roleLabels = {
    doctor: "طبيبة"
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
    getRole,
    setRole,
    logout
  };
})();
