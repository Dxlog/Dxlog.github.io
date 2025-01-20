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

    // Detalhes do cabeçalho
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(2);
    // Linha no canto superior esquerdo
    doc.line(0, 0, 0, 15); // Linha vertical
    doc.line(0, 0, 15, 0); // Linha horizontal
    // Linha no canto inferior direito
    doc.line(doc.internal.pageSize.getWidth() - 60, 29, doc.internal.pageSize.getWidth(), 29);

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

    // SUPLEMENTAÇÃO
    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    doc.setFontSize(14);
    doc.text("SUPLEMENTAÇÃO E MANIPULADOS:", 10, y);
    doc.setFontSize(12);
    doc.text(supplementation, 10, y + 10);

    y += 30;

    // ORIENTAÇÕES
    const guidance = document.getElementById("guidance").value || "Não especificado";
    doc.setFontSize(14);
    doc.text("ORIENTAÇÕES:", 10, y);
    doc.setFontSize(12);
    doc.text(guidance, 10, y + 10);

    y += 30;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFontSize(14);
      doc.setFillColor(255, 140, 0);
      doc.roundedRect(60, y, 90, 10, 3, 3, "F");
      doc.setTextColor(0, 0, 0);
      doc.text(mealName, doc.internal.pageSize.getWidth() / 2, y + 7, { align: "center" });

      // Linhas pretas e laranjas ao lado do fundo
      doc.setDrawColor(0, 0, 0); // Preto
      doc.line(10, y + 5, 55, y + 5); // Esquerda
      doc.line(doc.internal.pageSize.getWidth() - 55, y + 5, doc.internal.pageSize.getWidth() - 10, y + 5); // Direita
      doc.setDrawColor(255, 140, 0); // Laranja
      doc.line(10, y + 7, 55, y + 7); // Esquerda
      doc.line(doc.internal.pageSize.getWidth() - 55, y + 7, doc.internal.pageSize.getWidth() - 10, y + 7); // Direita

      y += 20;

      // Tabela de alimentos
      const tableBody = mealSection.querySelector("table tbody");
      tableBody.querySelectorAll("tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";
        doc.setFontSize(12);
        doc.setFillColor(240);
        doc.rect(10, y, doc.internal.pageSize.getWidth() - 20, 10, "F");
        doc.text(`${foodName} - ${foodProportion}`, 15, y + 7);
        y += 10;
      });
      y += 10;
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
