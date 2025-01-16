function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = "logo.png"; // Certifique-se de que o arquivo "logo.png" esteja no mesmo diretório.

    // Adicionar logomarca ao PDF
    doc.addImage(logo, "PNG", 10, 10, 30, 30);

    // Título principal
    doc.setFontSize(20);
    doc.setTextColor("#006400");
    doc.text("PLANO ALIMENTAR PERSONALIZADO", 55, 20);

    // Dados do cliente
    const clientName = document.getElementById("clientName").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Nome do Cliente: ${clientName}`, 20, 50);
    doc.text(`Número do Protocolo: ${protocolNumber}`, 20, 60);
    doc.text(`Peso Atual: ${weight} kg`, 20, 70);

    // Refeições
    let yPosition = 80;
    const meals = document.querySelectorAll(".meal");
    meals.forEach((meal, index) => {
        const mealName = meal.querySelector(".meal-name").value || `Refeição ${index + 1}`;
        doc.setFontSize(14);
        doc.setTextColor("#006400");
        doc.text(mealName, 20, yPosition);
        yPosition += 10;

        const foods = meal.querySelectorAll(".food-row");
        foods.forEach(food => {
            const foodName = food.querySelector(".food-name").value || "Alimento não especificado";
            const proportion = food.querySelector(".proportion").value || "Proporção não especificada";
            doc.setFontSize(12);
            doc.setTextColor("#000");
            doc.text(`- ${foodName}: ${proportion}`, 30, yPosition);
            yPosition += 8;
        });

        yPosition += 10; // Espaçamento entre refeições
    });

    // Salvar PDF
    doc.save("plano_alimentar_personalizado.pdf");
}
