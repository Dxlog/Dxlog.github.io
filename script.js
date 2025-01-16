function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("portrait", "mm", "a4");

    // Paleta de cores
    const darkGreen = "#006400"; // Verde escuro
    const black = "#000000";

    // Dados do cliente
    const clientName = document.getElementById("clientName").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const date = document.getElementById("date").value || "Não especificado";

    const suggestions = document.getElementById("suggestions").value || "Sem sugestões adicionadas.";
    const supplements = document.getElementById("supplements").value || "Sem suplementações adicionadas.";

    // Cabeçalho
    doc.setFillColor(darkGreen);
    doc.rect(0, 0, 210, 40, "F"); // Fundo verde escuro
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#ffffff");
    doc.text("PLANO ALIMENTAR PERSONALIZADO", 105, 20, null, null, "center");

    // Dados do cliente - Seção
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(black);
    doc.text(`Nome do Cliente: ${clientName}`, 20, 50);
    doc.text(`Peso Atual: ${weight} kg`, 20, 60);
    doc.text(`Protocolo: ${protocolNumber}`, 20, 70);
    doc.text(`Data: ${date}`, 20, 80);

    // Divisor entre seções
    doc.setDrawColor(darkGreen);
    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);

    let yOffset = 95;

    // Refeições
    for (let i = 1; i <= mealCount; i++) {
        const mealName = document.getElementById(`mealName${i}`).value || `Refeição ${i}`;
        const substitutions = document.getElementById(`substitutions${i}`).value || "Sem opções de substituição.";

        // Título da Refeição
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`${mealName}`, 20, yOffset);
        yOffset += 8;

        const rows = document.querySelectorAll(`#mealTable${i} tbody tr`);
        rows.forEach(row => {
            const foodName = row.cells[0].querySelector("input").value || "Não especificado";
            const proportion = row.cells[1].querySelector("input").value || "Não especificado";
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`- ${foodName}: ${proportion}`, 25, yOffset);
            yOffset += 6;
        });

        // Opções de substituição
        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.text(`Opções de Substituição: ${substitutions}`, 25, yOffset);
        yOffset += 10;

        // Divisor após cada refeição
        if (i < mealCount) {
            doc.setDrawColor(darkGreen);
            doc.setLineWidth(0.3);
            doc.line(20, yOffset, 190, yOffset);
            yOffset += 8;
        }
    }

    // Sugestões e Suplementações
    doc.setFont("helvetica", "bold");
    doc.text("Sugestões:", 20, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "normal");
    doc.text(suggestions, 25, yOffset);
    yOffset += 20;

    doc.setFont("helvetica", "bold");
    doc.text("Suplementações:", 20, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "normal");
    doc.text(supplements, 25, yOffset);

    // Rodapé com email padrão
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(darkGreen);
    doc.text("diegossilva03@gmail.com", 105, 290, null, null, "center");

    // Salvar PDF
    doc.save("plano_alimentar_personalizado.pdf");
}
