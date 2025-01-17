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

    // Margem verde estilizada
    doc.setFillColor("#013220");
    doc.rect(0, 0, pageWidth, pageHeight, "S");

    // Logomarca
    const logoPath = "logo-henrique-cordeiro.png";
    doc.addImage(logoPath, "PNG", margin, 10, 30, 30);

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#FFFFFF");
    doc.text("PLANO ALIMENTAR PERSONALIZADO", pageWidth / 2, 25, { align: "center" });

    let yPosition = 50;

    // Informações do Cliente
    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    doc.setFontSize(12);
    doc.setTextColor("#FFFFFF");
    doc.text(`ALUNO(A): ${clientName}`, margin, yPosition);
    doc.text(`PROTOCOLO: ${protocolNumber}`, margin, yPosition + 10);
    doc.text(`PESO ATUAL: ${weight} kg`, margin, yPosition + 20);
    doc.text(`DATA: ${currentDate}`, margin, yPosition + 30);

    yPosition += 50;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFontSize(14);
      doc.setTextColor("#FFFFFF");
      doc.text(`Refeição ${index + 1}: ${mealName}`, margin, yPosition);

      yPosition += 10;

      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Nova página se necessário
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
