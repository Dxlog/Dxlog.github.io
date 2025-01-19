document.addEventListener("DOMContentLoaded", () => {
  const mealsContainer = document.getElementById("mealsContainer");
  const addMealButton = document.getElementById("addMealButton");
  const generatePdfButton = document.getElementById("generatePdfButton");

  // Função para adicionar nova refeição
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

  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 40;

    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    const guidance = document.getElementById("guidance").value || "Não especificado";

    // Cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#FFFFFF");
    doc.text("PLANO ALIMENTAR | PERSONALIZADO", pageWidth / 2, 20, { align: "center" });

    // SUPLEMENTAÇÃO
    yPosition += 20;
    doc.setFillColor("#ff6600");
    doc.rect(margin, yPosition, pageWidth - margin * 2, 10, "F");
    doc.setTextColor("#FFFFFF");
    doc.text("SUPLEMENTAÇÃO E MANIPULADOS", pageWidth / 2, yPosition + 7, { align: "center" });
    yPosition += 15;
    doc.setFillColor("#f5f5f5");
    doc.rect(margin, yPosition, pageWidth - margin * 2, 20, "F");
    doc.setTextColor("#000");
    doc.text(supplementation, margin + 5, yPosition + 10);

    // ORIENTAÇÕES
    yPosition += 30;
    doc.setFillColor("#ff6600");
    doc.rect(margin, yPosition, pageWidth - margin * 2, 10, "F");
    doc.setTextColor("#FFFFFF");
    doc.text("ORIENTAÇÕES", pageWidth / 2, yPosition + 7, { align: "center" });
    yPosition += 15;
    doc.setFillColor("#f5f5f5");
    doc.rect(margin, yPosition, pageWidth - margin * 2, 20, "F");
    doc.setTextColor("#000");
    doc.text(guidance, margin + 5, yPosition + 10);

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
