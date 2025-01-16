document.getElementById("addMealButton").addEventListener("click", addMeal);
document.getElementById("generatePdfButton").addEventListener("click", generatePDF);

function addMeal() {
  const mealsContainer = document.getElementById("mealsContainer");

  const mealSection = document.createElement("div");
  mealSection.classList.add("meal-section");

  mealSection.innerHTML = `
    <div class="meal-title">Refeição</div>
    <div class="field-group">
      <label for="mealName">Nome da Refeição:</label>
      <input type="text" class="meal-name" placeholder="Digite o nome da refeição">
    </div>
    <div class="field-group">
      <label for="food">Alimento e Proporção:</label>
      <input type="text" class="food" placeholder="Exemplo: Frango (100g)">
    </div>
  `;

  mealsContainer.appendChild(mealSection);
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Adicionar logomarca
  const logo = new Image();
  logo.src = "logo-henrique-cordeiro.png.png";

  logo.onload = () => {
    doc.addImage(logo, "PNG", 10, 10, 40, 40);

    // Título do PDF
    doc.setFontSize(22);
    doc.setTextColor("#013220");
    doc.text("PLANO ALIMENTAR PERSONALIZADO", 60, 30);

    // Dados do cliente
    const clientName = document.getElementById("clientName").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Nome do Cliente: ${clientName}`, 20, 60);
    doc.text(`Número do Protocolo: ${protocolNumber}`, 20, 70);
    doc.text(`Peso Atual: ${weight} kg`, 20, 80);

    // Refeições
    const meals = document.querySelectorAll(".meal-section");
    let yPosition = 100;
    meals.forEach((meal, index) => {
      const mealName = meal.querySelector(".meal-name").value || `Refeição ${index + 1}`;
      const food = meal.querySelector(".food").value || "Não especificado";

      doc.setFontSize(14);
      doc.setTextColor("#013220");
      doc.text(mealName, 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setTextColor("#000");
      doc.text(`- ${food}`, 30, yPosition);
      yPosition += 10;
    });

    doc.save("plano_alimentar_personalizado.pdf");
  };
}
