document.addEventListener("DOMContentLoaded", () => {
  const mealsContainer = document.getElementById("mealsContainer");
  const addMealButton = document.getElementById("addMealButton");
  const generatePdfButton = document.getElementById("generatePdfButton");

  // Função para adicionar refeições
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
  }

  // Função para desenhar o cabeçalho
  function drawHeader(doc, pageWidth) {
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setDrawColor("#ff6600");
    doc.line(5, 5, 20, 5);
    doc.line(5, 5, 5, 20);
    doc.setFillColor("#ff6600");
    doc.rect(pageWidth - 60, 28, 60, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#FFFFFF");
    doc.text("PLANO ALIMENTAR | PERSONALIZADO", pageWidth / 2, 20, { align: "center" });
  }

  // Função para gerar PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    drawHeader(doc, pageWidth);

    // Inclua os campos SUPLEMENTAÇÃO E ORIENTAÇÕES no PDF
    const supplementation = document.getElementById("supplementation").value || "Não informado";
    const guidance = document.getElementById("guidance").value || "Não informado";

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`SUPLEMENTAÇÃO E MANIPULADOS: ${supplementation}`, 15, 50);
    doc.text(`ORIENTAÇÕES: ${guidance}`, 15, 60);

    doc.save("Plano_Alimentar.pdf");
  });
});
