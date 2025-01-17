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

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = 30;

    // Adicionar logomarca e cabeçalho estilizado
    doc.setFillColor("#ff6600");
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setFontSize(14);
    doc.setTextColor("#FFFFFF");
    doc.text("Plano Alimentar Personalizado", pageWidth / 2, 13, { align: "center" });

    // Rodapé estilizado
    doc.setFillColor("#ff6600");
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(10);
    doc.text(`Cliente: ${document.getElementById("clientName").value || "Nome não especificado"}`, margin, pageHeight - 10);
    doc.text("henrique.cordeiro@gmail.com", pageWidth - margin, pageHeight - 10, { align: "right" });

    yPosition += 30;

    // Adicionar refeições e campos de sugestões/suplementações
    // Segunda folha: logomarca no centro inferior + campos adicionais
    doc.addPage();
    doc.text("Suplementações:", margin, 30);
    doc.text("Sugestões:", margin, 80);
    doc.addImage("logo-path.png", "PNG", pageWidth / 2 - 15, pageHeight - 40, 30, 30);

    doc.save("Plano_Alimentar.pdf");
  });
});
