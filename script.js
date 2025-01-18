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

    const margin = 15;
    let yPosition = 30;

    const logoPath = "logo-henrique-cordeiro.png.png";
    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    // Cabeçalho estilizado
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(14);
    doc.text(`Cliente: ${clientName}`, margin, 20);
    doc.text(`Data: ${currentDate}`, margin, 28);
    doc.text("henrique.cordeiro@gmail.com", doc.internal.pageSize.getWidth() - margin, 20, { align: "right" });

    // Logo no canto esquerdo
    doc.addImage(logoPath, "PNG", margin, 5, 20, 20);

    yPosition += 40;

    // Informações principais
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Protocolo: ${protocolNumber}`, margin, yPosition);
    doc.text(`Peso Atual: ${weight} kg`, margin, yPosition + 10);

    yPosition += 20;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFontSize(14);
      doc.setTextColor("#ff6600");
      doc.text(`Refeição ${index + 1}: ${mealName}`, margin, yPosition);

      yPosition += 10;

      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, yPosition);
        yPosition += 8;
      });

      yPosition += 10;
    });

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
