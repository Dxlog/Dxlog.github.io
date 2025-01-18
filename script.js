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

  // Função para anexar eventos às refeições
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
    let yPosition = 35;

    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    // Cabeçalho estilizado
    doc.setFillColor(0, 0, 0); // Fundo preto
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#FFFFFF"); // Texto branco
    doc.text("Plano Alimentar Personalizado", pageWidth / 2, 20, { align: "center" });

    // Detalhe laranja estilizado no cabeçalho
    doc.setFillColor("#ff6600");
    doc.rect(pageWidth / 2, 28, pageWidth / 2, 1, "F");

    yPosition += 15;

    // Informações principais do aluno (subidas no layout)
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Aluno(a): ${clientName}`, margin, yPosition);
    doc.text(`Peso Atual: ${weight} kg`, margin, yPosition + 8);
    doc.text(`Data: ${currentDate}`, margin, yPosition + 16);
    doc.text(`N° do Protocolo: ${protocolNumber}`, margin, yPosition + 24);

    yPosition += 35;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;

      // Fundo laranja estilizado e proporcional para o título da refeição
      doc.setFontSize(14);
      doc.setFillColor("#ff6600");
      const titleWidth = doc.getTextWidth(mealName) + 20; // Proporcional ao texto
      const titleX = (pageWidth - titleWidth) / 2;
      doc.rect(titleX, yPosition, titleWidth, 10, "F");
      doc.setTextColor("#FFFFFF");
      doc.text(mealName, pageWidth / 2, yPosition + 7, { align: "center" });

      yPosition += 15;

      // Alimentos e proporções
      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, yPosition);
        yPosition += 8;

        // Adicionar nova página se necessário
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 35;

          // Repetir cabeçalho na nova página
          doc.setFillColor(0, 0, 0);
          doc.rect(0, 0, pageWidth, 30, "F");
          doc.setTextColor("#FFFFFF");
          doc.text("Plano Alimentar Personalizado", pageWidth / 2, 20, { align: "center" });
          doc.setFillColor("#ff6600");
          doc.rect(pageWidth / 2, 28, pageWidth / 2, 1, "F");

          yPosition += 10;
        }
      });

      yPosition += 10;
    });

    // Rodapé com fundo preto menor
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 280, pageWidth, 15, "F"); // Fundo preto menor
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text(`Aluno(a): ${clientName}`, margin, 290);
    doc.text("henrique.cordeiro@gmail.com", pageWidth - margin, 290, { align: "right" });

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
