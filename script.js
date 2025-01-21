document.addEventListener("DOMContentLoaded", () => {
  const addMealButton = document.getElementById("addMealButton");
  const mealsContainer = document.getElementById("mealsContainer");
  const generatePdfButton = document.getElementById("generatePdfButton");

  // Adicionar nova refeição
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

  function attachMealEvents(mealSection) {
    const addRowBtn = mealSection.querySelector(".addRowBtn");
    const tableBody = mealSection.querySelector("table tbody");

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

    mealSection.querySelectorAll(".removeRowBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest("tr").remove();
      });
    });
  }

  // Gerar PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PLANO ALIMENTAR PERSONALIZADO", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Detalhe no canto inferior direito do cabeçalho
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(2);
    doc.line(doc.internal.pageSize.getWidth() - 60, 29, doc.internal.pageSize.getWidth(), 29); // Linha laranja até metade da página

    // Informações do aluno
    let y = 40;
    const clientName = document.getElementById("clientName").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = document.getElementById("currentDate").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Aluno(a): ${clientName}`, 10, y);
    doc.text(`Peso Atual: ${weight}`, 10, y + 10);
    doc.text(`Data: ${currentDate}`, 10, y + 20);
    doc.text(`N° do Protocolo: ${protocolNumber}`, 10, y + 30);
    y += 40;

    // SUPLEMENTAÇÃO E ORIENTAÇÕES
    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    const guidance = document.getElementById("guidance").value || "Não especificado";

    // SUPLEMENTAÇÃO E MANIPULADOS
    doc.setFontSize(14);
    doc.setFillColor(255, 140, 0);
    doc.roundedRect(110, y, 80, 10, 3, 3, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("SUPLEMENTAÇÃO", 115, y + 5);
    doc.text("E MANIPULADOS", 115, y + 10);

    y += 15;
    doc.setFontSize(12);
    doc.setFillColor(240);
    doc.setDrawColor(100); // Bordas cinza escuras
    doc.rect(110, y, 80, 20, "F");
    doc.text(supplementation, 115, y + 10);

    // ORIENTAÇÕES
    doc.setFontSize(14);
    doc.setFillColor(255, 140, 0);
    doc.roundedRect(10, y, 80, 10, 3, 3, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("ORIENTAÇÕES", 15, y + 7);

    y += 15;
    doc.setFontSize(12);
    doc.setFillColor(240);
    doc.setDrawColor(100);
    doc.rect(10, y, 80, 20, "F");
    doc.text(guidance, 15, y + 10);

    y += 40;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      const mealNameWidth = doc.getTextWidth(mealName) + 10;
      const mealNameX = (doc.internal.pageSize.getWidth() - mealNameWidth) / 2;

      // Fundo do nome da refeição
      doc.setFontSize(14);
      doc.setFillColor(255, 140, 0);
      doc.roundedRect(mealNameX, y, mealNameWidth, 10, 3, 3, "F");
      doc.text(mealName, doc.internal.pageSize.getWidth() / 2, y + 7, { align: "center" });

      // Linhas pretas horizontais ao lado do fundo
      const lineY = y + 5;
      doc.setDrawColor(0, 0, 0);
      doc.line(10, lineY, mealNameX, lineY); // Esquerda
      doc.line(mealNameX + mealNameWidth, lineY, doc.internal.pageSize.getWidth() - 10, lineY); // Direita

      y += 20;

      // Tabela de alimentos e proporções
      const tableBody = mealSection.querySelector("table tbody");
      const rowHeight = 10;

      tableBody.querySelectorAll("tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setFillColor(240);
        doc.setDrawColor(100); // Delimitação bem evidente
        doc.rect(10, y, 140, rowHeight, "F"); // Célula do alimento
        doc.rect(150, y, 50, rowHeight, "F"); // Célula da proporção

        doc.text(foodName, 15, y + 7);
        doc.text(foodProportion, 155, y + 7);
        y += rowHeight;
      });

      y += 10; // Espaçamento entre refeições
    });

    // Rodapé
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 280, doc.internal.pageSize.getWidth(), 20, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(clientName, 10, 290);
    doc.text("henrique.cordeiro@gmail.com", doc.internal.pageSize.getWidth() - 10, 290, { align: "right" });

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
