<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plano Alimentar</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
</head>
<body>
  <div class="container">
    <h1>Plano Alimentar Personalizado</h1>

    <div class="client-info">
      <label>Nome do Aluno:</label>
      <input type="text" id="clientName" placeholder="Digite o nome do aluno">
      <label>Peso Atual:</label>
      <input type="text" id="weight" placeholder="Digite o peso atual">
      <label>Data:</label>
      <input type="date" id="currentDate">
      <label>Protocolo Nº:</label>
      <input type="text" id="protocolNumber" placeholder="Digite o número do protocolo">
    </div>

    <div class="supplement-guidance">
      <div class="supplementation">
        <h2>SUPLEMENTAÇÃO E MANIPULADOS</h2>
        <textarea id="supplementation" placeholder="Digite as suplementações..."></textarea>
      </div>
      <div class="guidance">
        <h2>ORIENTAÇÕES</h2>
        <textarea id="guidance" placeholder="Digite as orientações..."></textarea>
      </div>
    </div>

    <div id="mealsContainer"></div>
    <button id="addMealButton">Adicionar Refeição</button>
    <button id="generatePdfButton">Gerar PDF</button>
  </div>
  <script src="script.js"></script>
</body>
</html>
