document.getElementById("generatePdfButton").addEventListener("click", generatePDF);

function generatePDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cores
  const forestGreen = "#013220";
  const black = "#000000";

  // Configuração de fonte
  doc.setFont("helvetica", "normal");

  // Cabeçalho com logomarca e título
  doc.setFillColor(forestGreen);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFontSize(22);
  doc.setTextColor("#FFFFFF");
  doc.text("PLANO ALIMENTAR PERSONALIZADO", pageWidth / 2, 15, { align: "center" });

  // Adicionar logomarca no canto superior esquerdo
  const logoPath = "logo-henrique-cordeiro.png.png";
  doc.addImage(logoPath, "PNG", 10, 5, 20, 20);

  // Nome do Cliente
  doc.setFontSize(14);
  doc.setTextColor(black);
  doc.text("Nome do Cliente:", 20, 50);
  const clientName = document.getElementById("clientName").value || "Não especificado";
  doc.setTextColor(forestGreen);
  doc.text(clientName, 60, 50);

  // Número do Protocolo e Peso
  doc.setTextColor(black);
  doc.text("Número do Protocolo:", 20, 60);
  const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
  doc.setTextColor(forestGreen);
  doc.text(protocolNumber, 60, 60);

  doc.setTextColor(black);
  doc.text("Peso Atual (kg):", 20, 70);
  const weight = document.getElementById("weight").value || "Não especificado";
  doc.setTextColor(forestGreen);
  doc.text(weight, 60, 70);

  // Refeições
  const meals = document.querySelectorAll("#mealsContainer .meal-section");
  doc.setTextColor(black);
  doc.text("Refeições:", 20, 90);
  let yPosition = 100;

  meals.forEach((meal, index) => {
    const mealName = meal.querySelector("input[type='text']").value || "Não especificado";
    const mealDetails = meal.querySelector("textarea").value || "Não especificado";

    doc.setFillColor(forestGreen);
    doc.rect(15, yPosition - 5, pageWidth - 30, 10, "F");
    doc.setTextColor("#FFFFFF");
    doc.text(`${index + 1}. ${mealName}`, 20, yPosition);

    doc.setTextColor(black);
    doc.setFontSize(12);
    yPosition += 10;
    doc.text(mealDetails, 20, yPosition);

    yPosition += 15;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Suplementações e Sugestões
  doc.setTextColor(black);
  doc.setFontSize(14);
  doc.text("Suplementações:", 20, yPosition);
  yPosition += 10;
  const supplementations = document.getElementById("supplementations").value || "Não especificado";
  doc.setTextColor(forestGreen);
  doc.setFontSize(12);
  doc.text(supplementations, 20, yPosition, { maxWidth: pageWidth - 40 });

  yPosition += 20;
  doc.setTextColor(black);
  doc.setFontSize(14);
  doc.text("Sugestões:", 20, yPosition);
  yPosition += 10;
  const suggestions = document.getElementById("suggestions").value || "Não especificado";
  doc.setTextColor(forestGreen);
  doc.setFontSize(12);
  doc.text(suggestions, 20, yPosition, { maxWidth: pageWidth - 40 });

  // Rodapé
  doc.setFillColor(forestGreen);
  doc.rect(0, 287, pageWidth, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor("#FFFFFF");
  doc.text("Henrique Cordeiro Nutrition - © 2025", pageWidth / 2, 293, { align: "center" });

  // Salvar PDF
  doc.save("Plano_Alimentar.pdf");
}
