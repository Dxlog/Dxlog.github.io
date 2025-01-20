document.addEventListener("DOMContentLoaded", () => {
  const mealsContainer = document.getElementById("mealsContainer");
  const addMealButton = document.getElementById("addMealButton");
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

  // Função para gerenciar eventos de adicionar/remover linhas nas refeições
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

  // Função para gerar PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 40;

    // Informações do aluno
    const clientName = document.getElementById("clientName").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = document.getElementById("currentDate").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";

    doc.setFontSize(12);
    doc.text(`Aluno(a): ${clientName}`, margin, yPosition);
    doc.text(`Peso Atual: ${weight}`, margin, yPosition + 10);
    doc.text(`Data: ${currentDate}`, margin, yPosition + 20);
    doc.text(`N° do Protocolo: ${protocolNumber}`, margin, yPosition + 30);
    yPosition += 40;

    // SUPLEMENTAÇÃO
    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    doc.setFontSize(14);
    doc.text("SUPLEMENTAÇÃO E MANIPULADOS:", margin, yPosition);
    doc.setFontSize(12);
    doc.text(supplementation, margin, yPosition + 10);
    yPosition += 20;

    // ORIENTAÇÕES
    const guidance = document.getElementById("guidance").value || "Não especificado";
    doc.setFontSize(14);
    doc.text("ORIENTAÇÕES:", margin, yPosition);
    doc.setFontSize(12);
    doc.text(guidance, margin, yPosition + 10);
    yPosition += 20;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFontSize(14);
      doc.text(mealName, margin, yPosition);
      yPosition += 10;

      const tableBody = mealSection.querySelector("table tbody");
      tableBody.querySelectorAll("tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";
        doc.setFontSize(12);
        doc.text(`${foodName} - ${foodProportion}`, margin, yPosition);
        yPosition += 10;
      });
      yPosition += 10;
    });

    // Rodapé
    doc.setFontSize(10);
    doc.text("henrique.cordeiro@gmail.com", margin, 290, { align: "right" });

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
