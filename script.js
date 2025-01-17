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
    const margin = 15;
    let yPosition = 30;

    // Título estilizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#013220");
    doc.text("PLANO ALIMENTAR PERSONALIZADO", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 20;

    // Informações do cliente
    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`ALUNO(A): ${clientName}`, margin, yPosition);
    doc.text(`PROTOCOLO: ${protocolNumber}`, margin, yPosition + 10);
    doc.text(`PESO ATUAL: ${weight} kg`, margin, yPosition + 20);
    doc.text(`DATA: ${currentDate}`, margin, yPosition + 30);

    yPosition += 50;

    // Gerar refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      const items = mealSection.querySelectorAll("tbody tr");
      const sectionHeight = 15 + items.length * 8;

      // Quadro de refeição
      doc.setFillColor("#013220");
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, sectionHeight, 3, 3, "F");
      doc.setFontSize(14);
      doc.setTextColor("#FFFFFF");
      doc.text(`${index + 1}. ${mealName}`, margin + 5, yPosition + 10);

      let itemY = yPosition + 20;
      items.forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, itemY);
        itemY += 8;
      });

      yPosition += sectionHeight + 10;

      // Nova página se necessário
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Rodapé
    doc.setFillColor("#013220");
    doc.rect(0, 280, pageWidth, 20, "F");
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text("HC Nutrition - Todos os direitos reservados", pageWidth / 2, 290, { align: "center" });
    doc.text("E-mail: diegossilva03@gmail.com", 10, 290);

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
