document.addEventListener("DOMContentLoaded", () => {
  const mealsContainer = document.getElementById("mealsContainer");
  const addMealButton = document.getElementById("addMealButton");
  const generatePdfButton = document.getElementById("generatePdfButton");

  // Adicionar uma nova refeição
  addMealButton.addEventListener("click", () => {
    const mealSection = document.createElement("div");
    mealSection.classList.add("meal-section");

    mealSection.innerHTML = `
      <h3>Refeição</h3>
      <label>Nome da Refeição:</label>
      <input type="text" class="mealName" placeholder="Digite o nome da refeição">
      <table>
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Proporção</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" class="foodName" placeholder="Ex.: Frango"></td>
            <td><input type="text" class="foodProportion" placeholder="Ex.: 100g"></td>
            <td><button type="button" class="removeRowBtn">Excluir</button></td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="addRowBtn">Adicionar Linha</button>
    `;

    mealsContainer.appendChild(mealSection);
    attachMealEvents(mealSection);
  });

  // Gerenciar eventos dentro de uma refeição
  function attachMealEvents(section) {
    const addRowBtn = section.querySelector(".addRowBtn");
    const tableBody = section.querySelector("table tbody");

    addRowBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" class="foodName" placeholder="Ex.: Arroz"></td>
        <td><input type="text" class="foodProportion" placeholder="Ex.: 50g"></td>
        <td><button type="button" class="removeRowBtn">Excluir</button></td>
      `;
      tableBody.appendChild(newRow);

      newRow.querySelector(".removeRowBtn").addEventListener("click", () => {
        newRow.remove();
      });
    });

    section.querySelectorAll(".removeRowBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest("tr").remove();
      });
    });
  }

  // Gerar PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Plano Alimentar Personalizado", 105, 20, { align: "center" });

    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    doc.setFontSize(12);
    doc.text(`Nome do Cliente: ${clientName}`, 20, 40);

    // Processar refeições
    const meals = document.querySelectorAll(".meal-section");
    let yPosition = 60;

    meals.forEach((meal, index) => {
      const mealName = meal.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.text(`${mealName}:`, 20, yPosition);
      yPosition += 10;

      const rows = meal.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const foodName = row.querySelector(".foodName").value || "Alimento não especificado";
        const proportion = row.querySelector(".foodProportion").value || "Proporção não especificada";
        doc.text(`- ${foodName}: ${proportion}`, 30, yPosition);
        yPosition += 10;
      });

      yPosition += 10;
    });

    doc.save("Plano_Alimentar.pdf");
  });
});
