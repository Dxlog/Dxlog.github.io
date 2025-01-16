document.addEventListener("DOMContentLoaded", () => {
  const mealsContainer = document.getElementById("mealsContainer");
  const addMealBtn = document.getElementById("addMealBtn");

  // Adicionar Refeição
  addMealBtn.addEventListener("click", () => {
    const mealSection = document.createElement("div");
    mealSection.classList.add("meal-section");

    mealSection.innerHTML = `
      <label for="mealName">Nome da Refeição:</label>
      <input type="text" class="mealName" placeholder="Digite o nome da refeição">
      <table class="meal-table">
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Proporção</th>
            <th>Ação</th>
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

    attachRowHandlers(mealSection);
  });

  // Adicionar/Remover Linhas
  function attachRowHandlers(section) {
    const addRowBtn = section.querySelector(".addRowBtn");
    const mealTable = section.querySelector(".meal-table tbody");

    addRowBtn.addEventListener("click", () => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td><input type="text" class="foodName" placeholder="Ex.: Frango"></td>
        <td><input type="text" class="foodProportion" placeholder="Ex.: 100g"></td>
        <td><button type="button" class="removeRowBtn">Excluir</button></td>
      `;
      mealTable.appendChild(newRow);

      newRow.querySelector(".removeRowBtn").addEventListener("click", () => {
        newRow.remove();
      });
    });

    section.querySelectorAll(".removeRowBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.target.closest("tr").remove();
      });
    });
  }

  // Inicializar para a seção existente
  attachRowHandlers(mealsContainer.querySelector(".meal-section"));
});
