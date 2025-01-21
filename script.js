document.addEventListener("DOMContentLoaded", () => {
  const addMealButton = document.getElementById("addMealButton");
  const mealsContainer = document.getElementById("mealsContainer");
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
            <td><button type="button" class="removeRow">Excluir</button></td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="addRow">Adicionar Alimento</button>
    `;
    mealsContainer.appendChild(mealSection);
    attachMealEvents(mealSection);
  });

  function attachMealEvents(section) {
    const addRowBtn = section.querySelector(".addRow");
    const tbody = section.querySelector("tbody");

    addRowBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" class="foodName" placeholder="Ex.: Arroz"></td>
        <td><input type="text" class="foodProportion" placeholder="Ex.: 50g"></td>
        <td><button type="button" class="removeRow">Excluir</button></td>
      `;
      tbody.appendChild(newRow);
      newRow.querySelector(".removeRow").addEventListener("click", () => newRow.remove());
    });
  }

  // Gerar o PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("PLANO ALIMENTAR PERSONALIZADO", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Dados do aluno
    const name = document.getElementById("clientName").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const date = document.getElementById("currentDate").value || "Não especificado";
    const protocol = document.getElementById("protocolNumber").value || "Não especificado";

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Aluno(a): ${name}`, 10, 40);
    doc.text(`Peso Atual: ${weight}`, 10, 50);
    doc.text(`Data: ${date}`, 10, 60);
    doc.text(`Protocolo Nº: ${protocol}`, 10, 70);

    doc.save("Plano_Alimentar.pdf");
  });
});
