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

  // Função para gerar o PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 40;

    const clientName = document.getElementById("clientName").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = document.getElementById("currentDate").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    const guidance = document.getElementById("guidance").value || "Não especificado";

    // Cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#FFFFFF");
    doc.text("PLANO ALIMENTAR | PERSONALIZADO", pageWidth / 2, 20, { align: "center" });

    // Informações do aluno
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Aluno(a): ${clientName}`, margin, yPosition);
    doc.text(`Peso Atual: ${weight}`, margin, yPosition + 8);
    doc.text(`Data: ${currentDate}`, margin, yPosition + 16);
    doc.text(`N° do Protocolo: ${protocolNumber}`, margin, yPosition + 24);

    yPosition += 40;

    // SUPLEMENTAÇÃO E MANIPULADOS
    doc.setFillColor("#ff6600");
    doc.rect(margin, yPosition, (pageWidth - margin * 2) / 2, 10, "F");
    doc.setTextColor("#FFFFFF");
    doc.text("SUPLEMENTAÇÃO E MANIPULADOS", margin + 5, yPosition + 7);

    doc.setFontSize(10);
    doc.setTextColor("#000");
    doc.rect(margin, yPosition + 15, (pageWidth - margin * 2) / 2, 20, "D");
    doc.text(supplementation, margin + 5, yPosition + 25);

    // ORIENTAÇÕES
    doc.setFillColor("#ff6600");
    doc.rect(margin + (pageWidth - margin * 2) / 2 + 5, yPosition, (pageWidth - margin * 2) / 2 - 5, 10, "F");
    doc.setTextColor("#FFFFFF");
    doc.text("ORIENTAÇÕES", margin + (pageWidth - margin * 2) / 2 + 10, yPosition + 7);

    doc.setFontSize(10);
    doc.setTextColor("#000");
    doc.rect(margin + (pageWidth - margin * 2) / 2 + 5, yPosition + 15, (pageWidth - margin * 2) / 2 - 5, 20, "D");
    doc.text(guidance, margin + (pageWidth - margin * 2) / 2 + 10, yPosition + 25);

    yPosition += 40;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;

      doc.setFontSize(14);
      doc.setFillColor("#ff6600");
      doc.rect(margin, yPosition, pageWidth - margin * 2, 10, "F");
      doc.setTextColor("#FFFFFF");
      doc.text(mealName, margin + 5, yPosition + 7);

      yPosition += 15;

      // Alimentos
      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFillColor("#f5f5f5");
        doc.rect(margin, yPosition, (pageWidth - margin * 2) / 2, 10, "D");
        doc.text(foodName, margin + 5, yPosition + 7);

        doc.rect(margin + (pageWidth - margin * 2) / 2, yPosition, (pageWidth - margin * 2) / 2, 10, "D");
        doc.text(foodProportion, margin + (pageWidth - margin * 2) / 2 + 5, yPosition + 7);

        yPosition += 12;
      });

      yPosition += 10;
    });

    // Rodapé
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 280, pageWidth, 20, "F");
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text(`Aluno(a): ${clientName}`, margin, 290);
    doc.text("henrique.cordeiro@gmail.com", pageWidth - margin, 290, { align: "right" });

    doc.save("Plano_Alimentar.pdf");
  });
});
