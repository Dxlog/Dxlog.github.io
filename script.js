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

  // Função para desenhar títulos com linhas acima e fundo laranja
  function drawSectionTitle(doc, title, yPosition, pageWidth, backgroundColor = "#ff6600") {
    const textWidth = doc.getTextWidth(title);
    const centerX = (pageWidth - textWidth) / 2;

    // Linhas horizontais acima do título
    doc.setDrawColor("#000");
    doc.setLineWidth(1); // Linha mais fina
    doc.line(15, yPosition, pageWidth - 15, yPosition); // Linha acima do título

    yPosition += 5;

    // Fundo
    doc.setFillColor(backgroundColor);
    doc.roundedRect(centerX - 10, yPosition, textWidth + 20, 10, 2, 2, "F");

    // Texto centralizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor("#FFFFFF");
    doc.text(title, pageWidth / 2, yPosition + 7, { align: "center" });

    return yPosition + 15; // Nova posição Y
  }

  // Função para desenhar o cabeçalho
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
    const supplementation = document.getElementById("supplementation").value || "Não especificado";
    const guidance = document.getElementById("guidance").value || "Não especificado";
    const currentDate = new Date().toLocaleDateString("pt-BR");

    // Desenhar cabeçalho
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
    yPosition = drawSectionTitle(doc, "SUPLEMENTAÇÃO E MANIPULADOS", yPosition, pageWidth);

    doc.setFontSize(10);
    doc.setTextColor("#000"); // Texto preto sem negrito
    doc.text(supplementation, margin, yPosition);

    yPosition += 20;

    // ORIENTAÇÕES
    yPosition = drawSectionTitle(doc, "ORIENTAÇÕES", yPosition, pageWidth);

    doc.setFontSize(10);
    doc.setTextColor("#000"); // Texto preto sem negrito
    doc.text(guidance, margin, yPosition);

    yPosition += 25;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;

      // Verificar espaço disponível antes de adicionar nova refeição
      if (yPosition + 40 > 270) {
        doc.addPage();
        yPosition = 40;
        drawHeader(doc, pageWidth);
        drawFooter(doc, pageWidth, clientName);
      }

      yPosition = drawSectionTitle(doc, mealName, yPosition, pageWidth);

      const tableData = Array.from(mealSection.querySelectorAll("tbody tr")).map((row) => [
        row.querySelector(".foodName").value || "Não especificado",
        row.querySelector(".foodProportion").value || "Não especificado",
      ]);

      doc.autoTable({
        startY: yPosition,
        body: tableData,
        tableWidth: pageWidth / 1.5, // Mais curta
        styles: { lineColor: [0, 0, 0], lineWidth: 0.5, textColor: "#000" }, // Letras pretas
        margin: { left: (pageWidth - pageWidth / 1.5) / 2 }, // Centralizada
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    });

    drawFooter(doc, pageWidth, clientName);
    doc.save("Plano_Alimentar.pdf");
  });
});
