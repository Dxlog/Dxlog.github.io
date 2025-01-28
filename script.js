document.addEventListener("DOMContentLoaded", () => {
  const addMealButton = document.getElementById("addMealButton");
  const mealsContainer = document.getElementById("mealsContainer");
  const generatePdfButton = document.getElementById("generatePdfButton");

  // Função para adicionar uma nova refeição
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
  }

  // Função para desenhar o cabeçalho (apenas na primeira página)
  function drawHeader(doc, pageWidth) {
    // Fundo preto no cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 30, "F");

    // Linha laranja no canto inferior direito
    doc.setFillColor("#ff6600");
    doc.rect(pageWidth / 2, 28, pageWidth / 2, 2, "F");

    // Título centralizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#FFFFFF");
    doc.text("PLANO ALIMENTAR | PERSONALIZADO", pageWidth / 2, 20, { align: "center" });
  }

  // Função para desenhar o rodapé (apenas na última página)
  function drawFooter(doc, pageWidth, clientName) {
    // Fundo preto no rodapé
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 280, pageWidth, 20, "F");

    // Texto no rodapé
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text(`Aluno(a): ${clientName}`, 15, 290);
  }

  // Função para desenhar títulos com fundo laranja e linhas horizontais
  function drawSectionTitleWithLines(doc, title, yPosition, pageWidth) {
    const textWidth = doc.getTextWidth(title);
    const centerX = (pageWidth - textWidth) / 2;

    // Linha horizontal acima do título
    doc.setDrawColor("#000");
    doc.setLineWidth(1);
    doc.line(15, yPosition - 5, pageWidth - 15, yPosition - 5);

    // Fundo do título
    doc.setFillColor("#ff6600");
    doc.roundedRect(centerX - 10, yPosition, textWidth + 20, 10, 2, 2, "F");

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#FFFFFF");
    doc.text(title, pageWidth / 2, yPosition + 7, { align: "center" });

    return yPosition + 15; // Retornar nova posição Y
  }

  // Função para desenhar textos descritivos com bolinhas
  function drawDescriptionWithBullets(doc, description, yPosition, pageWidth) {
    const lines = description.split("\n"); // Divide o texto em linhas
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#000");

    lines.forEach((line) => {
      // Adiciona uma bolinha menor, alinhada ao texto
      doc.circle(12, yPosition + 2.5, 0.8, "F");
      doc.text(line.trim(), 15, yPosition + 5);
      yPosition += 8; // Incrementa a posição Y
    });

    return yPosition + 5; // Retornar nova posição Y
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
    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    const guidance = document.getElementById("guidance").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    // Desenhar cabeçalho (somente na primeira página)
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

    // SUPLEMENTAÇÃO E MANIPULADOS
    yPosition = drawSectionTitleWithLines(doc, "SUPLEMENTAÇÃO E MANIPULADOS", yPosition, pageWidth);
    yPosition = drawDescriptionWithBullets(doc, supplementation, yPosition, pageWidth);

    // ORIENTAÇÕES
    yPosition = drawSectionTitleWithLines(doc, "ORIENTAÇÕES", yPosition, pageWidth);
    yPosition = drawDescriptionWithBullets(doc, guidance, yPosition, pageWidth);

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;

      // Verificar espaço disponível antes de adicionar nova refeição
      if (yPosition + 40 > 270) {
        doc.addPage();
        yPosition = 40;
      }

      yPosition = drawSectionTitleWithLines(doc, mealName, yPosition, pageWidth);

      const tableData = Array.from(mealSection.querySelectorAll("tbody tr")).map((row) => [
        row.querySelector(".foodName").value || "Não especificado",
        row.querySelector(".foodProportion").value || "Não especificado",
      ]);

      // Tabela de alimentos e proporções
      doc.autoTable({
        startY: yPosition,
        body: tableData,
        tableWidth: pageWidth - margin * 2,
        columnStyles: {
          0: { cellWidth: (pageWidth - 2 * margin) / 2 },
          1: { cellWidth: (pageWidth - 2 * margin) / 2 },
        },
        styles: { lineColor: [0, 0, 0], lineWidth: 0.5, textColor: "#000" },
        margin: { left: margin },
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    });

    // Desenhar rodapé apenas na última página
    drawFooter(doc, pageWidth, clientName);

    doc.save("Plano_Alimentar.pdf");
  });
});
