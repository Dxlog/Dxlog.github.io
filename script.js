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

  // Função para desenhar o cabeçalho
  function drawHeader(doc, pageWidth) {
    // Fundo preto no cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 30, "F");

    // "V" estilizado no canto superior esquerdo
    doc.setDrawColor("#ff6600");
    doc.setLineWidth(0.8);
    doc.line(5, 5, 25, 15); // Primeira linha diagonal
    doc.line(5, 15, 25, 5); // Segunda linha diagonal

    // Linha laranja no canto inferior direito
    doc.setFillColor("#ff6600");
    doc.rect(pageWidth / 2, 28, pageWidth / 2, 2, "F");

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#FFFFFF"); // Texto branco
    doc.text("Plano Alimentar Personalizado", pageWidth / 2, 20, { align: "center" });
  }

  // Função para desenhar o rodapé
  function drawFooter(doc, pageWidth, clientName) {
    // Fundo preto cobrindo todo o final da página
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 280, pageWidth, 20, "F");

    // Texto no rodapé
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text(`Aluno(a): ${clientName}`, 15, 290);
    doc.text("henrique.cordeiro@gmail.com", pageWidth - 15, 290, { align: "right" });
  }

  // Função para gerar PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 40;

    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    // Desenhar cabeçalho na primeira página
    drawHeader(doc, pageWidth);

    yPosition += 10;

    // Informações principais do aluno
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

      // Nome da refeição com fundo laranja abaixo e linhas laterais
      doc.setFontSize(14);
      doc.setFillColor("#ff6600");
      doc.rect(margin, yPosition + 5, pageWidth - 2 * margin, 7, "F"); // Fundo laranja maior
      doc.setTextColor("#000000");
      doc.text(mealName, pageWidth / 2, yPosition, { align: "center" });

      // Linhas laterais preta e laranja
      doc.setDrawColor("#000000");
      doc.line(margin - 5, yPosition, margin - 5, yPosition + 12); // Linha preta
      doc.setDrawColor("#ff6600");
      doc.line(pageWidth - margin + 5, yPosition, pageWidth - margin + 5, yPosition + 12); // Linha laranja

      yPosition += 20;

      // Quadrinhos para alimentos e proporções
      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        // Quadrinhos mais evidentes
        doc.setFillColor("#f5f5f5");
        doc.rect(margin, yPosition, (pageWidth - 2 * margin) / 2, 10, "F"); // Alimento
        doc.rect(margin + (pageWidth - 2 * margin) / 2, yPosition, (pageWidth - 2 * margin) / 2, 10, "F"); // Proporção

        doc.setFontSize(10);
        doc.setTextColor("#000");
        doc.text(foodName, margin + 5, yPosition + 7);
        doc.text(foodProportion, margin + (pageWidth - 2 * margin) / 2 + 5, yPosition + 7);

        yPosition += 12;

        // Adicionar nova página se necessário
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 40;

          // Repetir cabeçalho e rodapé na nova página
          drawHeader(doc, pageWidth);
          drawFooter(doc, pageWidth, clientName);
        }
      });

      yPosition += 10;
    });

    // Rodapé na última página
    drawFooter(doc, pageWidth, clientName);

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
