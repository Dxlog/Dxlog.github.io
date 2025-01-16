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

  // Gerar PDF futurista e ajustado
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações básicas
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // Margem ao redor do conteúdo

    // Cabeçalho do PDF com título estilizado
    const logoPath = "logo-henrique-cordeiro.png.png"; // Caminho da logomarca
    const currentDate = new Date().toLocaleDateString("pt-BR");

    doc.addImage(logoPath, "PNG", margin, margin, 30, 30); // Logomarca
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28); // Título em fonte maior e estilizada
    doc.setTextColor("#013220");
    doc.text("Plano Alimentar Personalizado", pageWidth / 2, 35, { align: "center" });

    const clientName = document.getElementById("clientName").value || "Nome não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Cliente: ${clientName}`, margin, 60);
    doc.text(`Número do Protocolo: ${protocolNumber}`, margin, 70);
    doc.text(`Peso Atual: ${weight} kg`, margin, 80);

    // Listar refeições estilizadas em blocos futuristas
    let yPosition = 100;
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      
      // Estilizar bloco da refeição
      doc.setFillColor("#013220");
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 3, 3, "F"); // Fundo verde escuro
      doc.setFontSize(14);
      doc.setTextColor("#FFFFFF");
      doc.text(`${index + 1}. ${mealName}`, margin + 5, yPosition + 10); // Nome da refeição
      yPosition += 20;

      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        // Informações dos alimentos
        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Adicionar nova página, se necessário
      if (yPosition > pageHeight - 30) {
        addFooter(doc, pageWidth, pageHeight, clientName, currentDate); // Adicionar rodapé antes de criar nova página
        doc.addPage();
        yPosition = margin;
      }
    });

    // Rodapé em todas as páginas
    addFooter(doc, pageWidth, pageHeight, clientName, currentDate);

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });

  // Função para adicionar rodapé
  function addFooter(doc, pageWidth, pageHeight, clientName, currentDate) {
    const email = "diegossilva03@gmail.com";
    doc.setFillColor("#013220");
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");

    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text(`E-mail: ${email}`, 10, pageHeight - 10);
    doc.text(`Cliente: ${clientName}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text(`Data: ${currentDate}`, pageWidth - 40, pageHeight - 10);
  }
});
