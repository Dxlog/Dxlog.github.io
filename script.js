let mealCount = 1; // Contador de refeições

// Adiciona uma nova linha na tabela de alimentos
function addRow(tableId) {
    const table = document.getElementById(tableId).querySelector("tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="text" placeholder="Ex: Alimento"></td>
        <td><input type="text" placeholder="Ex: Proporção"></td>
        <td><button type="button" onclick="removeRow(this)">Remover</button></td>
    `;
    table.appendChild(newRow);
}

// Remove uma linha da tabela de alimentos
function removeRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Adiciona uma nova refeição dinamicamente
function addMeal() {
    mealCount++;
    const mealsContainer = document.getElementById("mealsContainer");

    const newMeal = document.createElement("div");
    newMeal.className = "meal";
    newMeal.id = `meal${mealCount}`;

    newMeal.innerHTML = `
        <div class="form-section">
            <label for="mealName${mealCount}">Nome da Refeição:</label>
            <input type="text" id="mealName${mealCount}" placeholder="Ex: Almoço">
        </div>
        <table id="mealTable${mealCount}">
            <thead>
                <tr>
                    <th>Nome do Alimento</th>
                    <th>Proporção</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" placeholder="Ex: Arroz"></td>
                    <td><input type="text" placeholder="Ex: 100g"></td>
                    <td><button type="button" onclick="addRow('mealTable${mealCount}')">Adicionar Linha</button></td>
                </tr>
            </tbody>
        </table>
        <div class="form-section">
            <label for="substitutions${mealCount}">Opções de Substituição:</label>
            <textarea id="substitutions${mealCount}" placeholder="Ex: Batata ou Quinoa"></textarea>
        </div>
    `;
    mealsContainer.appendChild(newMeal);
}

// Gera o PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const clientName = document.getElementById("clientName").value || "Não especificado";
    const weight = document.getElementById("weight").value || "Não especificado";
    const protocolNumber = document.getElementById("protocolNumber").value || "Não especificado";
    const date = document.getElementById("date").value || "Não especificado";

    const suggestions = document.getElementById("suggestions").value || "Sem sugestões adicionadas.";
    const supplements = document.getElementById("supplements").value || "Sem suplementações adicionadas.";

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PLANO ALIMENTAR PERSONALIZADO", 105, 20, null, null, "center");

    // Dados do cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome do Cliente: ${clientName}`, 20, 40);
    doc.text(`Peso Atual: ${weight} kg`, 20, 50);
    doc.text(`Protocolo: ${protocolNumber}`, 20, 60);
    doc.text(`Data: ${date}`, 20, 70);

    let yOffset = 90;

    // Refeições
    for (let i = 1; i <= mealCount; i++) {
        const mealName = document.getElementById(`mealName${i}`).value || `Refeição ${i}`;
        const substitutions = document.getElementById(`substitutions${i}`).value || "Sem opções de substituição.";

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`${mealName}`, 20, yOffset);
        yOffset += 10;

        const rows = document.querySelectorAll(`#mealTable${i} tbody tr`);
        rows.forEach(row => {
            const foodName = row.cells[0].querySelector("input").value || "Não especificado";
            const proportion = row.cells[1].querySelector("input").value || "Não especificado";
            doc.text(`- ${foodName}: ${proportion}`, 25, yOffset);
            yOffset += 8;
        });

        doc.text(`Opções de Substituição: ${substitutions}`, 25, yOffset);
        yOffset += 20;
    }

    // Sugestões e Suplementações
    doc.setFont("helvetica", "bold");
    doc.text("Sugestões:", 20, yOffset);
    yOffset += 10;
    doc.setFont("helvetica", "normal");
    doc.text(suggestions, 25, yOffset);
    yOffset += 20;

    doc.setFont("helvetica", "bold");
    doc.text("Suplementações:", 20, yOffset);
    yOffset += 10;
    doc.setFont("helvetica", "normal");
    doc.text(supplements, 25, yOffset);

    // Rodapé
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("diegossilva03@gmail.com", 105, 290, null, null, "center");

    doc.save("plano_alimentar_personalizado.pdf");
}
