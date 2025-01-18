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
    let yPosition = 40;

    // Informações do cliente
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

    yPosition += 20;

    // Informações principais do aluno
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Aluno(a): ${clientName}`, margin, yPosition);
    doc.text(`Peso Atual: ${weight} kg`, margin, yPosition + 10);
    doc.text(`Data: ${currentDate}`, margin, yPosition + 20);
    doc.text(`N° do Protocolo: ${protocolNumber}`, margin, yPosition + 30);

    yPosition += 40;

    // Refeições
    document.querySelectorAll(".meal-section").forEach((mealSection, index) => {
      const mealName = mealSection.querySelector(".mealName").value || `Refeição ${index + 1}`;
      doc.setFontSize(14);
      doc.setFillColor("#ff6600"); // Fundo laranja
      doc.setTextColor("#FFFFFF"); // Texto branco
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, "F"); // Fundo laranja para o título da refeição
      doc.text(mealName, pageWidth / 2, yPosition + 7, { align: "center" });

      yPosition += 15;

      mealSection.querySelectorAll("tbody tr").forEach((row) => {
        const foodName = row.querySelector(".foodName").value || "Não especificado";
        const foodProportion = row.querySelector(".foodProportion").value || "Não especificado";

        doc.setFontSize(12);
        doc.setTextColor("#000");
        doc.text(`- ${foodName}: ${foodProportion}`, margin + 10, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Adicionar nova página se necessário
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
    });

    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor("#ff6600"); // Laranja
    doc.text("henrique.cordeiro@gmail.com", pageWidth - margin, 290, { align: "right" });
    doc.text(`Aluno(a): ${clientName}`, margin, 290);

    // Salvar PDF
    doc.save("Plano_Alimentar.pdf");
  });
});
