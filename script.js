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

    // Adicionar linha
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

  // Gerar PDF com todas as informações
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFillColor("#013220");
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setTextColor("#FFFFFF");
    doc.text("Plano Alimentar Personalizado", 105, 20, { align: "center" });

    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Nome do Cliente: ${clientName}`, 20, 50);
    doc.text(`Número do Protocolo: ${protocolNumber}`, 20, 60);
    doc.text(`Peso Atual: ${weight} kg`, 20, 70);

    let yPosition = 90;

    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFontSize(14);
      doc.setTextColor("#013220");
      doc.text(`${index + 1}. ${mealName}`, 20, yPosition);
      yPosition += 10;

      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, 25, yPosition);
        yPosition += 8;
      });

      yPosition += 10;
    });

    // Rodapé
    doc.setFillColor("#013220");
    doc.rect(0, 287, 210, 10, "F");
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text("© 2025 Henrique Cordeiro Nutrition", 105, 293, { align: "center" });

    doc.save("Plano_Alimentar.pdf");
  });
});
