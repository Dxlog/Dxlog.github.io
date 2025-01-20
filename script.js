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

    // Cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PLANO ALIMENTAR PERSONALIZADO", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Corpo do PDF
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
