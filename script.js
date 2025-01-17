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

  // Gerenciar eventos dentro de uma refeição
  function attachMealEvents(section) {
    const addRowBtn = section.querySelector(".addRowBtn");
    const tableBody = section.querySelector("table tbody");

    // Adicionar linha
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

  // Gerar PDF com formato ajustado
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações básicas
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15; // Margem padrão
    const sectionHeight = 50; // Altura dos blocos das refeições
    let yPosition = 50;

    // Adicionar título e cabeçalho
    const logoPath = "logo-henrique-cordeiro.png.png";
    const currentDate = new Date().toLocaleDateString("pt-BR");
    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";

    // Logomarca e título
    doc.addImage(logoPath, "PNG", margin, margin, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#013220");
    doc.text("PLANO ALIMENTAR PERSONALIZADO", pageWidth / 2, 25, { align: "center" });

    // Informações do cliente
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Aluno(a): ${clientName}`, margin, 45);
    doc.text(`Peso Atual: ${weight} kg`, margin, 55);
    doc.text(`Protocolo: ${protocolNumber}`, margin, 65);
    doc.text(`Data: ${currentDate}`, margin, 75);

    // Enquadrar refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFillColor("#013220");
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, sectionHeight, 3, 3, "F"); // Fundo verde
      doc.setFontSize(14);
      doc.setTextColor("#FFFFFF");
      doc.text(`${index + 1}. ${mealName}`, margin + 5, yPosition + 10); // Nome da refeição

      // Alimentos dentro do bloco
      let itemY = yPosition + 20;
      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, itemY);
        itemY += 6;
      });

      yPosition += sectionHeight + 10; // Espaçamento entre os blocos

      // Criar nova página, se necessário
      if (yPosition > 270) {
        yPosition = 20; // Reiniciar a posição no topo da nova página
        doc.addPage();
      }
    });

    // Adicionar rodapé
    addFooter(doc, pageWidth);

    // Salvar o PDF
    doc.save("Plano_Alimentar.pdf");
  });

  // Função para adicionar rodapé
  function addFooter(doc, pageWidth) {
    doc.setFillColor("#013220");
    doc.rect(0, 280, pageWidth, 20, "F");
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text("E-mail: diegossilva03@gmail.com", 10, 290);
    doc.text("HC Nutrition - Todos os direitos reservados", pageWidth / 2, 290, { align: "center" });
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - 40, 290);
  }
});
